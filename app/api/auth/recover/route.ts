import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { username, answer1, answer2, answer3, newPassword } = await req.json();

        if (!username || !answer1 || !answer2 || !answer3 || !newPassword) {
            return new NextResponse("Faltan datos", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        // Verify answers
        if (!user.securityA1 || !user.securityA2 || !user.securityA3) {
            return new NextResponse("El usuario no tiene configuradas las preguntas de seguridad. Contacte al administrador.", { status: 400 });
        }

        const validA1 = await bcrypt.compare(answer1.toLowerCase(), user.securityA1);
        const validA2 = await bcrypt.compare(answer2.toLowerCase(), user.securityA2);
        const validA3 = await bcrypt.compare(answer3.toLowerCase(), user.securityA3);

        if (!validA1 || !validA2 || !validA3) {
            return new NextResponse("Respuestas incorrectas", { status: 401 });
        }

        // Update Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Recovery error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
