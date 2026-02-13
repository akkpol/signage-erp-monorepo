'use client';

import { Avatar } from "@heroui/react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from "react";

export default function TopBar({ locale }: { locale: string }) {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Extract simple title from pathname
    const segments = pathname.split('/').filter(Boolean);
    const isRoot = segments.length <= 1; // Just locale or empty
    const lastSegment = isRoot ? 'dashboard' : segments[segments.length - 1];
    const pageTitle = mounted ? t(lastSegment, { defaultValue: lastSegment }) : lastSegment;

    return (
        <header className="flex items-center justify-between h-16 px-8 glass mb-6 rounded-2xl border border-white/5 animate-in slide-in-from-top duration-500" suppressHydrationWarning>
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white capitalize">{pageTitle}</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </div>

                <div className="h-8 w-[1px] bg-white/10" />

                <div className="flex items-center gap-3">
                    <Avatar
                        color="accent"
                        className="w-8 h-8 ring-2 ring-cyan-500"
                    >
                        <Avatar.Image src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Akkarapol</span>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">Owner</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
