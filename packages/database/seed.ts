import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
    console.log('🌱 Seeding database...')

    // Check if organization exists
    const existingOrg = await prisma.organization.findFirst()

    if (!existingOrg) {
        const org = await prisma.organization.create({
            data: {
                name: 'Akkpol Signage',
                code: 'AKKPOL'
            }
        })
        console.log(`✅ Created organization: ${org.name} (${org.id})`)
    } else {
        console.log(`✅ Organization already exists: ${existingOrg.name}`)
    }

    await prisma.$disconnect()
    console.log('🎉 Seeding complete!')
}

seed()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
