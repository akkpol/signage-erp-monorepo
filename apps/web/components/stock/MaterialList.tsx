'use client';

import { useState } from 'react';
import {
    Button,
    Modal,
    Input,
    InputGroup,
    TextField,
    Label,
    Select,
    ListBox,
    Chip,
    Tooltip
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { createStockTransaction, createMaterial } from '@/actions/stock';
import { useRouter } from 'next/navigation';

type Material = {
    id: string;
    name: string;
    type: string;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    inStock: number;
    wasteFactor: number;
};

export default function MaterialList({ initialMaterials }: { initialMaterials: Material[] }) {
    const t = useTranslations('Stock');
    const router = useRouter();

    // Transaction Modal State
    const [isTransactionOpen, setIsTransactionOpen] = useState(false);

    // Add Material Modal State
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [materials, setMaterials] = useState<Material[]>(initialMaterials);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    // Transaction State
    const [transactionType, setTransactionType] = useState<'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT'>('STOCK_IN');
    const [quantity, setQuantity] = useState('');
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Add Material State
    const [newMaterial, setNewMaterial] = useState({
        name: '',
        type: 'VINYL',
        unit: 'sqm',
        costPrice: '',
        sellingPrice: ''
    });

    const handleAction = (material: Material, type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT') => {
        setSelectedMaterial(material);
        setTransactionType(type);
        setQuantity('');
        setReference('');
        setNotes('');
        setIsTransactionOpen(true);
    };

    const handleSubmitTransaction = async () => {
        if (!selectedMaterial || !quantity) return;

        setIsLoading(true);
        try {
            const result = await createStockTransaction({
                materialId: selectedMaterial.id,
                type: transactionType,
                quantity: parseFloat(quantity),
                reference,
                notes
            });

            if (result.success) {
                setIsTransactionOpen(false);
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert('Transaction failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMaterial = async () => {
        if (!newMaterial.name || !newMaterial.costPrice || !newMaterial.sellingPrice) return;

        setIsLoading(true);
        try {
            const result = await createMaterial({
                name: newMaterial.name,
                type: newMaterial.type,
                unit: newMaterial.unit,
                costPrice: parseFloat(newMaterial.costPrice),
                sellingPrice: parseFloat(newMaterial.sellingPrice)
            });

            if (result.success) {
                setIsAddOpen(false);
                setNewMaterial({ name: '', type: 'VINYL', unit: 'sqm', costPrice: '', sellingPrice: '' });
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to create material');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('title')}</h2>
                <Button variant="primary" onPress={() => setIsAddOpen(true)}>
                    {t('addMaterial')}
                </Button>
            </div>

            <div className="glass-card overflow-hidden">
                {/* Header Grid */}
                <div className="grid grid-cols-7 gap-4 p-4 bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                    <div className="col-span-2">{t('name')}</div>
                    <div>{t('type')}</div>
                    <div>{t('cost')}</div>
                    <div>{t('selling')}</div>
                    <div>{t('balance')}</div>
                    <div>{t('unit')}</div>
                    <div className="text-right">{t('actions')}</div>
                </div>

                {/* Body Grid */}
                <div className="flex flex-col">
                    {materials.map((item) => (
                        <div key={item.id} className="grid grid-cols-7 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                            <div className="col-span-2 font-medium text-white">{item.name}</div>
                            <div className="text-sm text-gray-400">{item.type}</div>
                            <div className="text-sm">฿{Number(item.costPrice).toLocaleString()}</div>
                            <div className="text-sm">฿{Number(item.sellingPrice).toLocaleString()}</div>
                            <div>
                                <Chip
                                    color={Number(item.inStock) <= 10 ? 'danger' : Number(item.inStock) <= 50 ? 'warning' : 'success'}
                                    variant="soft"
                                    size="sm"
                                >
                                    {Number(item.inStock).toLocaleString()}
                                </Chip>
                            </div>
                            <div className="text-sm text-gray-400">{item.unit}</div>
                            <div className="flex gap-2 justify-end">
                                <Tooltip>
                                    <Tooltip.Trigger>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="tertiary"
                                            onPress={() => handleAction(item, 'STOCK_IN')}
                                        >
                                            📥
                                        </Button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>{t('stockIn')}</Tooltip.Content>
                                </Tooltip>
                                <Tooltip>
                                    <Tooltip.Trigger>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="tertiary"
                                            onPress={() => handleAction(item, 'STOCK_OUT')}
                                        >
                                            📤
                                        </Button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>{t('stockOut')}</Tooltip.Content>
                                </Tooltip>
                                <Tooltip>
                                    <Tooltip.Trigger>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="tertiary"
                                            onPress={() => handleAction(item, 'ADJUSTMENT')}
                                        >
                                            🔧
                                        </Button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>{t('adjust')}</Tooltip.Content>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction Modal */}
            <Modal>
                <Modal.Backdrop isOpen={isTransactionOpen} onOpenChange={(open) => !open && setIsTransactionOpen(false)} />
                <Modal.Container>
                    <Modal.Dialog className="glass border border-white/10 text-white max-w-md w-full">
                        <Modal.Header className="border-b border-white/5 p-6">
                            <h3 className="text-lg font-bold">
                                {selectedMaterial?.name} - {t(transactionType === 'STOCK_IN' ? 'stockIn' : transactionType === 'STOCK_OUT' ? 'stockOut' : 'adjust')}
                            </h3>
                        </Modal.Header>
                        <Modal.Body className="space-y-4 py-4 text-left">
                            <TextField type="number" value={quantity} onChange={setQuantity}>
                                <Label>{t('quantity')}</Label>
                                <InputGroup variant="secondary">
                                    <InputGroup.Input placeholder="0.00" />
                                    <InputGroup.Suffix>
                                        <span className="text-default-400 text-small">{selectedMaterial?.unit}</span>
                                    </InputGroup.Suffix>
                                </InputGroup>
                            </TextField>

                            <TextField value={reference} onChange={setReference}>
                                <Label>{t('reference')}</Label>
                                <Input placeholder="PO-123, JOB-456" variant="secondary" />
                            </TextField>

                            <TextField value={notes} onChange={setNotes}>
                                <Label>{t('notes')}</Label>
                                <Input placeholder="..." variant="secondary" />
                            </TextField>
                        </Modal.Body>
                        <Modal.Footer className="flex gap-2 justify-end">
                            <Button variant="danger" onPress={() => setIsTransactionOpen(false)}>
                                {t('cancel')}
                            </Button>
                            <Button variant="primary" onPress={handleSubmitTransaction} isPending={isLoading}>
                                {t('confirm')}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal>

            {/* Add Material Modal */}
            <Modal>
                <Modal.Backdrop isOpen={isAddOpen} onOpenChange={(open) => !open && setIsAddOpen(false)} />
                <Modal.Container>
                    <Modal.Dialog className="glass border border-white/10 text-white max-w-md w-full">
                        <Modal.Header className="border-b border-white/5 p-6">
                            <h3 className="text-lg font-bold">{t('addMaterial')}</h3>
                        </Modal.Header>
                        <Modal.Body className="space-y-4 py-4 text-left">
                            <TextField value={newMaterial.name} onChange={(v) => setNewMaterial({ ...newMaterial, name: v })}>
                                <Label>{t('name')}</Label>
                                <Input placeholder="e.g. Vinyl Glossy 3M" variant="secondary" />
                            </TextField>

                            <div className="flex flex-col gap-1.5">
                                <Select
                                    placeholder="Select Type"
                                    selectedKey={newMaterial.type}
                                    onSelectionChange={(key) => setNewMaterial({ ...newMaterial, type: key as string })}
                                    variant="secondary"
                                >
                                    <Label>{t('type')}</Label>
                                    <Select.Trigger>
                                        <Select.Value />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>
                                            <ListBox.Item id="VINYL" key="VINYL">Vinyl</ListBox.Item>
                                            <ListBox.Item id="SUBSTRATE" key="SUBSTRATE">Substrate</ListBox.Item>
                                            <ListBox.Item id="INK" key="INK">Ink</ListBox.Item>
                                            <ListBox.Item id="OTHER" key="OTHER">Other</ListBox.Item>
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            <div className="flex gap-4">
                                <TextField className="flex-1" type="number" value={newMaterial.costPrice} onChange={(v) => setNewMaterial({ ...newMaterial, costPrice: v })}>
                                    <Label>{t('cost')}</Label>
                                    <Input variant="secondary" placeholder="0.00" />
                                </TextField>

                                <TextField className="flex-1" type="number" value={newMaterial.sellingPrice} onChange={(v) => setNewMaterial({ ...newMaterial, sellingPrice: v })}>
                                    <Label>{t('selling')}</Label>
                                    <Input variant="secondary" placeholder="0.00" />
                                </TextField>
                            </div>

                            <TextField value={newMaterial.unit} onChange={(v) => setNewMaterial({ ...newMaterial, unit: v })}>
                                <Label>{t('unit')}</Label>
                                <Input variant="secondary" placeholder="sqm" />
                            </TextField>
                        </Modal.Body>
                        <Modal.Footer className="flex gap-2 justify-end">
                            <Button variant="danger" onPress={() => setIsAddOpen(false)}>{t('cancel')}</Button>
                            <Button variant="primary" onPress={handleAddMaterial} isPending={isLoading}>{t('confirm')}</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal>
        </>
    );
}

