type Metric = {
  current: number;
};

// New product type
type NewProduct = {
  id: number;
  name: string;
  images: Array<{
    image: string;
  }>;
};

// Summary data type
type AnalyticsSummary = {
  totalProducts: Metric;
  totalOrders: Metric;
  completedOrders: Metric;
  totalRevenue: Metric;
  productsSold: Metric;
};

// Chart data type
type AnalyticsChartData = {
  categories: string[]; // Month abbreviations
  orders: number[];
  completedOrders: number[];
  productsSold: number[];
  revenue: number[];
};

// Complete analytics response type
export type ShopOwnerAnalyticsResDT = {
  summary: AnalyticsSummary;
  chartData: AnalyticsChartData;
  newProducts: NewProduct[];
  welcomeStats: {
    salesIncreasePercent: number;
  };
};
