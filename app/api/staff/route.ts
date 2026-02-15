import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const role = searchParams.get('role');

    const where: Prisma.StaffWhereInput = {
        isActive: true, // Only show active staff by default? Maybe allow filtering
    };

    if (q) {
        where.name = { contains: q };
    }
    if (role) {
        where.role = { equals: role };
    }

    try {
        const staff = await prisma.staff.findMany({
            where,
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { documents: true } }
            }
        });
        return NextResponse.json(staff);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { name, nationalId, role, position, email, phone, hireDate } = body;

        // Check duplicate
        const existing = await prisma.staff.findUnique({
            where: { nationalId }
        });

        if (existing) {
            return new NextResponse("Staff with this ID already exists", { status: 409 });
        }

        const staff = await prisma.staff.create({
            data: {
                name,
                nationalId,
                role,
                position,
                email,
                phone,
                hireDate: hireDate ? new Date(hireDate) : null,
                isActive: true
            }
        });

        return NextResponse.json(staff);
    } catch (error) {
        console.error('[STAFF_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
