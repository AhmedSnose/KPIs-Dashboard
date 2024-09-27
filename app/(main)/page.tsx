"use client";

import HomePageCards from "@/components/home/HomePageCards";
import HomePageCharts from "@/components/home/HomePageCharts";
import HomePageOrdersTable from "@/components/home/HomePageOrdersTable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { changeLoadingState } from "@/lib/store/loadingSlice";
import { useAppDispatch } from "@/lib/store/storeHooks";
import { cn } from "@/lib/utils";
import { OrdersService } from "@/services/OrdersService";
import { SalesService } from "@/services/SalesService";
import { Order } from "@/types/OrderTypes";
import { MediumData, SalesData } from "@/types/SalesType";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StoreProvider from "../../lib/store/StoreProvider";

const ordersService = new OrdersService();
const salesService = new SalesService();

export default function () {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: addDays(new Date(), -29),
    to: new Date(),
  });

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [mediumData, setMediumData] = useState<MediumData[]>([]);
  const dispatcher = useAppDispatch();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        dispatcher(changeLoadingState(true));
        const [orders, sales, mediumData] = await Promise.all([
          ordersService.getAllOrders(),
          salesService.getAllSalesData(),
          salesService.getMediumData(),
        ]);

        setLatestOrders(orders);
        setSalesData(sales);
        setMediumData(mediumData);

        toast({
          description: "Data fetched successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching data",
        });
      } finally {
        dispatcher(changeLoadingState(false));
      }
    };

    fetchAllData();
  }, []);

  const filteredSalesData = useMemo(() => {
    return salesService.filteredSalesData(salesData, dateRange);
  }, [dateRange, salesData]);

  const filteredOrders = useMemo(() => {
    return ordersService.filteredOrders(latestOrders, dateRange, statusFilter);
  }, [dateRange, statusFilter, latestOrders]);

  const {
    totalSales,
    totalOrders,
    pendingShipments,
    totalConversions,
    totalSessions,
    conversionRate,
    averageWinRate,
    averageLossRate,
  } = ordersService.getKPIsInfo(filteredOrders, filteredSalesData);

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(obj) =>
                obj?.from != undefined && obj.to != undefined
                  ? setDateRange({ from: obj.from, to: obj.to })
                  : null
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <hr />
      <HomePageCards
        averageLossRate={averageLossRate}
        averageWinRate={averageWinRate}
        pendingShipments={pendingShipments}
        totalOrders={totalOrders}
        totalSales={totalSales}
      />
      <HomePageCharts
        conversionRate={conversionRate}
        mediumData={mediumData}
        salesData={filteredSalesData}
      />
      <HomePageOrdersTable filteredOrders={filteredOrders} />
    </div>
  );
};
