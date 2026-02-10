'use client';

import { Card, CardBody, Progress, Chip } from "@heroui/react";
import { FileText, PenTool, Printer, Truck, CheckCircle } from "lucide-react";

export default function JobRadar() {
    const stages = [
        { id: 'quote', label: 'Quote', count: 12, icon: <FileText size={16} />, color: 'primary' },
        { id: 'design', label: 'Design', count: 4, icon: <PenTool size={16} />, color: 'warning' },
        { id: 'production', label: 'Production', count: 8, icon: <Printer size={16} />, color: 'danger' },
        { id: 'install', label: 'Install', count: 2, icon: <Truck size={16} />, color: 'secondary' },
        { id: 'done', label: 'Done', count: 145, icon: <CheckCircle size={16} />, color: 'success' },
    ];

    const totalActive = 12 + 4 + 8 + 2;

    return (
        <Card className="w-full bg-[var(--bg-card)] border-none shadow-sm">
            <CardBody className="p-6">
                <h3 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
                    🏭 Job Radar <span className="text-xs font-normal text-[var(--text-muted)]">(Active: {totalActive})</span>
                </h3>

                {/* Visual Pipeline */}
                <div className="flex justify-between items-center relative mb-8">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-0 rounded-full" />

                    {stages.map((stage) => (
                        <div key={stage.id} className="relative z-10 flex flex-col items-center group cursor-pointer">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-app)] border-2 border-${stage.color === 'primary' ? 'blue' : stage.color === 'warning' ? 'orange' : stage.color === 'danger' ? 'red' : stage.color === 'secondary' ? 'purple' : 'green'}-500 shadow-lg transition-transform hover:scale-110`}>
                                <div className={`text-${stage.color === 'primary' ? 'blue' : stage.color === 'warning' ? 'orange' : stage.color === 'danger' ? 'red' : stage.color === 'secondary' ? 'purple' : 'green'}-500`}>
                                    {stage.icon}
                                </div>
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">{stage.label}</p>
                                <Chip size="sm" variant="flat" color={stage.color as any} className="mt-1 h-5 min-h-5 text-[10px]">
                                    {stage.count}
                                </Chip>
                            </div>
                        </div>
                    ))}
                </div>

                {/* List of "Action Required" items could go here */}
                <div className="bg-[var(--bg-app)] rounded-xl p-4">
                    <p className="text-xs text-[var(--text-muted)] text-center">Select a stage above to view details</p>
                </div>
            </CardBody>
        </Card>
    );
}
