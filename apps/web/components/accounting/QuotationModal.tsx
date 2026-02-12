'use client';

import { useState, useMemo } from 'react';
import {
    Modal,
    Button,
    Input,
    Select,
    ListBox,
    Separator
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
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Backdrop />
            <Modal.Container>
                <Modal.Dialog className="glass border border-white/10 text-white max-w-4xl w-full">
                    <Modal.Header className="border-b border-white/5 p-6">
                        <Modal.Heading className="text-xl font-bold">สร้างใบเสนอราคาใหม่</ModalHeading>
                    </Modal.Header>
                    <Modal.Body className="py-6 px-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="เลือกลูกค้า"
                                placeholder="ค้นหาชื่อลูกค้า"
                                variant="bordered"
                                onSelectionChange={(keys) => setSelectedCustomerId(Array.from(keys)[0] as string)}
                            >
                                <Select.Trigger>
                                    <Select.Value />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {customers.map(c => (
                                            <ListBox.Item key={c.id}>{c.name}</ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Calculator size={18} className="text-cyan-400" />
                                    รายการสินค้า
                                </h3>
                                <Button size="sm" variant="flat" color="primary" onPress={addItem}>
                                    <Plus size={16} className="mr-2" />
                                    เพิ่มรายการ
                                </Button>
                            </div>

                            {/* Item List Replacement for Table */}
                            <div className="flex flex-col gap-3">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-wrap md:flex-nowrap gap-4 items-end">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">วัสดุ / ชื่อรายการ</label>
                                            <Select
                                                size="sm"
                                                placeholder="เลือกวัสดุ"
                                                variant="flat"
                                                onSelectionChange={(keys) => updateItem(item.id, 'materialId', Array.from(keys)[0])}
                                            >
                                                <Select.Trigger>
                                                    <Select.Value />
                                                </Select.Trigger>
                                                <Select.Popover>
                                                    <ListBox>
                                                        {materials.map(m => (
                                                            <ListBox.Item key={m.id}>{m.name}</ListBox.Item>
                                                        ))}
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                        </div>
                                        <div className="w-24">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">กว้าง (ม.)</label>
                                            <Input
                                                size="sm"
                                                type="number"
                                                value={String(item.width)}
                                                onValueChange={(val) => updateItem(item.id, 'width', val)}
                                                variant="flat"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">สูง (ม.)</label>
                                            <Input
                                                size="sm"
                                                type="number"
                                                value={String(item.height)}
                                                onValueChange={(val) => updateItem(item.id, 'height', val)}
                                                variant="flat"
                                            />
                                        </div>
                                        <div className="w-20">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">จำนวน</label>
                                            <Input
                                                size="sm"
                                                type="number"
                                                value={String(item.quantity)}
                                                onValueChange={(val) => updateItem(item.id, 'quantity', val)}
                                                variant="flat"
                                            />
                                        </div>
                                        <div className="flex-none text-right min-w-[100px] pb-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">รวม (฿)</label>
                                            <span className="font-bold text-cyan-400 block">{item.totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="pb-1">
                                            <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => removeItem(item.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-t border-white/5 bg-white/5 p-6 rounded-b-3xl">
                        <div className="flex-1 flex items-center justify-start text-lg font-bold">
                            <span className="text-gray-400 mr-2">ยอดรวมทั้งหมด:</span>
                            <span className="text-cyan-400">฿ {grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="flat" onPress={onClose}>ยกเลิก</Button>
                            <Button color="primary" className="bg-gradient-to-r from-cyan-500 to-blue-600 font-bold shadow-lg shadow-cyan-500/20" onPress={handleSave}>
                                บันทึกเป็นใบเสนอราคา
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal>
    );
}
    );
}
