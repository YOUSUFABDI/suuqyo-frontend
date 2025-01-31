import { useGetOneShopOwnerQuery } from 'src/store/admin/shop-owner';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopOwnerDT } from '../types/types';

export const UseShopOwner = (id: number) => {
  const { data, error, isLoading } = useGetOneShopOwnerQuery({ id });

  const shopOwner = isSuccessResponse<ShopOwnerDT>(data) ? data.payload.data : null;

  return { shopOwner, error, isLoading };
};
