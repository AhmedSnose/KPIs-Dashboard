import { MediumData, SalesData } from "@/types/SalesType";
import data from "../data.json";

export class SalesService {
  getAllSalesData(): Promise<SalesData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data.sales);
      }, 3000); 
    });
  }
  filteredSalesData(
    salesData: SalesData[],
    dateRange: { from: Date; to: Date }
  ) {
    return salesData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange?.from && itemDate <= dateRange.to;
    });
  }

  getMediumData(): MediumData[] {
    return data.mediumData
  }
}
