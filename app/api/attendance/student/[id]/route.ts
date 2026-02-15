import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    try {
        await prisma.attendance.delete({
            where: { id: id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete attendance error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
