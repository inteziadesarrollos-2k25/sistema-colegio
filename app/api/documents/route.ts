import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const type = formData.get('type') as string;
        const content = formData.get('content') as string;
        const studentId = formData.get('studentId') as string | null;
        const staffId = formData.get('staffId') as string | null;
        const file = formData.get('file') as File | null;

        let fileUrl = null;

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure uploads directory exists
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true });

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            fileUrl = `/uploads/${filename}`;
        }

        const document = await prisma.document.create({
            data: {
                title,
                type,
                content,
                studentId: studentId || undefined,
                staffId: staffId || undefined,
                fileUrl
            }
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error('[DOCUMENTS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
