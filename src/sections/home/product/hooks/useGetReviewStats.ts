import { useGetReviewStatsQuery } from "src/store/customer/review";

export const useGetReviewStats = (productIdNum: number | null) => {
  const { data: statsData } = useGetReviewStatsQuery(productIdNum ?? 0, {
    skip: productIdNum === null,
  });

  return statsData;
};