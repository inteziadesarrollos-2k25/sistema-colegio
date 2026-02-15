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
        // records: [{ staffId, status, entryTime, exitTime, reason }]

        // Use transaction? Or just Promise.all
        // Since we are iterating and upserting, Promise.all is fine.

        await Promise.all(records.map(async (record: any) => {
            const { staffId, status, entryTime, exitTime, reason } = record;

            // Check existing
            const existing = await prisma.attendance.findFirst({
                where: {
                    staffId,
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
                        staffId,
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
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
