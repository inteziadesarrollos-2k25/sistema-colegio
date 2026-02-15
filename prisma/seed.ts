import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const hashedA1 = await bcrypt.hash('firulais', 10);
    const hashedA2 = await bcrypt.hash('caracas', 10);
    const hashedA3 = await bcrypt.hash('maria', 10);

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            securityA1: hashedA1,
            securityA2: hashedA2,
            securityA3: hashedA3
        },
        create: {
            username: 'admin',
            password: hashedPassword,
            name: 'Administrador Principal',
            role: 'ADMIN',
            securityA1: hashedA1,
            securityA2: hashedA2,
            securityA3: hashedA3
        },
    })

    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
