'use client';

import { useState, useMemo } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from "@heroui/react";
import { Plus, Trash2, Calculator } from "lucide-react";
import { createQuotation } from "@/actions/accounting";
import { useRouter } from "next/navigation";

export default function QuotationModal({
    isOpen,
    onClose,
    materials,
    customers
}: {
    isOpen: boolean;
    onClose: () => void;
    materials: any[];
    customers: any[];
}) {
    const router = useRouter();
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [items, setItems] = useState<any[]>([
        { id: '1', name: '', materialId: '', width: 1, height: 1, quantity: 1, unitPrice: 0, totalPrice: 0 }
    ]);

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(), name: '', materialId: '', width: 1, height: 1, quantity: 1, unitPrice: 0, totalPrice: 0 }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: string, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const newItem = { ...item, [field]: value };

                // Recalculate price if relevant fields change
                if (['materialId', 'width', 'height', 'quantity'].includes(field)) {
                    const material = materials.find(m => m.id === (field === 'materialId' ? value : item.materialId));
                    const w = field === 'width' ? Number(value) : item.width;
                    const h = field === 'height' ? Number(value) : item.height;
                    const q = field === 'quantity' ? Number(value) : item.quantity;

                    if (material) {
                        newItem.unitPrice = (w * h) * material.sellingPrice;
                        newItem.totalPrice = newItem.unitPrice * q;
                    }
                }
                return newItem;
            }
            return item;
        }));
    };

    const grandTotal = useMemo(() => items.reduce((acc, item) => acc + item.totalPrice, 0), [items]);

    const handleSave = async () => {
        const result = await createQuotation({
            customerId: selectedCustomerId,
            items: items.map(i => ({
                ...i,
                name: i.name || materials.find(m => m.id === i.materialId)?.name || 'Item'
            })),
            totalAmount: grandTotal,
            grandTotal: grandTotal,
        });

        if (result.success) {
            onClose();
            router.refresh();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" backdrop="blur" className="glass border border-white/10 text-white">
            <ModalContent>
                <ModalHeader className="border-b border-white/5">สร้างใบเสนอราคาใหม่</ModalHeader>
                <ModalBody className="py-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="เลือกลูกค้า"
                            placeholder="ค้นหาชื่อลูกค้า"
                            variant="bordered"
                            onSelectionChange={(keys) => setSelectedCustomerId(Array.from(keys)[0] as string)}
                        >
                            {customers.map(c => (
                                <SelectItem key={c.id} textValue={c.name}>{c.name}</SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <Calculator size={18} className="text-cyan-400" />
                                รายการสินค้า
                            </h3>
                            <Button size="sm" variant="flat" color="primary" startContent={<Plus size={16} />} onClick={addItem}>
                                เพิ่มรายการ
                            </Button>
                        </div>

                        <Table aria-label="Items Table" shadow="none" className="bg-transparent border border-white/5 rounded-xl">
                            <TableHeader>
                                <TableColumn className="bg-white/5">วัสดุ / ชื่อรายการ</TableColumn>
                                <TableColumn className="bg-white/5">กว้าง (ม.)</TableColumn>
                                <TableColumn className="bg-white/5">สูง (ม.)</TableColumn>
                                <TableColumn className="bg-white/5">จำนวน</TableColumn>
                                <TableColumn className="bg-white/5">รวม (฿)</TableColumn>
                                <TableColumn className="bg-white/5 text-right w-10"> </TableColumn>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Select
                                                size="sm"
                                                placeholder="เลือกวัสดุ"
                                                variant="flat"
                                                onSelectionChange={(keys) => updateItem(item.id, 'materialId', Array.from(keys)[0])}
                                            >
                                                {materials.map(m => (
                                                    <SelectItem key={m.id} textValue={m.name}>{m.name}</SelectItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                size="sm"
                                                type="number"
                                                value={String(item.width)}
                                                onChange={(e) => updateItem(item.id, 'width', e.target.value)}
                                                variant="flat"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                size="sm"
                                                type="number"
                                                value={String(item.height)}
                                                onChange={(e) => updateItem(item.id, 'height', e.target.value)}
                                                variant="flat"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                size="sm"
                                                type="number"
                                                value={String(item.quantity)}
                                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                                variant="flat"
                                            />
                                        </TableCell>
                                        <TableCell className="font-bold text-cyan-400">
                                            {item.totalPrice.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeItem(item.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </ModalBody>
                <ModalFooter className="border-t border-white/5 bg-white/5">
                    <div className="flex-1 flex items-center justify-start text-lg font-bold">
                        <span className="text-gray-400 mr-2">ยอดรวมทั้งหมด:</span>
                        <span className="text-cyan-400">฿ {grandTotal.toLocaleString()}</span>
                    </div>
                    <Button variant="flat" onClick={onClose}>ยกเลิก</Button>
                    <Button color="primary" className="bg-gradient-to-r from-cyan-500 to-blue-600 font-bold" onClick={handleSave}>
                        บันทึกเป็นใบเสนอราคา
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
