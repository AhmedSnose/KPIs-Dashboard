import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/store/storeHooks";

const CustomCard = ({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string;
  isLoading: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <div className="text-balance font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ({
  totalSales,
  averageWinRate,
  averageLossRate,
  totalOrders,
  pendingShipments,
  // isLoading = false,
}: {
  totalSales: number;
  averageWinRate: string;
  averageLossRate: string;
  totalOrders: number;
  pendingShipments: number;
  // isLoading?: boolean;
}) => {

  const isLoading = useAppSelector(state => state.loadingSlice.isLoading);


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <CustomCard
        title="Total Sales"
        isLoading={isLoading}
        value={"$" + totalSales.toLocaleString()}
      />
      <CustomCard
        title="P&L"
        isLoading={isLoading}
        value={`
            Profit Rate: ${averageWinRate}%
            Loss Rate: ${averageLossRate}%`}
      />

      <CustomCard
        isLoading={isLoading}
        title="Total Orders"
        value={totalOrders.toString()}
      />
      <CustomCard
        isLoading={isLoading}
        title="Pending Shipments"
        value={pendingShipments.toString()}
      />
    </div>
  );
};
