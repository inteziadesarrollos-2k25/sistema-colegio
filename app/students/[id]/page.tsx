import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StudentDetailClient from "./StudentDetailClient";

// Define PageProps correctly for Next.js 15+
interface PageProps {
    params: Promise<{ id: string }>;
}

async function getStudent(id: string) {
    const student = await prisma.student.findUnique({
        where: { id },
        include: {
            attendance: true,
            academicRecords: true,
            documents: { orderBy: { createdAt: 'desc' } }
        }
    });
    return student;
}

export default async function StudentDetailPage({ params }: PageProps) {
    const { id } = await params;
    const student = await getStudent(id);

    if (!student) {
        notFound();
    }

    // Pass serialized data to client component to avoid serialization issues
    // Dates need to be strings or handling by the client component if passed directly from server components in some setups,
    // but usually passing the object works if it's plain JSON-serializable. 
    // However, Prisma Date objects are Date instances. Next.js server components to client components serialization handles Dates fine in recent versions,
    // but sometimes it's safer to transform if issues arise. For now, passing directly.
    return <StudentDetailClient student={student} />;
}
