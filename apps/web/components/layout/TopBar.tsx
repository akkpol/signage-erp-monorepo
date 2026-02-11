'use client';

import { User } from "@heroui/react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function TopBar({ locale }: { locale: string }) {
    const t = useTranslations('Navigation');
    const pathname = usePathname();

    // Extract simple title from pathname
    const segments = pathname.split('/').filter(Boolean);
    const isRoot = segments.length <= 1; // Just locale or empty
    const lastSegment = isRoot ? 'dashboard' : segments[segments.length - 1];
    const pageTitle = t(lastSegment, { defaultValue: lastSegment });

    return (
        <header className="flex items-center justify-between h-16 px-8 glass mb-6 rounded-2xl border border-white/5 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white capitalize">{pageTitle}</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </div>

                <div className="h-8 w-[1px] bg-white/10" />

                <User
                    name="Akkarapol"
                    description="Owner"
                    avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                        isBordered: true,
                        color: "primary",
                        className: "w-8 h-8"
                    }}
                    classNames={{
                        name: "text-sm font-bold text-white",
                        description: "text-[10px] text-cyan-400 font-bold uppercase"
                    }}
                />
            </div>
        </header>
    );
}
