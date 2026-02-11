'use client';

import { useState } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    useDisclosure
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
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t('quotations')}</h1>
                    <p className="text-gray-400 text-sm">ดูแลและจัดการใบเสนอราคาของคุณ</p>
                </div>
                <Button
                    color="primary"
                    startContent={<Plus size={20} />}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20"
                    onClick={onOpen}
                >
                    {t('newQuotation')}
                </Button>
            </div>

            <div className="glass-card overflow-hidden">
                <Table aria-label="Quotations Table" shadow="none" className="bg-transparent">
                    <TableHeader>
                        <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('number')}</TableColumn>
                        <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('customer')}</TableColumn>
                        <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('total')}</TableColumn>
                        <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('status')}</TableColumn>
                        <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('date')}</TableColumn>
                        <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider text-right">{t('actions')}</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={t('noQuotations')}>
                        {initialQuotations.map((qt) => (
                            <TableRow key={qt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell className="font-mono text-cyan-400 font-bold">{qt.quotationNumber}</TableCell>
                                <TableCell className="text-white font-medium">{qt.customer?.name || '-'}</TableCell>
                                <TableCell className="text-white flex flex-col">
                                    <span className="text-xs text-gray-400">฿</span>
                                    <span className="font-bold">{qt.grandTotal.toLocaleString()}</span>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={qt.status} />
                                </TableCell>
                                <TableCell className="text-gray-400 text-sm">
                                    {format(new Date(qt.createdAt), 'dd MMM yyyy')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Dropdown backdrop="blur" className="glass border border-white/10">
                                        <DropdownTrigger>
                                            <Button isIconOnly variant="light" size="sm" className="text-gray-400 hover:text-white">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Quotation Actions">
                                            <DropdownItem key="view" startContent={<FileText size={16} />}>View Details</DropdownItem>
                                            <DropdownItem key="send" startContent={<Send size={16} />}>Email to Customer</DropdownItem>
                                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={16} />}>
                                                Delete
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <QuotationModal
                isOpen={isOpen}
                onClose={onClose}
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
