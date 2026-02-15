import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { name, nationalId, dateOfBirth, grade } = body;

        const student = await prisma.student.create({
            data: {
                name,
                nationalId,
                dateOfBirth: new Date(dateOfBirth),
                grade
            }
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error('[STUDENTS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const students = await prisma.student.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(students);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
