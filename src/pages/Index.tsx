import { useQuery } from '@tanstack/react-query';
import { SalesChart } from "@/components/SalesChart";
import { StatsCard } from "@/components/StatsCard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['sales-stats'],
    queryFn: async () => {
      const { data: salesData, error } = await supabase
        .from('sales')
        .select(`
          total_amount,
          quantity,
          platforms (name)
        `);

      if (error) throw error;

      const totalSales = salesData.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
      const totalOrders = salesData.length;
      const totalUnits = salesData.reduce((sum, sale) => sum + Number(sale.quantity), 0);
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      return {
        totalSales,
        totalOrders,
        totalUnits,
        averageOrderValue
      };
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-3 animate-fade-in">
        <div className="flex items-center justify-center h-full">
          <p className="text-white">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 animate-fade-in">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Sales Dashboard</h1>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-semibold">S</span>
        </div>
      </header>

      <div className="grid gap-4">
        <SalesChart className="animate-fade-in" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Sales" 
            value={stats ? formatCurrency(stats.totalSales) : '₹0'}
            className="animate-fade-in [animation-delay:100ms]"
          />
          <StatsCard 
            title="Total Orders" 
            value={stats?.totalOrders || 0}
            className="animate-fade-in [animation-delay:200ms]"
          />
          <StatsCard 
            title="Total Units" 
            value={stats?.totalUnits || 0}
            className="animate-fade-in [animation-delay:300ms]"
          />
          <StatsCard 
            title="Average Order Value" 
            value={stats ? formatCurrency(stats.averageOrderValue) : '₹0'}
            className="animate-fade-in [animation-delay:400ms]"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;