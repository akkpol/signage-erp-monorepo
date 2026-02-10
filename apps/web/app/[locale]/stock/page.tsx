import { getMaterials } from '@/actions/stock';
import MaterialList from '@/components/stock/MaterialList';
import { getTranslations } from 'next-intl/server';

export default async function StockPage() {
    const { data: materials } = await getMaterials();
    const t = await getTranslations('Stock');

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <MaterialList initialMaterials={materials || []} />
        </div>
    );
}
