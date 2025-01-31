import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export const StatsCard = ({ title, value, className }: StatsCardProps) => {
  return (
    <div className={cn("glass-card p-3 rounded-lg bg-card", className)}>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
};