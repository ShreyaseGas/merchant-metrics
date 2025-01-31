import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Line, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const periods = [
  { label: 'Today', days: 0 },
  { label: 'Last 3 days', days: 3 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
];

const channels = [
  { value: 'Amazon', label: 'Amazon', color: '#FF9900' },
  { value: 'Flipkart', label: 'Flipkart', color: '#2874F0' },
  { value: 'Mystore', label: 'Mystore', color: '#2DD4BF' },
];

export const SalesChart = ({ className }: { className?: string }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[1]); // Default to Last 3 days
  const [selectedChannels, setSelectedChannels] = useState(channels.map(c => c.value));
  const [open, setOpen] = useState(false);

  const { data: salesData, isLoading } = useQuery({
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
      
      // Process data for chart
      const processedData = data.reduce((acc: any[], sale: any) => {
        const date = format(new Date(sale.sale_date), 'd/dd');
        const existingDay = acc.find(item => item.name === date);
        
        if (existingDay) {
          existingDay[sale.platforms.name] = (existingDay[sale.platforms.name] || 0) + sale.total_amount;
          existingDay.average = Object.values(existingDay)
            .filter(val => typeof val === 'number' && val !== existingDay.average)
            .reduce((sum: number, val: number) => sum + val, 0) / selectedChannels.length;
        } else {
          const newDay = {
            name: date,
            [sale.platforms.name]: sale.total_amount,
            average: sale.total_amount / selectedChannels.length
          };
          acc.push(newDay);
        }
        return acc;
      }, []);

      return processedData;
    }
  });

  const formatYAxis = (value: number) => {
    return `₹${(value / 1000).toFixed(1)}k`;
  };

  return (
    <div className={cn("glass-card p-4 bg-card rounded-lg", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Sales</h2>
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between min-w-[150px]"
              >
                {selectedChannels.length > 0
                  ? `${selectedChannels.length} selected`
                  : "Select channels"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search channels..." />
                <CommandEmpty>No channel found.</CommandEmpty>
                <CommandGroup>
                  {channels.map((channel) => (
                    <CommandItem
                      key={channel.value}
                      onSelect={() => {
                        setSelectedChannels(prev =>
                          prev.includes(channel.value)
                            ? prev.filter(c => c !== channel.value)
                            : [...prev, channel.value]
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedChannels.includes(channel.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {channel.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex gap-2">
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
              tickFormatter={formatYAxis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26, 31, 44, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff"
              }}
              formatter={(value: number) => [`₹${(value / 1000).toFixed(1)}k`, '']}
            />
            <Legend />
            {channels.map((channel) => (
              selectedChannels.includes(channel.value) && (
                <Bar
                  key={channel.value}
                  dataKey={channel.value}
                  fill={channel.color}
                  radius={[4, 4, 0, 0]}
                  name={channel.label}
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