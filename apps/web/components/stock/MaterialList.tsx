'use client';

import { useState } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Select,
    SelectItem,
    useDisclosure,
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
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    // Add Material Modal State
    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onOpenChange: onAddOpenChange,
        onClose: onAddClose
    } = useDisclosure();

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

    const columns = [
        { name: t('name'), uid: 'name' },
        { name: t('type'), uid: 'type' },
        { name: t('cost'), uid: 'costPrice' },
        { name: t('selling'), uid: 'sellingPrice' },
        { name: t('balance'), uid: 'inStock' },
        { name: t('unit'), uid: 'unit' },
        { name: t('actions'), uid: 'actions' },
    ];

    const handleAction = (material: Material, type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT') => {
        setSelectedMaterial(material);
        setTransactionType(type);
        setQuantity('');
        setReference('');
        setNotes('');
        onOpen();
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
                onClose();
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
                type: newMaterial.type, // Explicitly cast if needed, but string works with API
                unit: newMaterial.unit,
                costPrice: parseFloat(newMaterial.costPrice),
                sellingPrice: parseFloat(newMaterial.sellingPrice)
            });

            if (result.success) {
                onAddClose();
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

    const renderCell = (material: Material, columnKey: React.Key) => {
        const cellValue = material[columnKey as keyof Material];

        switch (columnKey) {
            case 'costPrice':
            case 'sellingPrice':
                return `฿${Number(cellValue).toLocaleString()}`;
            case 'inStock':
                return (
                    <Chip
                        color={Number(cellValue) <= 10 ? 'danger' : Number(cellValue) <= 50 ? 'warning' : 'success'}
                        variant="flat"
                        size="sm"
                    >
                        {Number(cellValue).toLocaleString()}
                    </Chip>
                );
            case 'actions':
                return (
                    <div className="flex gap-2">
                        <Tooltip content={t('stockIn')}>
                            <Button
                                isIconOnly
                                size="sm"
                                color="success"
                                variant="light"
                                onPress={() => handleAction(material, 'STOCK_IN')}
                            >
                                📥
                            </Button>
                        </Tooltip>
                        <Tooltip content={t('stockOut')}>
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => handleAction(material, 'STOCK_OUT')}
                            >
                                📤
                            </Button>
                        </Tooltip>
                        <Tooltip content={t('adjust')}>
                            <Button
                                isIconOnly
                                size="sm"
                                color="default"
                                variant="light"
                                onPress={() => handleAction(material, 'ADJUSTMENT')}
                            >
                                🔧
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('title')}</h2>
                <Button color="primary" onPress={onAddOpen}>
                    {t('addMaterial')}
                </Button>
            </div>

            <Table aria-label="Materials table">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === 'actions' ? 'end' : 'start'}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={materials}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Transaction Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {selectedMaterial?.name} - {t(transactionType === 'STOCK_IN' ? 'stockIn' : transactionType === 'STOCK_OUT' ? 'stockOut' : 'adjust')}
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label={t('quantity')}
                                    placeholder="0.00"
                                    type="number"
                                    variant="bordered"
                                    value={quantity}
                                    onValueChange={setQuantity}
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">{selectedMaterial?.unit}</span>
                                        </div>
                                    }
                                />
                                <Input
                                    label={t('reference')}
                                    placeholder="PO-123, JOB-456"
                                    variant="bordered"
                                    value={reference}
                                    onValueChange={setReference}
                                />
                                <Input
                                    label={t('notes')}
                                    placeholder="..."
                                    variant="bordered"
                                    value={notes}
                                    onValueChange={setNotes}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    {t('cancel')}
                                </Button>
                                <Button color="primary" onPress={handleSubmitTransaction} isLoading={isLoading}>
                                    {t('confirm')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Add Material Modal */}
            <Modal isOpen={isAddOpen} onOpenChange={onAddOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{t('addMaterial')}</ModalHeader>
                            <ModalBody>
                                <Input
                                    label={t('name')}
                                    value={newMaterial.name}
                                    onValueChange={(v) => setNewMaterial({ ...newMaterial, name: v })}
                                    placeholder="e.g. Vinyl Glossy 3M"
                                    variant="bordered"
                                />
                                <Select
                                    label={t('type')}
                                    defaultSelectedKeys={['VINYL']}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                                    variant="bordered"
                                >
                                    <SelectItem key="VINYL">Vinyl</SelectItem>
                                    <SelectItem key="SUBSTRATE">Substrate</SelectItem>
                                    <SelectItem key="INK">Ink</SelectItem>
                                    <SelectItem key="OTHER">Other</SelectItem>
                                </Select>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        label={t('cost')}
                                        value={newMaterial.costPrice}
                                        onValueChange={(v) => setNewMaterial({ ...newMaterial, costPrice: v })}
                                        variant="bordered"
                                    />
                                    <Input
                                        type="number"
                                        label={t('selling')}
                                        value={newMaterial.sellingPrice}
                                        onValueChange={(v) => setNewMaterial({ ...newMaterial, sellingPrice: v })}
                                        variant="bordered"
                                    />
                                </div>
                                <Input
                                    label={t('unit')}
                                    value={newMaterial.unit}
                                    onValueChange={(v) => setNewMaterial({ ...newMaterial, unit: v })}
                                    variant="bordered"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>{t('cancel')}</Button>
                                <Button color="primary" onPress={handleAddMaterial} isLoading={isLoading}>{t('confirm')}</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
