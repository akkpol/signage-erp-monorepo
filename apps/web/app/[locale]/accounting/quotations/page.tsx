import { getQuotations } from "@/actions/accounting";
import { getMaterials } from "@/actions/stock"; // Re-using existing action
import { prisma } from "@/lib/prisma"; // Direct prisma for customers for now
import QuotationList from "@/components/accounting/QuotationList";
import { getTranslations } from "next-intl/server";

export default async function QuotationsPage() {
    const { data: quotations } = await getQuotations();
    const { data: materials } = await getMaterials();

    // Quick fetch for customers (Single Tenant)
    const customers = await prisma.customer.findMany();

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <QuotationList
                initialQuotations={quotations || []}
                materials={materials || []}
                customers={customers || []}
            />
        </div>
    );
}
