'use server'

import { prisma, OrderStatus, OrderPriority } from '@signage-erp/database'
import { revalidatePath } from 'next/cache'

export async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: true,
                items: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })
        return { success: true, data: orders }
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return { success: false, error: 'Failed to fetch orders' }
    }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        })
        revalidatePath('/orders')
        return { success: true }
    } catch (error) {
        console.error('Failed to update order status:', error)
        return { success: false, error: 'Failed to update status' }
    }
}

export async function createOrder(data: any) {
    try {
        // Build items array
        const orderItems = data.items.map((item: any) => ({
            name: item.name,
            width: item.width,
            height: item.height,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
        }));

        // MVP: Single Tenant - Get the first organization or default
        const org = await prisma.organization.findFirst();
        if (!org) throw new Error("Organization not found. Seed data missing?");

        // MVP: Customer - Fixed for now or create on fly
        // For this phase, we'll assume a "Walk-in" customer if not provided
        let customerId = data.customerId;
        if (!customerId) {
            let walkIn = await prisma.customer.findFirst({ where: { name: 'Walk-in' } });
            if (!walkIn) {
                // Auto-create Walk-in customer if not exists
                const org = await prisma.organization.findFirst();
                if (org) {
                    walkIn = await prisma.customer.create({
                        data: {
                            name: 'Walk-in',
                            organizationId: org.id,
                            email: 'walkin@example.com', // Dummy
                            phone: '000-000-0000'
                        }
                    });
                }
            }
            customerId = walkIn?.id;
        }

        if (!customerId) throw new Error("Could not determine customer");

        const order = await prisma.order.create({
            data: {
                organizationId: org.id,
                customerId: customerId, // Fixed: customerId is required in updated schema
                status: OrderStatus.NEW,
                priority: OrderPriority.NORMAL,
                orderNumber: `JOB-${Date.now().toString().slice(-6)}`,
                totalAmount: data.totalAmount,
                vatAmount: 0, // Todo: heavy math later
                grandTotal: data.totalAmount,
                items: {
                    create: orderItems
                }
            }
        })
        revalidatePath('/orders')
        return { success: true, data: order }
    } catch (error) {
        console.error('Failed to create order:', error)
        return { success: false, error: 'Failed to create order' }
    }
}
