import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate'); // YYYY-MM-DD
    const endDate = searchParams.get('endDate'); // YYYY-MM-DD
    const grade = searchParams.get('grade'); // Optional grade filter

    if (!startDate || !endDate) return new NextResponse("Start and End Date required", { status: 400 });

    const studentWhere: Prisma.StudentWhereInput = {
        grade: grade && grade !== '' ? grade : undefined
    };

    const attendanceWhere: Prisma.AttendanceWhereInput = {
        date: {
            gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)), // Start of day
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) // End of day
        },
        studentId: { not: null }
    };

    try {
        // Fetch students and their attendance
        const studentList = await prisma.student.findMany({
            where: studentWhere,
            include: {
                attendance: {
                    where: attendanceWhere,
                    orderBy: { date: 'asc' }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Transform data
        const reportData = studentList.map(item => ({
            id: item.id,
            name: item.name,
            nationalId: item.nationalId,
            grade: item.grade,
            attendance: item.attendance.map(a => ({
                date: a.date.toISOString().split('T')[0],
                status: a.status,
                entryTime: a.entryTime,
                exitTime: a.exitTime,
                reason: a.reason
            })),
            summary: {
                present: item.attendance.filter(a => a.status === 'PRESENTE').length,
                absent: item.attendance.filter(a => a.status === 'AUSENTE').length,
                late: item.attendance.filter(a => a.status === 'LLEGADA_TARDE').length,
                excused: item.attendance.filter(a => a.status === 'PERMISO' || a.status === 'REPOSO').length
            }
        }));

        return NextResponse.json(reportData);
    } catch (error) {
        console.error("Student report error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
