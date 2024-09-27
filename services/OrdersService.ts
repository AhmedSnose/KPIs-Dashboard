import { Order } from "@/types/OrderTypes";
import data from "../data.json";
import { SalesData } from "@/types/SalesType";



export class OrdersService {
  getAllOrders(): Order[] {
    return data.orders[0];
  }

  filteredOrders(
    latestOrders: Order[],
    dateRange: { from: Date; to: Date },
    statusFilter: string
  ) {
    return latestOrders.filter((order) => {
      const orderDate = new Date(order.date);
      const dateInRange =
        orderDate >= dateRange?.from && orderDate <= dateRange.to;
      const statusMatch =
        statusFilter === "All" || order.status === statusFilter;

      const searchMatch =
        order.customer.toLowerCase().includes("") || order.id.includes("");

      return dateInRange && statusMatch && searchMatch;
    });
  }

  getKPIsInfo(
    filteredOrders: Order[],
    filteredSalesData: SalesData[]
  ) {
    const totalSales = filteredSalesData.reduce((sum, day) => sum + day.sales, 0);
    const totalOrders = filteredOrders.length;

    const pendingShipments = filteredOrders.filter(
      (order) => order.status === "Pending" || order.status === "Processing"
    ).length;

    const totalConversions = filteredSalesData.reduce(
      (sum, day) => sum + day.conversions,
      0
    );

    const totalSessions = filteredSalesData.reduce(
      (sum, day) => sum + day.sessions,
      0
    );

    const conversionRate = (
      (totalConversions / totalSessions) * 100
    ).toFixed(2);

    const averageWinRate = (
      (filteredSalesData.reduce((sum, day) => sum + day.winRate, 0) /
        filteredSalesData.length) *
      100
    ).toFixed(2);

    const averageLossRate = (
      (filteredSalesData.reduce((sum, day) => sum + day.lossRate, 0) /
        filteredSalesData.length) *
      100
    ).toFixed(2);

    return {
      totalSales,
      totalOrders,
      pendingShipments,
      totalConversions,
      totalSessions,
      conversionRate,
      averageWinRate,
      averageLossRate
    };
  }
}
