'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../navigation';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleSelect = (key: string) => {
        router.replace(pathname, { locale: key });
    };

    const languages = {
        en: "English",
        th: "ไทย",
        mm: "မြန်မာ"
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="flat" className="min-w-[80px]">
                    {languages[locale as keyof typeof languages]}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Language Selection"
                onAction={(key) => handleSelect(key as string)}
            >
                <DropdownItem key="th">ไทย</DropdownItem>
                <DropdownItem key="en">English</DropdownItem>
                <DropdownItem key="mm">မြန်မာ</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
