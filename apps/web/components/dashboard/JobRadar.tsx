'use client';

import { Card, Chip } from "@heroui/react";
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
        <Card className="glass-card border-white/5 bg-white/5 overflow-hidden">
            <Card.Content className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                        Production Radar
                    </h3>
                    <Chip size="sm" color="accent" variant="soft" className="bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                        Active: {totalActive}
                    </Chip>
                </header>

                {/* Visual Pipeline */}
                <div className="flex justify-between items-center relative mb-10 px-4">
                    {/* Connecting Line */}
                    <div className="absolute top-[20px] left-0 w-full h-[2px] bg-white/5 border-t border-dashed border-white/10 -z-0" />

                    {stages.map((stage) => (
                        <div key={stage.id} className="relative z-10 flex flex-col items-center group cursor-pointer">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-900 border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-${stage.color === 'primary' ? 'blue' : stage.color === 'warning' ? 'orange' : stage.color === 'danger' ? 'red' : stage.color === 'secondary' ? 'purple' : 'green'}-500/50 group-hover:scale-110`}>
                                <div className={`text-${stage.color === 'primary' ? 'blue' : stage.color === 'warning' ? 'orange' : stage.color === 'danger' ? 'red' : stage.color === 'secondary' ? 'purple' : 'green'}-400`}>
                                    {stage.icon}
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-white transition-colors">{stage.label}</p>
                                <div className="mt-1 font-extrabold text-white text-lg">
                                    {stage.count}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Bar */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">System Optimal</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-500/50">NODE-042-PRODUCTION</span>
                </div>
            </Card.Content>
        </Card>
    );
}
