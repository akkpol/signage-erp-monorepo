'use server';

import { prisma, DocumentStatus } from '@signage-erp/database';
import { revalidatePath } from 'next/cache';

export async function getQuotations() {
    try {
        const quotations = await prisma.quotation.findMany({
            include: { customer: true },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: quotations };
    } catch (error) {
        console.error('Failed to fetch quotations:', error);
        return { success: false, error: 'Failed to fetch quotations' };
    }
}

export async function createQuotation(data: any) {
    try {
        const org = await prisma.organization.findFirst();
        if (!org) throw new Error('Organization not found');

        const quotation = await prisma.quotation.create({
            data: {
                organizationId: org.id,
                quotationNumber: `QT-${Date.now().toString().slice(-6)}`,
                status: DocumentStatus.DRAFT,
                customerId: data.customerId,
                totalAmount: data.totalAmount,
                vatAmount: data.vatAmount || 0,
                grandTotal: data.grandTotal,
                items: {
                    create: data.items.map((item: any) => ({
                        name: item.name,
                        width: item.width,
                        height: item.height,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        details: item.details,
                    })),
                },
            },
        });

        revalidatePath('/accounting/quotations');
        return { success: true, data: quotation };
    } catch (error) {
        console.error('Failed to create quotation:', error);
        return { success: false, error: 'Failed to create quotation' };
    }
}

export async function getInvoices() {
    try {
        const invoices = await prisma.invoice.findMany({
            include: { customer: true, order: true },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: invoices };
    } catch (error) {
        console.error('Failed to fetch invoices:', error);
        return { success: false, error: 'Failed to fetch invoices' };
    }
}

export async function createInvoiceFromOrder(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) throw new Error('Order not found');

        const invoice = await prisma.invoice.create({
            data: {
                organizationId: order.organizationId,
                invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
                status: DocumentStatus.DRAFT,
                orderId: order.id,
                customerId: order.customerId,
                totalAmount: order.totalAmount,
                vatAmount: order.vatAmount,
                grandTotal: order.grandTotal,
            },
        });

        revalidatePath('/accounting/invoices');
        return { success: true, data: invoice };
    } catch (error) {
        console.error('Failed to create invoice:', error);
        return { success: false, error: 'Failed to create invoice' };
    }
}
