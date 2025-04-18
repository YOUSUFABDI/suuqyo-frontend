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

export type getTopDeliveryUsersDT = {
  name: string;
  profileImage: string;
  phone: string;
  country: string;
  countryCode: string;
  totalDeliveries: number;
  rank: number;
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
  getTopDeliveryUsers: getTopDeliveryUsersDT[];
  welcomeStats: {
    salesIncreasePercent: number;
  };
};
