'use client';

import { Card, CardBody } from "@heroui/react";
import { Plus, Upload, UserPlus, FilePlus } from "lucide-react";
import { useRouter } from "../../navigation";

export default function QuickActions() {
    const router = useRouter();

    const actions = [
        { title: "New Quote", icon: <Plus size={20} />, path: "/quote", color: "bg-blue-600 text-white" },
        { title: "Upload File", icon: <Upload size={20} />, path: "/files", color: "bg-purple-600 text-white" },
        { title: "Add Customer", icon: <UserPlus size={20} />, path: "/customers/new", color: "bg-emerald-600 text-white" },
        { title: "Create Invoice", icon: <FilePlus size={20} />, path: "/invoices/new", color: "bg-orange-600 text-white" },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => (
                <Card
                    key={action.title}
                    isPressable
                    onPress={() => router.push(action.path)}
                    className="bg-[var(--bg-card)] border-none shadow-sm hover:translate-y-[-2px] transition-transform"
                >
                    <CardBody className="flex flex-col items-center justify-center p-4 gap-2 text-center">
                        <div className={`p-3 rounded-full ${action.color} shadow-md`}>
                            {action.icon}
                        </div>
                        <span className="text-xs font-semibold text-[var(--text-main)]">{action.title}</span>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
