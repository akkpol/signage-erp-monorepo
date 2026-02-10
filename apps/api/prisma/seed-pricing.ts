import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const organizationId = "demo-org-123" // Use a consistent ID for demo

    // Ensure Organization exists
    const org = await prisma.organization.upsert({
        where: { id: organizationId },
        update: {},
        create: {
            id: organizationId,
            name: "PrintFlow Demo Shop",
            code: "DEMO",
        },
    })

    // 1. Vinyl Glossy
    const vinyl = await prisma.material.create({
        data: {
            organizationId: org.id,
            name: "Vinyl Glossy",
            type: "VINYL",
            unit: "sqm",
            costPrice: 150,
            sellingPrice: 350,
            wasteFactor: 1.15,
            inStock: 100,
            pricingTiers: {
                create: [
                    { minQuantity: 10, discountPercent: 10 },
                    { minQuantity: 50, discountPercent: 20 },
                ]
            }
        }
    })

    // 2. Acrylic 3mm
    const acrylic = await prisma.material.create({
        data: {
            organizationId: org.id,
            name: "Acrylic 3mm White",
            type: "SUBSTRATE",
            unit: "sqm",
            costPrice: 450,
            sellingPrice: 950,
            wasteFactor: 1.10,
            inStock: 50,
        }
    })

    console.log({ vinyl, acrylic })
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
