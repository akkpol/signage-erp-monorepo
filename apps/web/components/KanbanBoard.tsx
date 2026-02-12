'use client';

import { CSS } from '@dnd-kit/utilities';

import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { Card, Chip, Button, Avatar, Tooltip } from '@heroui/react';
import { updateOrderStatus } from '@/actions/orders';
import { OrderStatus } from '@signage-erp/types';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import {
    Clock,
    ChevronRight,
    MoreVertical,
    Package,
    User,
    AlertCircle,
    CheckCircle2,
    Layout,
    Truck,
    PenTool,
    UserCheck,
    Factory,
    FilePlus,
    Plus
} from 'lucide-react';
import { createInvoiceFromOrder } from '@/actions/accounting';
import { useRouter } from "@/navigation";

// Types
type Order = {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    customer?: { name: string; phone?: string | null };
    grandTotal: number;
    createdAt: Date;
    updatedAt: Date;
    items?: any[];
};

type Column = {
    id: OrderStatus;
    title: string;
    color: "accent" | "default" | "success" | "warning" | "danger";
    icon: React.ReactNode;
};

const COLUMNS: Column[] = [
    { id: OrderStatus.NEW, title: 'New', color: 'accent', icon: <Plus className="w-4 h-4" /> },
    { id: OrderStatus.DESIGNING, title: 'Designing', color: 'default', icon: <PenTool className="w-4 h-4" /> },
    { id: OrderStatus.PENDING_APPROVAL, title: 'Approval', color: 'warning', icon: <UserCheck className="w-4 h-4" /> },
    { id: OrderStatus.PRODUCTION, title: 'Production', color: 'warning', icon: <Factory className="w-4 h-4" /> },
    { id: OrderStatus.INSTALLATION, title: 'Installation', color: 'danger', icon: <Truck className="w-4 h-4" /> },
    { id: OrderStatus.DELIVERED, title: 'Delivered', color: 'success', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: OrderStatus.DONE, title: 'Done', color: 'success', icon: <Layout className="w-4 h-4" /> },
];

export default function KanbanBoard({ initialOrders }: { initialOrders: any[] }) {
    // Cast initialOrders to Order[] carefully as Decimals might be strings
    const [orders, setOrders] = useState<Order[]>(initialOrders.map(o => ({
        ...o,
        status: o.status as OrderStatus,
        grandTotal: Number(o.grandTotal),
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt)
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
            <div className="flex gap-4 overflow-x-auto pb-6 h-[calc(100vh-180px)] scrollbar-hide px-2">
                {COLUMNS.map(col => {
                    const columnOrders = orders.filter(o => o.status === col.id);
                    const totalValue = columnOrders.reduce((acc, curr) => acc + curr.grandTotal, 0);

                    return (
                        <div key={col.id} className="min-w-[340px] flex flex-col gap-4 rounded-3xl bg-neutral-900/40 border border-white/5 p-4 backdrop-blur-xl transition-all duration-300">
                            {/* Column Header */}
                            <div className="flex items-center justify-between px-2 py-1">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg bg-${col.color}-500/10 text-${col.color}-400 ring-1 ring-${col.color}-500/20`}>
                                        {col.icon}
                                    </div>
                                    <h3 className="font-bold text-white text-sm tracking-tight">{col.title}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-neutral-500 bg-white/5 py-0.5 px-2 rounded-full ring-1 ring-white/5">
                                        ฿{totalValue.toLocaleString()}
                                    </span>
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        className="bg-white/5 font-bold text-[10px] h-5"
                                    >
                                        {columnOrders.length}
                                    </Chip>
                                </div>
                            </div>

                            <SortableContext
                                items={columnOrders.map(o => o.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex-1 flex flex-col gap-3 min-h-[100px] overflow-y-auto pr-2 scrollbar-thin" id={col.id}>
                                    {columnOrders.map(order => (
                                        <SortableOrderCard key={order.id} order={order} />
                                    ))}
                                    {columnOrders.length === 0 && (
                                        <div className="flex-1 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-neutral-600 group hover:border-neutral-700 transition-colors">
                                            <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Plus size={18} />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Empty</span>
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </div>
                    );
                })}
            </div>

            <DragOverlay>
                {activeId ? (
                    <SortableOrderCard order={orders.find(o => o.id === activeId)!} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

function SortableOrderCard({ order, isOverlay }: { order: Order, isOverlay?: boolean }) {
    const router = useRouter();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: order.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const handleCreateInvoice = async (e: any) => {
        e.stopPropagation();
        const res = await createInvoiceFromOrder(order.id);
        if (res.success) {
            router.push(`/[locale]/accounting/invoices`);
        }
    };

    const timeAgo = formatDistanceToNow(order.createdAt, { addSuffix: true, locale: th });
    const isUrgent = (Date.now() - order.createdAt.getTime()) > (24 * 60 * 60 * 1000) && order.status !== OrderStatus.DONE;
    const itemCount = order.items?.length || 0;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none group">
            <Card className={`
                relative overflow-hidden transition-all duration-300
                ${isOverlay ? 'shadow-2xl ring-2 ring-cyan-500 cursor-grabbing bg-neutral-800 scale-105' : 'bg-neutral-800/50 hover:bg-neutral-800/80 cursor-grab border-white/5 hover:border-white/10'}
                rounded-2xl backdrop-blur-md
            `}>
                <Card.Content className="p-3">
                    {/* Urgency indicator blur */}
                    {isUrgent && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-2xl pointer-events-none" />
                    )}

                    <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md w-fit border border-cyan-400/20 uppercase">
                                {order.orderNumber}
                            </span>
                            <div className="flex items-center gap-1.5 text-neutral-400">
                                <Clock size={10} />
                                <span className="text-[9px] font-medium">{timeAgo}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-bold text-white tracking-tight">฿{order.grandTotal.toLocaleString()}</span>
                            {isUrgent && (
                                <div className="flex items-center gap-1 text-red-400 animate-pulse">
                                    <AlertCircle size={10} />
                                    <span className="text-[8px] font-black uppercase">Urgent</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                        <Avatar
                            size="sm"
                            className="w-7 h-7 text-[10px] font-bold border border-white/10 ring-1 ring-white/5"
                            variant="soft"
                        >
                            <Avatar.Fallback>
                                {(order.customer?.name || 'Walk-in').split(' ').map(n => n[0]).join('').toUpperCase()}
                            </Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-bold text-white text-xs leading-tight line-clamp-1">{order.customer?.name || 'Walk-in'}</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-neutral-500">
                                    <Package size={10} />
                                    <span className="text-[9px] font-bold">{itemCount} items</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {order.status === OrderStatus.DONE ? (
                            <Button
                                size="sm"
                                variant="primary"
                                className="w-full text-[10px] font-extrabold h-8 rounded-xl"
                                onPress={handleCreateInvoice}
                            >
                                <FilePlus size={12} className="mr-1" />
                                สร้างใบแจ้งหนี้
                            </Button>
                        ) : (
                            <div className="flex -space-x-1.5 overflow-hidden">
                                <Avatar size="sm" className="w-5 h-5 ring-1 ring-neutral-900">
                                    <Avatar.Fallback className="text-[7px]">U</Avatar.Fallback>
                                </Avatar>
                                <div className="w-5 h-5 rounded-full bg-white/5 ring-1 ring-neutral-900 flex items-center justify-center text-[7px] font-bold text-neutral-400">
                                    +
                                </div>
                            </div>
                        )}
                        <Button
                            isIconOnly
                            variant="tertiary"
                            size="sm"
                            className="w-6 h-6 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <MoreVertical size={12} className="text-neutral-500" />
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
}
