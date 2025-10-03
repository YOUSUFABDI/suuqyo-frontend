import { useEffect, useState } from "react";
import { ShopInfoDT } from "../types/types";
import { useShopsQuery } from "src/store/customer/shop";
import { isSuccessResponse } from "src/utils/is-success-res";

export const useShuffledShops = () => {
      const [shops, setShops] = useState<ShopInfoDT['shop'][]>([]);
      const [isLoading, setIsLoading] = useState(true);
    
      // Fetch only 12 shops for the featured section
      const { data, isLoading: isFetching } = useShopsQuery({ page: 1, limit: 24 });
    
      useEffect(() => {
        if (data) {
          const isSuccess = isSuccessResponse(data);
          
          if (isSuccess && data.payload && data.payload.data) {
            // Get the shops data
            const fetchedShops = data.payload.data.data;
            
            // Shuffle the shops array to randomize the order
            const shuffledShops = [...fetchedShops].sort(() => Math.random() - 0.5);
            
            // Take only 12 shops (or less if there aren't enough)
            const limitedShops = shuffledShops.slice(0, 12);
            
            setShops(limitedShops);
          }
          
          setIsLoading(false);
        }
      }, [data]);

      return {
        shops,
        isLoading: isLoading,
        isFetching
      }
}