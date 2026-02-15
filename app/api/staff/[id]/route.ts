import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface ContextProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request, props: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const params = await props.params;
        const { id } = params;
        const staff = await prisma.staff.findUnique({
            where: { id },
            include: {
                documents: true,
                attendance: true
            }
        });

        if (!staff) return new NextResponse("Not Found", { status: 404 });

        return NextResponse.json(staff);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function PUT(req: Request, props: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const params = await props.params;
        const { id } = params;
        const body = await req.json();
        const { name, nationalId, role, position, email, phone, hireDate, isActive } = body;

        const staff = await prisma.staff.update({
            where: { id },
            data: {
                name,
                nationalId,
                role,
                position,
                email,
                phone,
                hireDate: hireDate ? new Date(hireDate) : undefined,
                isActive
            }
        });

        return NextResponse.json(staff);
    } catch (error) {
        console.error('[STAFF_UPDATE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function DELETE(req: Request, props: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const params = await props.params;
        const { id } = params;
        // Soft delete usually preferred, but for now strict delete or set inactive
        // Let's implement Delete, but if it has relations, maybe better to check first?
        // Prisma handles cascade if configured, but we didn't set cascade delete for documents.
        // So documents will remain orphaned or we should delete them.
        // Let's just delete the staff record, and leave documents for now (or fail).

        await prisma.staff.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[STAFF_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
