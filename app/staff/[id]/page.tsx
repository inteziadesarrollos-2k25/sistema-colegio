import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StaffDetailClient from "./StaffDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getStaff(id: string) {
    const staff = await prisma.staff.findUnique({
        where: { id },
        include: {
            attendance: true,
            documents: { orderBy: { createdAt: 'desc' } }
        }
    });
    return staff;
}

export default async function StaffDetailPage({ params }: PageProps) {
    const { id } = await params;
    const staff = await getStaff(id);

    if (!staff) {
        notFound();
    }

    return <StaffDetailClient staff={staff} />;
}
