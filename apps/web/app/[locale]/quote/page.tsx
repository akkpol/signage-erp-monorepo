'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Divider, Spacer } from '@heroui/react';
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

        const area = w * h;
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

                <Card className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
                        <h2 className="text-lg font-semibold text-gray-200">{t('sectionDimensions')}</h2>
                    </CardHeader>
                    <CardBody className="gap-4 px-6 py-6">
                        <div className="flex gap-4">
                            <Input
                                type="number"
                                label={t('width')}
                                placeholder="0.00"
                                value={width}
                                onValueChange={setWidth}
                                variant="bordered"
                                classNames={{
                                    inputWrapper: "bg-gray-900/50 border-gray-700 hover:border-gray-500",
                                    label: "text-gray-400",
                                    input: "text-white text-lg font-medium"
                                }}
                            />
                            <Input
                                type="number"
                                label={t('height')}
                                placeholder="0.00"
                                value={height}
                                onValueChange={setHeight}
                                variant="bordered"
                                classNames={{
                                    inputWrapper: "bg-gray-900/50 border-gray-700 hover:border-gray-500",
                                    label: "text-gray-400",
                                    input: "text-white text-lg font-medium"
                                }}
                            />
                        </div>

                        <Input
                            type="number"
                            label={t('materialPrice')}
                            value={materialPrice}
                            onValueChange={setMaterialPrice}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "bg-gray-900/50 border-gray-700 hover:border-gray-500",
                                label: "text-gray-400",
                                input: "text-white text-lg font-medium"
                            }}
                        />

                        <Input
                            type="number"
                            label={t('laborCost')}
                            value={laborCost}
                            onValueChange={setLaborCost}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "bg-gray-900/50 border-gray-700 hover:border-gray-500",
                                label: "text-gray-400",
                                input: "text-white text-lg font-medium"
                            }}
                        />

                        <Divider className="my-2 bg-gray-700" />

                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-gray-400 text-sm">{t('estimatedPrice')}</span>
                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                                ฿{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <Spacer y={4} />

                        <div className="flex gap-3">
                            <Button
                                color="primary"
                                size="lg"
                                className="flex-1 font-semibold shadow-lg shadow-blue-500/20"
                                startContent={<ShoppingCart size={20} />}
                            >
                                {t('createOrder')}
                            </Button>
                            <Button
                                color="secondary"
                                variant="flat"
                                size="lg"
                                className="flex-1 font-semibold"
                                startContent={<Printer size={20} />}
                            >
                                {t('printQuote')}
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    {/* Quick Stats Placeholder */}
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">{t('jobsToday')}</p>
                        <p className="text-2xl font-bold text-white">12</p>
                    </div>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">{t('pending')}</p>
                        <p className="text-2xl font-bold text-orange-400">5</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
