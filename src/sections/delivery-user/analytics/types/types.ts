type Metric = {
  current: number;
};

// Summary data type
type AnalyticsSummary = {
  ordersToDeliver: Metric;
  completedDeliveries: Metric;
  refundedDeliveries: Metric;
  all: Metric;
};

// Chart data type
type AnalyticsChartData = {
  categories: string[]; // Month abbreviations
  ordersToDeliver: number[];
  completedDeliveries: number[];
  refundedDeliveries: number[];
  all: number[];
};

// Complete analytics response type
export type DeliveryUserAnalyticsResDT = {
  summary: AnalyticsSummary;
  chartData: AnalyticsChartData;
  welcomeStats: {
    salesIncreasePercent: number;
  };
};
