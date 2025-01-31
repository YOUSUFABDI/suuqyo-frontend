export type AdminAnalyticsResDT = {
  totalProfit: number;
  totalUsers: number;
  totalShopOwners: number;
  totalBuyers: number;
  monthlyProfit: {
    categories: string[];
    series: number[];
  };
  monthlyUsers: {
    categories: string[];
    series: number[];
  };
  monthlyShopOwners: {
    categories: string[];
    series: number[];
  };
  monthlyBuyers: {
    categories: string[];
    series: number[];
  };
  percentages: {
    profit: number;
    users: number;
    shopOwners: number;
    buyers: number;
  };
};
