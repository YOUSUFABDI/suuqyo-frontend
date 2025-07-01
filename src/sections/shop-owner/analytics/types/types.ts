// type Metric = {
//   current: number;
// };

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
  totalProducts: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSale: number;
  quantitySold: number;
  totalCost: number; // ← new
  totalProfit: number; // ← new
  getTopDeliveryUsers: getTopDeliveryUsersDT[];
};

// Chart data type
type AnalyticsChartData = {
  categories: string[]; // Month abbreviations
  orders: number[];
  completedOrders: number[];
  productsSold: number[];
  revenue: number[];
  cost: number[]; // ← new
  profit: number[]; // ← new
};

// Complete analytics response type
export type ShopOwnerAnalyticsResDT = {
  summary: AnalyticsSummary;
  // chartData: AnalyticsChartData;
  newProducts: NewProduct[];
  getTopDeliveryUsers: getTopDeliveryUsersDT[];
  welcomeStats: {
    salesIncreasePercent: number;
  };
};
