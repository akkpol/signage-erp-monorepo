import { getMaterials } from '@/actions/stock';
import PricingCalculator from '@/components/pricing/PricingCalculator';
import { getTranslations } from 'next-intl/server';

export default async function PricingPage() {
    const { data: materials } = await getMaterials();
    const t = await getTranslations('Pricing');

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
            <PricingCalculator materials={materials || []} />
        </div>
    );
}
