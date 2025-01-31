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
  { label: '3d', days: 3 },
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
];

const channels = [
  { value: 'Amazon', label: 'Amazon', color: '#FF9900' },
  { value: 'Flipkart', label: 'Flipkart', color: '#2874F0' },
  { value: 'Mystore', label: 'Mystore', color: '#2DD4BF' },
];

export const SalesChart = ({ className }: { className?: string }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[1]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(channels.map(c => c.value));
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
      const processedData = (data || []).reduce((acc: any[], sale: any) => {
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

      return processedData;
    }
  });

  const formatYAxis = (value: number) => {
    return `₹${(value / 1000).toFixed(1)}k`;
  };

  const filteredChannels = channels.filter(channel =>
    channel.label.toLowerCase().includes(value.toLowerCase())
  );

  if (isLoading) {
    return <div className="h-[200px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className={cn("glass-card p-3 bg-card rounded-lg", className)}>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-white">Sales</h2>
        <div className="flex flex-wrap gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[120px] justify-between text-xs"
              >
                {selectedChannels.length} channel{selectedChannels.length !== 1 ? 's' : ''}
                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command value={value} onValueChange={setValue}>
                <CommandInput placeholder="Search channels..." className="h-9" />
                <CommandEmpty>No channel found.</CommandEmpty>
                <CommandGroup>
                  {filteredChannels.map((channel) => (
                    <CommandItem
                      key={channel.value}
                      value={channel.value}
                      onSelect={(currentValue) => {
                        setSelectedChannels(prev =>
                          prev.includes(currentValue)
                            ? prev.filter(c => c !== currentValue)
                            : [...prev, currentValue]
                        );
                      }}
                      className="text-sm"
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

          <div className="flex flex-wrap gap-1">
            {periods.map((period) => (
              <Button
                key={period.label}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs px-2 h-8"
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={salesData || []} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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