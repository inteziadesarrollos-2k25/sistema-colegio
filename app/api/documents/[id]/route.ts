import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Define ContextProps correctly for Next.js 15+
interface ContextProps {
    params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const type = formData.get('type') as string;
        const content = formData.get('content') as string;
        const file = formData.get('file') as File | null;

        let fileUrl = undefined; // Undefined means "do not update" in Prisma update

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true });

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            fileUrl = `/uploads/${filename}`;
        }

        const document = await prisma.document.update({
            where: { id },
            data: {
                title,
                type,
                content,
                ...(fileUrl && { fileUrl }) // Only update fileUrl if a new file was uploaded
            }
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error('[DOCUMENT_UPDATE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: ContextProps) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        await prisma.document.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
