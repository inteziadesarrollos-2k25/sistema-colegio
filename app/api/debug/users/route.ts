import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const createAdmin = searchParams.get("create_admin");

    try {
        // 1. List existing users (safely)
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                // We don't return the full password, just a check if it exists
                password: true,
            }
        });

        const safeUsers = users.map(u => ({
            ...u,
            password: u.password ? "HASHED_PASSWORD_EXISTS" : "MISSING_PASSWORD"
        }));

        // 2. Create Admin if requested
        let message = "Listing users";
        let newAdmin = null;

        if (createAdmin === "true") {
            const hashedPassword = await bcrypt.hash("admin123", 10);

            // Try to create or update admin
            newAdmin = await prisma.user.upsert({
                where: { username: "admin" },
                update: {
                    password: hashedPassword,
                    role: "ADMIN"
                },
                create: {
                    username: "admin",
                    password: hashedPassword,
                    name: "Administrador Recuperado",
                    role: "ADMIN"
                }
            });
            message = "Admin user created/reset successfully. Login with: admin / admin123";
        }

        return NextResponse.json({
            message,
            total_users: users.length,
            users: safeUsers,
            created_admin: newAdmin ? "Yes" : "No"
        });

    } catch (error: any) {
        return NextResponse.json({
            error: "Database error",
            details: error.message
        }, { status: 500 });
    }
}
