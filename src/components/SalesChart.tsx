import { Line, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

const data = [
  { name: 'M/11', sales: 30, orders: 25 },
  { name: 'T/12', sales: 35, orders: 30 },
  { name: 'W/13', sales: 38, orders: 35 },
  { name: 'T/14', sales: 40, orders: 32 },
  { name: 'F/15', sales: 38, orders: 30 },
  { name: 'S/16', sales: 42, orders: 35 },
  { name: 'S/17', sales: 45, orders: 40 },
];

export const SalesChart = ({ className }: { className?: string }) => {
  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sales</h2>
        <div className="flex gap-2">
          <button className="filter-chip">Channel</button>
          <button className="filter-chip">Last 7 days</button>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#8A898C" />
            <YAxis stroke="#8A898C" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26, 31, 44, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="orders" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="sales" stroke="#F87171" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};