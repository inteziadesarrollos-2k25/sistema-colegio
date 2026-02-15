import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Define ContextProps correctly for Next.js 15+
interface ContextProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(req: Request, props: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        // Await params before using properties
        const params = await props.params;
        const { id } = params;
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


export async function DELETE(req: Request, props: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const params = await props.params;
        const { id } = params;
        await prisma.student.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
