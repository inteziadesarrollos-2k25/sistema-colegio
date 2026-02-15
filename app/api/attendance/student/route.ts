import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Prisma } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const month = searchParams.get('month'); // "2024-02"

    if (!studentId) return new NextResponse("Student ID required", { status: 400 });

    const where: Prisma.AttendanceWhereInput = {
        studentId: studentId
    };

    if (month) {
        const [year, m] = month.split('-');
        const startDate = new Date(parseInt(year), parseInt(m) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(m), 0, 23, 59, 59);

        where.date = {
            gte: startDate,
            lte: endDate
        };
    }

    try {
        const attendance = await prisma.attendance.findMany({
            where,
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(attendance);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const formData = await req.formData();
        const studentId = formData.get('studentId') as string;
        const date = formData.get('date') as string;
        const status = formData.get('status') as string;
        const reason = formData.get('reason') as string || '';
        const entryTime = formData.get('entryTime') as string || null;
        const exitTime = formData.get('exitTime') as string || null;
        const file = formData.get('file') as File | null;

        let fileUrl = null;

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), 'public', 'uploads', 'attendance', 'students');
            await mkdir(uploadDir, { recursive: true });

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            fileUrl = `/uploads/attendance/students/${filename}`;
        }

        const existing = await prisma.attendance.findFirst({
            where: {
                studentId,
                date: {
                    gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                    lt: new Date(new Date(date).setHours(23, 59, 59, 999))
                }
            }
        });

        if (existing) {
            const updated = await prisma.attendance.update({
                where: { id: existing.id },
                data: {
                    status,
                    reason,
                    entryTime,
                    exitTime,
                    fileUrl: fileUrl || existing.fileUrl
                }
            });
            return NextResponse.json(updated);
        }

        const attendance = await prisma.attendance.create({
            data: {
                studentId,
                date: new Date(date),
                status,
                reason,
                entryTime,
                exitTime,
                fileUrl
            }
        });

        return NextResponse.json(attendance);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
