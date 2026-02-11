'use server'

import { prisma, TransactionType } from '@signage-erp/database'
import { revalidatePath } from 'next/cache'

export type StockTransactionData = {
    materialId: string
    type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT'
    quantity: number
    reference?: string
    notes?: string
}

export async function getMaterials() {
    try {
        const materials = await prisma.material.findMany({
            orderBy: { name: 'asc' },
            include: {
                pricingTiers: true,
                // Optional: include recent transactions
                transactions: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                }
            }
        })
        return { success: true, data: materials }
    } catch (error) {
        console.error('Failed to fetch materials:', error)
        return { success: false, error: 'Failed to fetch materials' }
    }
}

export async function createMaterial(data: {
    name: string
    type: any // MaterialType enum
    unit: string
    costPrice: number
    sellingPrice: number
    wasteFactor?: number
}) {
    try {
        const org = await prisma.organization.findFirst()
        if (!org) throw new Error('Organization not found')

        const material = await prisma.material.create({
            data: {
                organizationId: org.id,
                name: data.name,
                type: data.type,
                unit: data.unit,
                costPrice: data.costPrice,
                sellingPrice: data.sellingPrice,
                wasteFactor: data.wasteFactor ?? 1.15,
                inStock: 0
            }
        })

        revalidatePath('/stock')
        return { success: true, data: material }
    } catch (error) {
        console.error('Failed to create material:', error)
        return { success: false, error: 'Failed to create material' }
    }
}

export async function createStockTransaction(data: StockTransactionData) {
    try {
        const { materialId, type, quantity, reference, notes } = data

        // Validate quantity
        if (quantity <= 0) {
            return { success: false, error: 'Quantity must be positive' }
        }

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get current material to check stock (for OUT)
            const material = await tx.material.findUnique({
                where: { id: materialId }
            })

            if (!material) throw new Error('Material not found')

            let newStock = material.inStock

            // 2. Calculate new stock
            if (type === 'STOCK_IN') {
                newStock += quantity
            } else if (type === 'STOCK_OUT') {
                if (material.inStock < quantity) {
                    throw new Error(`Insufficient stock. Current: ${material.inStock}, Required: ${quantity}`)
                }
                newStock -= quantity
            } else if (type === 'ADJUSTMENT') {
                newStock = quantity
            }

            // 3. Update material stock
            await tx.material.update({
                where: { id: materialId },
                data: { inStock: newStock }
            })

            // 4. Create transaction record
            const transaction = await tx.stockTransaction.create({
                data: {
                    materialId,
                    type: type as TransactionType,
                    quantity,
                    reference,
                    notes
                }
            })

            return transaction
        })

        revalidatePath('/stock')
        return { success: true, data: result }

    } catch (error: any) {
        console.error('Failed to create stock transaction:', error)
        return { success: false, error: error.message || 'Failed to process transaction' }
    }
}

export async function getStockHistory(materialId: string) {
    try {
        const history = await prisma.stockTransaction.findMany({
            where: { materialId },
            orderBy: { createdAt: 'desc' },
            take: 50
        })
        return { success: true, data: history }
    } catch (error) {
        console.error('Failed to fetch stock history:', error)
        return { success: false, error: 'Failed to fetch history' }
    }
}
