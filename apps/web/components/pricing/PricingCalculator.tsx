'use client';

import { useState, useMemo } from 'react';
import {
    TextField,
    Label,
    Input,
    Select,
    ListBox,
    Button,
    Card,
    Separator,
    Chip
} from '@heroui/react';
import { useTranslations } from 'next-intl';

type PricingTier = {
    id: string;
    minQuantity: number;
    discountPercent: number;
};

type Material = {
    id: string;
    name: string;
    sellingPrice: number;
    unit: string;
    pricingTiers: PricingTier[];
};

export default function PricingCalculator({ materials }: { materials: Material[] }) {
    const t = useTranslations('Pricing');

    const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
    const [width, setWidth] = useState<string>(''); // in cm
    const [height, setHeight] = useState<string>(''); // in cm
    const [quantity, setQuantity] = useState<string>('1');

    const selectedMaterial = useMemo(() =>
        materials.find(m => m.id === selectedMaterialId),
        [materials, selectedMaterialId]);

    const calculation = useMemo(() => {
        if (!selectedMaterial || !width || !height || !quantity) return null;

        const w = parseFloat(width);
        const h = parseFloat(height);
        const qty = parseFloat(quantity);

        if (isNaN(w) || isNaN(h) || isNaN(qty)) return null;

        // Convert cm to meters for area calculation (assuming price is per sqm)
        const areaPerItem = (w / 100) * (h / 100);
        const totalArea = areaPerItem * qty;

        // Base Price
        const basePrice = totalArea * selectedMaterial.sellingPrice;

        // Sort tiers by minQuantity desc to find best match
        const tiers = [...(selectedMaterial.pricingTiers || [])].sort((a, b) => b.minQuantity - a.minQuantity);
        const applicableTier = tiers.find(tier => qty >= tier.minQuantity);

        const discountPercent = applicableTier ? applicableTier.discountPercent : 0;
        const discountAmount = basePrice * (discountPercent / 100);
        const grandTotal = basePrice - discountAmount;

        return {
            areaPerItem,
            totalArea,
            basePrice,
            discountPercent,
            discountAmount,
            grandTotal,
            message: applicableTier ? t('tierApplied') : null
        };
    }, [selectedMaterial, width, height, quantity, t]);

    return (
        <Card className="max-w-md mx-auto w-full">
            <Card.Header className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md font-bold">{t('calculator')}</p>
                    <p className="text-small text-default-500">{t('title')}</p>
                </div>
            </Card.Header>
            <Separator />
            <Card.Content className="gap-4">
                <div className="flex flex-col gap-1.5">
                    <Select
                        placeholder={t('selectMaterial')}
                        selectedKey={selectedMaterialId || undefined}
                        onSelectionChange={(key) => setSelectedMaterialId(key as string)}
                        variant="secondary"
                    >
                        <Label className="text-sm font-medium">{t('selectMaterial')}</Label>
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {materials.map((m) => (
                                    <ListBox.Item id={m.id} key={m.id} textValue={m.name}>
                                        {m.name} ({m.sellingPrice} / {m.unit})
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                <div className="flex gap-4">
                    <TextField className="flex-1" name="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)}>
                        <Label className="text-sm font-medium">{t('width')}</Label>
                        <Input variant="secondary" placeholder="0" />
                        <div className="text-default-400 text-[10px] font-bold mt-1">{t('centimeters')}</div>
                    </TextField>

                    <TextField className="flex-1" name="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)}>
                        <Label className="text-sm font-medium">{t('height')}</Label>
                        <Input variant="secondary" placeholder="0" />
                        <div className="text-default-400 text-[10px] font-bold mt-1">{t('centimeters')}</div>
                    </TextField>
                </div>

                <div className="flex flex-col gap-1.5">
                    <TextField name="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                        <Label className="text-sm font-medium">{t('quantity')}</Label>
                        <Input variant="secondary" placeholder="1" />
                    </TextField>
                </div>

                {selectedMaterial && calculation ? (
                    <div className="mt-4 bg-default-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-small text-default-500">
                            <span>{t('dimensions')}</span>
                            <span>{calculation.totalArea.toFixed(2)} {t('meters')}²</span>
                        </div>
                        <div className="flex justify-between text-small text-default-500">
                            <span>{t('pricePerUnit')}</span>
                            <span>฿{selectedMaterial.sellingPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-small">
                            <span>{t('subtotal')}</span>
                            <span>฿{calculation.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        {calculation.discountPercent > 0 && (
                            <div className="flex justify-between text-success text-small font-medium">
                                <span>{t('discount')} ({calculation.discountPercent}%)</span>
                                <span>-฿{calculation.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}

                        <Separator className="my-2" />

                        <div className="flex justify-between items-end">
                            <span className="font-semibold">{t('total')}</span>
                            <span className="text-xl font-bold text-primary">
                                ฿{calculation.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        {calculation.message && (
                            <Chip color="success" variant="soft" size="sm" className="w-full text-center">
                                {calculation.message}
                            </Chip>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-default-400 py-4">
                        {t('noMaterial')}
                    </div>
                )}
            </Card.Content>
        </Card>
    );
}
