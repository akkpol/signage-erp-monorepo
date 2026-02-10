import { getOrders, createOrder } from '@/actions/orders';
import KanbanBoard from '@/components/KanbanBoard';
import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function OrdersPage() {
    const { data: orders } = await getOrders();

    async function addTestOrder() {
        'use server'
        await createOrder({
            totalAmount: Math.floor(Math.random() * 5000) + 500,
            items: [
                { name: "Vinyl Sticker", width: 1, height: 1, quantity: 1, unitPrice: 500, totalPrice: 500 }
            ]
        })
        revalidatePath('/orders')
    }

    return (
        <div className="h-[calc(100vh-80px)] p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Order Management</h1>
                    <p className="text-gray-400 text-sm">Drag and drop to update status</p>
                </div>
                <form action={addTestOrder}>
                    <Button
                        type="submit"
                        color="primary"
                        startContent={<Plus size={20} />}
                    >
                        New Order (Test)
                    </Button>
                </form>
            </div>

            <KanbanBoard initialOrders={orders || []} />
        </div>
    );
}
