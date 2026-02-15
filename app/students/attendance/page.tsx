import { prisma } from "@/lib/prisma";
import { GRADES } from "@/lib/constants";
import BulkStudentAttendanceClient from "./BulkStudentAttendanceClient";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getStudentsByGrade(grade: string | undefined) {
    if (!grade) return [];

    return await prisma.student.findMany({
        where: { grade },
        orderBy: { name: 'asc' }
    });
}

export default async function ManageStudentAttendancePage({ searchParams }: PageProps) {
    const { grade } = await searchParams;
    const selectedGrade = typeof grade === 'string' ? grade : '';

    const students = await getStudentsByGrade(selectedGrade);

    return (
        <BulkStudentAttendanceClient
            students={students}
            grades={GRADES}
            initialGrade={selectedGrade}
        />
    );
}
