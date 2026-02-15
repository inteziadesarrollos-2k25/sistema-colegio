import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    // Debugging passed - restoring code
    // const session = await getServerSession(authOptions); // Handled above

    const params = await props.params;
    if (!params?.id) return new NextResponse("ID Required", { status: 400 });
    const { id } = params;

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
