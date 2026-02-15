import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import BulkAttendanceClient from "./BulkAttendanceClient";

async function getActiveStaff() {
    return await prisma.staff.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    });
}

export default async function ManageAttendancePage() {
    const staff = await getActiveStaff();
    return <BulkAttendanceClient staff={staff} />;
}
