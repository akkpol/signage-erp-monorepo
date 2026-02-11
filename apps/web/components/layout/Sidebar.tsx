'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  ShoppingBag, 
  FileText, 
  CreditCard,
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'dashboard', href: '/' },
  { icon: Package, label: 'stock', href: '/stock' },
  { icon: Calculator, label: 'pricing', href: '/pricing' },
  { icon: ShoppingBag, label: 'orders', href: '/orders' },
  { icon: FileText, label: 'quotations', href: '/accounting/quotations' },
  { icon: CreditCard, label: 'invoices', href: '/accounting/invoices' },
];

export default function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 p-6 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-magenta-500 p-[2px]">
          <div className="w-full h-full rounded-[10px] bg-[#020617] flex items-center justify-center font-bold text-xl text-white">
            P
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-tight">
            PrintFlow
          </h1>
          <p className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] uppercase">
            Signage ERP
          </p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const fullHref = `/${locale}${item.href}`;
          const isActive = pathname === fullHref || (item.href !== '/' && pathname.startsWith(fullHref));
          
          return (
            <Link 
              key={item.href}
              href={fullHref}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 text-cyan-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]")} />
                <span className="font-medium text-sm">{t(item.label)}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-cyan-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 px-2">
        <Link 
          href={`/${locale}/settings`}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors text-sm"
        >
          <Settings size={18} />
          <span>{t('settings')}</span>
        </Link>
      </div>
    </aside>
  );
}
