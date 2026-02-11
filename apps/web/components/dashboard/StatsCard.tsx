import { Card, CardBody } from "@heroui/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    trend?: number; // percentage (positive, negative, or 0)
    icon: React.ReactNode;
    color?: "primary" | "success" | "warning" | "danger";
    className?: string;
}

export default function StatsCard({ title, value, trend, icon, color = "primary", className }: StatsCardProps) {
    const isPositive = trend && trend > 0;
    const isNegative = trend && trend < 0;

    const colorMap = {
        primary: "bg-blue-500/10 text-blue-500",
        success: "bg-green-500/10 text-green-500",
        warning: "bg-orange-500/10 text-orange-500",
        danger: "bg-red-500/10 text-red-500",
    };

    return (
        <Card className={cn("border-none shadow-sm hover:shadow-md transition-all bg-[var(--bg-card)]", className)}>
            <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className={`p-3 rounded-xl ${colorMap[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-[var(--text-main)]">{value}</h3>
                        {trend !== undefined && (
                            <span className={`text-xs flex items-center ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-400'}`}>
                                {isPositive ? <TrendingUp size={12} className="mr-1" /> : isNegative ? <TrendingDown size={12} className="mr-1" /> : <Minus size={12} className="mr-1" />}
                                {Math.abs(trend)}%
                            </span>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
