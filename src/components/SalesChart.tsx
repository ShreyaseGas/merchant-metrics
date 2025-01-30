import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Line, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are missing. Please check your environment variables.');
}

const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
);

const periods = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: 1 },
  { label: 'Last 3 days', days: 3 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
];

const channelColors = {
  Amazon: '#FF9900',
  Flipkart: '#2874F0',
  Webstore: '#2DD4BF'
};

export const SalesChart = ({ className }: { className?: string }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[2]); // Default to Last 3 days

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales', selectedPeriod.days],
    queryFn: async () => {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials are missing');
      }

      const endDate = new Date();
      const startDate = subDays(endDate, selectedPeriod.days);
      
      const { data, error } = await supabase
        .from('sales')
        .select(`
          total_amount,
          quantity,
          sale_date,
          platforms (name)
        `)
        .gte('sale_date', startDate.toISOString())
        .lte('sale_date', endDate.toISOString())
        .order('sale_date', { ascending: true });

      if (error) throw error;
      
      // Process data for chart
      const processedData = data.reduce((acc: any[], sale: any) => {
        const date = format(new Date(sale.sale_date), 'd/dd');
        const existingDay = acc.find(item => item.name === date);
        
        if (existingDay) {
          existingDay[sale.platforms.name] = sale.total_amount;
          existingDay.average = (existingDay.average || 0) + sale.total_amount;
        } else {
          const newDay = {
            name: date,
            [sale.platforms.name]: sale.total_amount,
            average: sale.total_amount
          };
          acc.push(newDay);
        }
        return acc;
      }, []);

      // Calculate average
      processedData.forEach(day => {
        day.average = day.average / Object.keys(channelColors).length;
      });

      return processedData;
    }
  });

  if (!supabaseUrl || !supabaseKey) {
    return <div className="text-red-500">Error: Supabase configuration is missing</div>;
  }

  return (
    <div className={cn("glass-card p-4 bg-card rounded-lg", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Sales</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {periods.map((period) => (
            <Button
              key={period.label}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="whitespace-nowrap"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#8A898C"
              tick={{ fill: '#8A898C' }}
            />
            <YAxis 
              stroke="#8A898C"
              tick={{ fill: '#8A898C' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26, 31, 44, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff"
              }}
            />
            <Legend />
            {Object.entries(channelColors).map(([channel, color]) => (
              <Bar
                key={channel}
                dataKey={channel}
                fill={color}
                radius={[4, 4, 0, 0]}
                name={channel}
              />
            ))}
            <Line
              type="monotone"
              dataKey="average"
              stroke="#F87171"
              strokeWidth={2}
              dot={false}
              name="Average Sales"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};