'use client';

import {
  Button,
  Chip,
  Dropdown,
  Separator
} from "@heroui/react";
import { MoreVertical, FileText, Send, Trash2, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

export default function InvoiceList({ initialInvoices }: { initialInvoices: any[] }) {
  const t = useTranslations('Accounting');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('invoices')}</h1>
          <p className="text-gray-400 text-sm">จัดการใบแจ้งหนี้และการรับชำระเงิน</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Table Header Replacement */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
          <div>{t('number')}</div>
          <div>{t('customer')}</div>
          <div>{t('total')}</div>
          <div>{t('status')}</div>
          <div>{t('date')}</div>
          <div className="text-right">{t('actions')}</div>
        </div>

        {/* Table Body Replacement */}
        <div className="flex flex-col">
          {initialInvoices.length === 0 && (
            <div className="p-8 text-center text-gray-500">ไม่พบข้อมูลใบแจ้งหนี้</div>
          )}
          {initialInvoices.map((inv) => (
            <div key={inv.id} className="grid grid-cols-6 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
              <div className="font-mono text-magenta-400 font-bold uppercase">{inv.invoiceNumber}</div>
              <div className="text-white font-medium truncate">{inv.customer?.name || '-'}</div>
              <div className="text-white">
                <span className="font-bold">฿ {inv.grandTotal.toLocaleString()}</span>
              </div>
              <div>
                <StatusChip status={inv.status} />
              </div>
              <div className="text-gray-400 text-sm">
                {format(new Date(inv.createdAt), 'dd MMM yyyy')}
              </div>
              <div className="text-right">
                <Dropdown className="glass border border-white/10">
                  <Dropdown.Trigger>
                    <Button isIconOnly variant="flat" size="sm" className="text-gray-400 hover:text-white">
                      <MoreVertical size={18} />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu aria-label="Invoice Actions">
                    <Dropdown.Item key="view">
                      <div className="flex items-center gap-2"><FileText size={16} /> View Details</div>
                    </Dropdown.Item>
                    <Dropdown.Item key="print">
                      <div className="flex items-center gap-2"><Printer size={16} /> Print / Download</div>
                    </Dropdown.Item>
                    <Dropdown.Item key="send">
                      <div className="flex items-center gap-2"><Send size={16} /> Send to Customer</div>
                    </Dropdown.Item>
                    <Dropdown.Item key="delete" className="text-danger">
                      <div className="flex items-center gap-2 font-bold"><Trash2 size={16} /> Void Invoice</div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const colors: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined> = {
    DRAFT: "default",
    SENT: "primary",
    PARTIAL: "warning",
    PAID: "success",
    VOID: "danger"
  };

  return (
    <Chip
      size="sm"
      variant="flat"
      color={colors[status] || "default"}
      className="bg-opacity-10 border border-current font-bold"
    >
      {status}
    </Chip>
  );
}
