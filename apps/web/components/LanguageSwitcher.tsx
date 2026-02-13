'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../navigation';
import { Button, Dropdown, Label } from "@heroui/react";

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
            <Button variant="secondary" className="min-w-[80px]">
                {languages[locale as keyof typeof languages]}
            </Button>
            <Dropdown.Popover className="glass border border-white/10">
                <Dropdown.Menu
                    aria-label="Language Selection"
                    onAction={(key) => handleSelect(key as string)}
                >
                    <Dropdown.Item id="th" textValue="ไทย">
                        <Label>ไทย</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="en" textValue="English">
                        <Label>English</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="mm" textValue="မြန်မာ">
                        <Label>မြန်မာ</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}
