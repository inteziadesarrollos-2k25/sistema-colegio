import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { date, records } = body;

        await Promise.all(records.map(async (record: any) => {
            const { studentId, status, entryTime, exitTime, reason } = record;

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
                return prisma.attendance.update({
                    where: { id: existing.id },
                    data: { status, entryTime, exitTime, reason }
                });
            } else {
                return prisma.attendance.create({
                    data: {
                        studentId,
                        date: new Date(date),
                        status,
                        entryTime,
                        exitTime,
                        reason
                    }
                });
            }
        }));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Bulk attendance error:", error);
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}
