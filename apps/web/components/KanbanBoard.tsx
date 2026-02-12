'use client';

import { CSS } from '@dnd-kit/utilities';

import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { Card, CardBody, Chip, Button } from '@heroui/react';
import { updateOrderStatus } from '@/actions/orders';
import { OrderStatus } from '@signage-erp/types';

// Types
type Order = {
    id: string;
    orderNumber: string;
    status: OrderStatus; // Use strict Enum type
    customer?: { name: string };
    grandTotal: number; // Decimal in DB, but number in JS usually if serialized. Need to be careful.
};

type Column = {
    id: OrderStatus;
    title: string;
    color: string;
};

const COLUMNS: Column[] = [
    { id: OrderStatus.NEW, title: 'New', color: 'primary' },
    { id: OrderStatus.DESIGNING, title: 'Designing', color: 'secondary' },
    { id: OrderStatus.PENDING_APPROVAL, title: 'Approval', color: 'warning' },
    { id: OrderStatus.PRODUCTION, title: 'Production', color: 'warning' },
    { id: OrderStatus.INSTALLATION, title: 'Installation', color: 'danger' },
    { id: OrderStatus.DELIVERED, title: 'Delivered', color: 'success' },
    { id: OrderStatus.DONE, title: 'Done', color: 'success' },
];

export default function KanbanBoard({ initialOrders }: { initialOrders: any[] }) {
    // Cast initialOrders to Order[] carefully as Decimals might be strings
    const [orders, setOrders] = useState<Order[]>(initialOrders.map(o => ({
        ...o,
        status: o.status as OrderStatus,
        grandTotal: Number(o.grandTotal)
    })));
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find the containers
        const activeOrder = orders.find(o => o.id === activeId);
        if (!activeOrder) return;

        // If over a column (empty state)
        // Check if overId is a valid Column ID
        const overColumn = COLUMNS.find(c => c.id === overId);

        if (overColumn && activeOrder.status !== overColumn.id) {
            setOrders(prev => prev.map(o =>
                o.id === activeId ? { ...o, status: overColumn.id } : o
            ));
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeOrder = orders.find(o => o.id === active.id);
        const overColumn = COLUMNS.find(c => c.id === over.id);
        // Or dropping on another order?
        const overOrder = orders.find(o => o.id === over.id);

        let newStatus = activeOrder?.status;

        if (overColumn) {
            newStatus = overColumn.id;
        } else if (overOrder) {
            newStatus = overOrder.status;
        }

        if (activeOrder && newStatus && activeOrder.status !== newStatus) {
            // Optimistic update
            setOrders(prev => prev.map(o =>
                o.id === active.id ? { ...o, status: newStatus! } : o
            ));

            // Server update
            await updateOrderStatus(active.id as string, newStatus);
        }

        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-180px)] scrollbar-hide">
                {COLUMNS.map(col => (
                    <div key={col.id} className="min-w-[320px] glass-card p-5 flex flex-col gap-4 border-white/5 bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-extrabold text-white text-sm uppercase tracking-widest">{col.title}</h3>
                            <Chip
                                size="sm"
                                variant="flat"
                                color={col.color as "primary" | "secondary" | "success" | "warning" | "danger"}
                                className="bg-opacity-20 font-bold border border-current"
                            >
                                {orders.filter(o => o.status === col.id).length}
                            </Chip>
                        </div>

                        <SortableContext
                            items={orders.filter(o => o.status === col.id).map(o => o.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex-1 flex flex-col gap-4 min-h-[100px]" id={col.id}>
                                {orders.filter(o => o.status === col.id).map(order => (
                                    <SortableOrderCard key={order.id} order={order} />
                                ))}
                                {orders.filter(o => o.status === col.id).length === 0 && (
                                    <div className="flex-1 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600 text-[10px] uppercase font-bold tracking-tighter opacity-50">
                                        <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center mb-2">
                                            +
                                        </div>
                                        Drag Job Here
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <SortableOrderCard order={orders.find(o => o.id === activeId)!} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

import { createInvoiceFromOrder } from '@/actions/accounting';
import { FilePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

function SortableOrderCard({ order, isOverlay }: { order: Order, isOverlay?: boolean }) {
    const router = useRouter();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: order.id });



    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isOverlay ? 0.8 : 1,
    };

    const handleCreateInvoice = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const res = await createInvoiceFromOrder(order.id);
        if (res.success) {
            router.push(`/[locale]/accounting/invoices`);
        }
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Card className={`bg-gray-800/80 backdrop-blur-md border-white/5 ${isOverlay ? 'shadow-2xl ring-2 ring-cyan-500 cursor-grabbing' : 'hover:bg-gray-800 cursor-grab'} transition-all`}>
                <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full">{order.orderNumber}</span>
                        <span className="text-sm font-extrabold text-white">฿{order.grandTotal.toLocaleString()}</span>
                    </div>
                    <p className="font-bold text-white text-base mb-4">{order.customer?.name || 'Walk-in'}</p>

                    {order.status === OrderStatus.DONE && (
                        <Button
                            size="sm"
                            color="secondary"
                            variant="flat"
                            className="w-full bg-magenta-500/10 text-magenta-400 font-bold border border-magenta-500/20"
                            startContent={<FilePlus size={16} />}
                            onClick={handleCreateInvoice}
                        >
                            Generate Invoice
                        </Button>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
