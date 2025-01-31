import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export const StatsCard = ({ title, value, className }: StatsCardProps) => {
  return (
    <div className={cn("glass-card p-4 rounded-lg bg-card hover:bg-card/80 transition-colors", className)}>
      <p className="text-sm text-gray-400 mb-2">{title}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );
};