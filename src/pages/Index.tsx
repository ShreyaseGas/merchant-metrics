import { SalesChart } from "@/components/SalesChart";
import { StatsCard } from "@/components/StatsCard";
import { TopSkusTable } from "@/components/TopSkusTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 animate-fade-in">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales</h1>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-semibold">S</span>
        </div>
      </header>

      <div className="grid gap-4 md:gap-6">
        <SalesChart className="animate-fade-in" />
        
        <div className="grid grid-cols-3 gap-4">
          <StatsCard 
            title="Total Sales" 
            value="₹9,80,273.00"
            className="animate-fade-in [animation-delay:100ms]"
          />
          <StatsCard 
            title="Open Orders" 
            value="12"
            className="animate-fade-in [animation-delay:200ms]"
          />
          <StatsCard 
            title="Order Units" 
            value="5"
            className="animate-fade-in [animation-delay:300ms]"
          />
        </div>

        <TopSkusTable className="animate-fade-in [animation-delay:400ms]" />
      </div>
    </div>
  );
};

export default Index;