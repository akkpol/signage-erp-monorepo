'use client';

import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardBody, Chip } from '@heroui/react';
import { updateOrderStatus } from '@/actions/orders';
import { OrderStatus } from '@prisma/client';

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
            <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
                {COLUMNS.map(col => (
                    <div key={col.id} className="min-w-[280px] bg-gray-900/50 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-300">{col.title}</h3>
                            <Chip size="sm" color={col.color as any} variant="flat">
                                {orders.filter(o => o.status === col.id).length}
                            </Chip>
                        </div>

                        <SortableContext
                            items={orders.filter(o => o.status === col.id).map(o => o.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex-1 flex flex-col gap-3 min-h-[100px]" id={col.id}>
                                {orders.filter(o => o.status === col.id).map(order => (
                                    <SortableOrderCard key={order.id} order={order} />
                                ))}
                                {orders.filter(o => o.status === col.id).length === 0 && (
                                    <div className="h-full border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                                        Drop here
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

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableOrderCard({ order, isOverlay }: { order: Order, isOverlay?: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: order.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isOverlay ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Card className={`bg-gray-800 border-gray-700 ${isOverlay ? 'shadow-2xl ring-2 ring-blue-500 cursor-grabbing' : 'hover:bg-gray-750 cursor-grab'}`}>
                <CardBody className="p-3">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-gray-400">{order.orderNumber}</span>
                        <span className="text-xs font-bold text-green-400">฿{order.grandTotal.toLocaleString()}</span>
                    </div>
                    <p className="font-semibold text-white text-sm mb-1">{order.customer?.name || 'Walk-in'}</p>
                </CardBody>
            </Card>
        </div>
    );
}
