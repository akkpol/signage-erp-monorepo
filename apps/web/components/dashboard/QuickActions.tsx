'use client';

import { Card } from "@heroui/react";
import { Plus, PenTool, FilePlus } from "lucide-react";
import { useRouter } from "../../navigation";

export default function QuickActions() {
    const router = useRouter();

    const actions = [
        { title: "New Quote", icon: <Plus size={20} />, path: "/accounting/quotations", color: "text-cyan-400 bg-cyan-400/10 border-cyan-500/20" },
        { title: "Production", icon: <PenTool size={20} />, path: "/orders", color: "text-magenta-400 bg-magenta-400/10 border-magenta-500/20" },
        { title: "Add Stock", icon: <Plus size={20} />, path: "/stock", color: "text-blue-400 bg-blue-400/10 border-blue-500/20" },
        { title: "Invoices", icon: <FilePlus size={20} />, path: "/accounting/invoices", color: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20" },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {actions.map((action) => (
                <div
                    key={action.title}
                    onClick={() => router.push(action.path)}
                    className="cursor-pointer group"
                >
                    <Card className="glass-card border-white/5 bg-white/5 group-hover:bg-white/10 group-hover:translate-y-[-4px] transition-all duration-300">
                        <Card.Content className="flex flex-col items-center justify-center p-6 gap-3 text-center">
                            <div className={`p-4 rounded-2xl shadow-xl border ${action.color}`}>
                                {action.icon}
                            </div>
                            <span className="text-xs font-bold text-white uppercase tracking-widest">{action.title}</span>
                        </Card.Content>
                    </Card>
                </div>
            ))}
        </div>
    );
}
