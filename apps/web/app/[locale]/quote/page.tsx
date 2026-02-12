'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Separator, TextField, Label } from '@heroui/react';
import { Calculator, ShoppingCart, Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function QuotePage() {
    const t = useTranslations('Quote');
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [materialPrice, setMaterialPrice] = useState<string>('650'); // Default Vinyl price
    const [laborCost, setLaborCost] = useState<string>('500'); // Default labor
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const w = parseFloat(width) || 0;
        const h = parseFloat(height) || 0;
        const mat = parseFloat(materialPrice) || 0;
        const labor = parseFloat(laborCost) || 0;

        const area = (w / 100) * (h / 100); // Assuming cm input, sqm calculation
        const materialCost = area * mat;
        const total = materialCost + labor;

        setTotalPrice(total);
    }, [width, height, materialPrice, laborCost]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
            <div className="max-w-md mx-auto pt-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <Calculator size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                            {t('title')}
                        </h1>
                        <p className="text-gray-400 text-sm">{t('subtitle')}</p>
                    </div>
                </div>

                <Card className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
                    <Card.Header className="flex flex-col gap-1 px-6 pt-6 pb-0">
                        <h2 className="text-lg font-semibold text-gray-200">{t('sectionDimensions')}</h2>
                    </Card.Header>
                    <Card.Content className="flex flex-col gap-4 px-6 py-6">
                        <div className="flex gap-4">
                            <TextField className="flex-1" type="number" value={width} onChange={setWidth}>
                                <Label className="text-sm font-medium text-gray-400">{t('width')}</Label>
                                <Input
                                    placeholder="0"
                                    variant="secondary"
                                    className="bg-gray-900/50 rounded-xl"
                                />
                            </TextField>
                            <TextField className="flex-1" type="number" value={height} onChange={setHeight}>
                                <Label className="text-sm font-medium text-gray-400">{t('height')}</Label>
                                <Input
                                    placeholder="0"
                                    variant="secondary"
                                    className="bg-gray-900/50 rounded-xl"
                                />
                            </TextField>
                        </div>

                        <TextField type="number" value={materialPrice} onChange={setMaterialPrice}>
                            <Label className="text-sm font-medium text-gray-400">{t('materialPrice')}</Label>
                            <Input
                                placeholder="0"
                                variant="secondary"
                                className="bg-gray-900/50 rounded-xl"
                            />
                        </TextField>

                        <TextField type="number" value={laborCost} onChange={setLaborCost}>
                            <Label className="text-sm font-medium text-gray-400">{t('laborCost')}</Label>
                            <Input
                                placeholder="0"
                                variant="secondary"
                                className="bg-gray-900/50 rounded-xl"
                            />
                        </TextField>

                        <Separator className="my-2 bg-gray-700/50" />

                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">{t('estimatedPrice')}</span>
                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                                ฿{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="h-4" />

                        <div className="flex gap-3">
                            <Button
                                variant="primary"
                                size="lg"
                                className="flex-1 font-bold rounded-2xl h-14"
                                onPress={() => { }}
                            >
                                <ShoppingCart size={20} className="mr-2" />
                                {t('createOrder')}
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="flex-1 font-bold rounded-2xl h-14"
                                onPress={() => { }}
                            >
                                <Printer size={20} className="mr-2" />
                                {t('printQuote')}
                            </Button>
                        </div>
                    </Card.Content>
                </Card>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 p-4 rounded-2xl border border-gray-700/30 backdrop-blur-md">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">{t('jobsToday')}</p>
                        <p className="text-2xl font-black text-white">12</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-2xl border border-gray-700/30 backdrop-blur-md">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">{t('pending')}</p>
                        <p className="text-2xl font-black text-orange-400">5</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
