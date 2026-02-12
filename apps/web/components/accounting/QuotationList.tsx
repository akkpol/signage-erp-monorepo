'use client';

import { useState } from 'react';
import {
    Button,
    Chip,
    Dropdown
} from "@heroui/react";
import { Plus, MoreVertical, FileText, Send, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import QuotationModal from "./QuotationModal";

export default function QuotationList({
    initialQuotations,
    materials,
    customers
}: {
    initialQuotations: any[];
    materials: any[];
    customers: any[];
}) {
    const t = useTranslations('Accounting');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t('quotations')}</h1>
                    <p className="text-gray-400 text-sm">ดูแลและจัดการใบเสนอราคาของคุณ</p>
                </div>
                <Button
                    color="primary"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 font-bold"
                    onPress={() => setIsModalOpen(true)}
                >
                    <Plus size={20} className="mr-2" />
                    {t('newQuotation')}
                </Button>
            </div>

            <div className="glass-card overflow-hidden">
                {/* Custom Header Grid */}
                <div className="grid grid-cols-6 gap-4 p-4 bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                    <div>{t('number')}</div>
                    <div>{t('customer')}</div>
                    <div>{t('total')}</div>
                    <div>{t('status')}</div>
                    <div>{t('date')}</div>
                    <div className="text-right">{t('actions')}</div>
                </div>

                {/* Body Grid */}
                <div className="flex flex-col">
                    {initialQuotations.length === 0 && (
                        <div className="p-8 text-center text-gray-500">ไม่พบข้อมูลใบเสนอราคา</div>
                    )}
                    {initialQuotations.map((qt) => (
                        <div key={qt.id} className="grid grid-cols-6 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                            <div className="font-mono text-cyan-400 font-bold">{qt.quotationNumber}</div>
                            <div className="text-white font-medium truncate">{qt.customer?.name || '-'}</div>
                            <div className="text-white flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Budget</span>
                                <span className="font-bold">฿{qt.grandTotal.toLocaleString()}</span>
                            </div>
                            <div>
                                <StatusChip status={qt.status} />
                            </div>
                            <div className="text-gray-400 text-sm font-mono">
                                {format(new Date(qt.createdAt), 'dd/MM/yy')}
                            </div>
                            <div className="text-right">
                                <Dropdown className="glass border border-white/10">
                                    <Dropdown.Trigger>
                                        <Button isIconOnly variant="flat" size="sm" className="text-gray-400 hover:text-white">
                                            <MoreVertical size={18} />
                                        </Button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Menu aria-label="Quotation Actions">
                                        <Dropdown.Item key="view">
                                            <div className="flex items-center gap-2"><FileText size={16} /> View Details</div>
                                        </Dropdown.Item>
                                        <Dropdown.Item key="send">
                                            <div className="flex items-center gap-2"><Send size={16} /> Email to Customer</div>
                                        </Dropdown.Item>
                                        <Dropdown.Item key="delete" className="text-danger">
                                            <div className="flex items-center gap-2 font-bold"><Trash2 size={16} /> Delete</div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <QuotationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                materials={materials}
                customers={customers}
            />
        </div>
    );
}

function StatusChip({ status }: { status: string }) {
    const colors: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined> = {
        DRAFT: "default",
        SENT: "primary",
        PAID: "success",
        VOID: "danger"
    };

    return (
        <Chip
            size="sm"
            variant="flat"
            color={colors[status] || "default"}
            className="bg-opacity-10 border border-current font-bold"
        >
            {status}
        </Chip>
    );
}
