'use client';

import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
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
        <Table aria-label="Invoices Table" shadow="none" className="bg-transparent">
          <TableHeader>
            <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('number')}</TableColumn>
            <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('customer')}</TableColumn>
            <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('total')}</TableColumn>
            <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('status')}</TableColumn>
            <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">{t('date')}</TableColumn>
            <TableColumn className="bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider text-right">{t('actions')}</TableColumn>
          </TableHeader>
          <TableBody emptyContent="ไม่พบข้อมูลใบแจ้งหนี้">
            {initialInvoices.map((inv) => (
              <TableRow key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-mono text-magenta-400 font-bold uppercase">{inv.invoiceNumber}</TableCell>
                <TableCell className="text-white font-medium">{inv.customer?.name || '-'}</TableCell>
                <TableCell className="text-white">
                   <span className="font-bold">฿ {inv.grandTotal.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <StatusChip status={inv.status} />
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {format(new Date(inv.createdAt), 'dd MMM yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Dropdown backdrop="blur" className="glass border border-white/10">
                    <DropdownTrigger>
                      <Button isIconOnly variant="light" size="sm" className="text-gray-400 hover:text-white">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Invoice Actions">
                      <DropdownItem key="view" startContent={<FileText size={16} />}>View Details</DropdownItem>
                      <DropdownItem key="print" startContent={<Printer size={16} />}>Print / Download</DropdownItem>
                      <DropdownItem key="send" startContent={<Send size={16} />}>Send to Customer</DropdownItem>
                      <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={16} />}>
                        Void Invoice
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
