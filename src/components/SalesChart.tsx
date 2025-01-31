import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Line, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const periods = [
  { label: 'Today', days: 0, value: 'today' },
  { label: '3d', days: 3, value: '3d' },
  { label: '7d', days: 7, value: '7d' },
  { label: '14d', days: 14, value: '14d' },
  { label: '30d', days: 30, value: '30d' },
];

const channels = [
  { value: 'Amazon', label: 'Amazon', color: '#FF9900' },
  { value: 'Flipkart', label: 'Flipkart', color: '#2874F0' },
  { value: 'Mystore', label: 'Mystore', color: '#2DD4BF' },
];

export const SalesChart = ({ className }: { className?: string }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[2]); // Default to 7d
  const [selectedChannels, setSelectedChannels] = useState<string[]>(channels.map(c => c.value));

  const { data: salesData = [], isLoading } = useQuery({
    queryKey: ['sales', selectedPeriod.days, selectedChannels],
    queryFn: async () => {
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
        .in('platforms.name', selectedChannels)
        .order('sale_date', { ascending: true });

      if (error) throw error;
      
      return (data || []).reduce((acc: any[], sale: any) => {
        const date = format(new Date(sale.sale_date), 'dd/MM');
        const existingDay = acc.find(item => item.name === date);
        
        if (existingDay) {
          existingDay[sale.platforms.name] = (existingDay[sale.platforms.name] || 0) + Number(sale.total_amount);
          const channelValues = selectedChannels.map(channel => 
            typeof existingDay[channel] === 'number' ? existingDay[channel] : 0
          );
          const totalAmount = channelValues.reduce((sum, val) => sum + val, 0);
          existingDay.average = totalAmount / selectedChannels.length;
        } else {
          const newDay = {
            name: date,
            [sale.platforms.name]: Number(sale.total_amount),
            average: Number(sale.total_amount) / selectedChannels.length
          };
          acc.push(newDay);
        }
        return acc;
      }, []);
    }
  });

  const formatYAxis = (value: number) => {
    return `₹${(value / 1000).toFixed(1)}k`;
  };

  if (isLoading) {
    return <div className="h-[200px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className={cn("p-6 bg-card rounded-lg shadow-lg", className)}>
      <h2 className="text-xl font-semibold text-white mb-4">Sales Overview</h2>
      
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-white">Channels:</label>
          <div className="flex flex-wrap gap-2">
            {channels.map((channel) => (
              <Button
                key={channel.value}
                variant={selectedChannels.includes(channel.value) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedChannels(prev =>
                    prev.includes(channel.value)
                      ? prev.filter(c => c !== channel.value)
                      : [...prev, channel.value]
                  );
                }}
                className="text-xs px-2 h-8"
                style={{
                  backgroundColor: selectedChannels.includes(channel.value) ? channel.color : undefined,
                  borderColor: channel.color,
                  color: selectedChannels.includes(channel.value) ? '#FFFFFF' : channel.color,
                }}
              >
                {channel.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-[200px]">
          <label className="block text-sm font-medium mb-1 text-white">Period:</label>
          <Select
            value={selectedPeriod.value}
            onValueChange={(value) => {
              const period = periods.find(p => p.value === value);
              if (period) setSelectedPeriod(period);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={salesData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#8A898C"
              tick={{ fill: '#8A898C', fontSize: 10 }}
              tickMargin={5}
            />
            <YAxis 
              stroke="#8A898C"
              tick={{ fill: '#8A898C', fontSize: 10 }}
              tickFormatter={formatYAxis}
              tickMargin={5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26, 31, 44, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px"
              }}
              formatter={(value: number) => [`₹${(value / 1000).toFixed(1)}k`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            {channels.map((channel) => (
              selectedChannels.includes(channel.value) && (
                <Bar
                  key={channel.value}
                  dataKey={channel.value}
                  fill={channel.color}
                  radius={[4, 4, 0, 0]}
                  name={channel.label}
                  barSize={20}
                />
              )
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