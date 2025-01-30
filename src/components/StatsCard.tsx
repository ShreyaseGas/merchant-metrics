import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export const StatsCard = ({ title, value, className }: StatsCardProps) => {
  return (
    <div className={cn("glass-card p-4", className)}>
      <p className="stats-label">{title}</p>
      <p className="stats-value">{value}</p>
    </div>
  );
};