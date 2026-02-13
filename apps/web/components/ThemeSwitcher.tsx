'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Button
            isIconOnly
            variant="light"
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Dark Mode"
            className={mounted ? "" : "opacity-50 cursor-not-allowed"}
            disabled={!mounted}
        >
            {mounted && theme === 'dark' ? (
                <Sun className="text-yellow-400" size={20} />
            ) : (
                <Moon className="text-slate-600" size={20} />
            )}
        </Button>
    );
}
