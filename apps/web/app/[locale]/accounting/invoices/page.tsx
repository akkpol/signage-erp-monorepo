import { getInvoices } from "@/actions/accounting";
import InvoiceList from "@/components/accounting/InvoiceList";

export default async function InvoicesPage() {
    const { data: invoices } = await getInvoices();

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <InvoiceList initialInvoices={invoices || []} />
        </div>
    );
}
