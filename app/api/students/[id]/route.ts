import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Define ContextProps correctly for Next.js 15+
interface ContextProps {
    params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        // Await params before using properties
        const { id } = await params;
        const body = await req.json();
        const { name, nationalId, dateOfBirth, grade } = body;

        const student = await prisma.student.update({
            where: { id },
            data: {
                name,
                nationalId,
                dateOfBirth: new Date(dateOfBirth),
                grade
            }
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error('[STUDENT_UPDATE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        await prisma.student.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
