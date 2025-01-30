import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const skuData = [
  { id: 'SKU1', units: 112, total: '₹1,69,900', asp: '₹699', change: 10, trend: 'up' },
  { id: 'SKU2', units: 68, total: '₹69,900', asp: '₹699', change: 26, trend: 'up' },
  { id: 'SKU3', units: 52, total: '₹69,900', asp: '₹1299', change: 12, trend: 'up' },
];

export const TopSkusTable = ({ className }: { className?: string }) => {
  return (
    <div className={cn("glass-card", className)}>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold">Top SKUs</h2>
        <div className="flex gap-2">
          <button className="filter-chip">Channel</button>
          <button className="filter-chip">Last 7 days</button>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>U</th>
            <th>Total</th>
            <th>ASP</th>
            <th>Ch%</th>
            <th>Rev</th>
          </tr>
        </thead>
        <tbody>
          {skuData.map((sku) => (
            <tr key={sku.id} className="hover:bg-white/5 transition-colors">
              <td>{sku.id}</td>
              <td>{sku.units}</td>
              <td>{sku.total}</td>
              <td>{sku.asp}</td>
              <td className="flex items-center gap-1 text-primary">
                {sku.change}%
                {sku.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </td>
              <td>
                <button className="hover:text-primary transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};