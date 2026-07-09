export interface DashboardOverview {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  onlineNow: number;
  todayVisitors: number;
  totalVisitors: number;
}

export interface OrderLifecycle {
  PENDING: number;
  CONFIRMED: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELED: number;
  RETURNED: number;
}

export interface PerformanceChartItem {
  label: string;
  placed: number;
  delivered: number;
  canceled: number;
}