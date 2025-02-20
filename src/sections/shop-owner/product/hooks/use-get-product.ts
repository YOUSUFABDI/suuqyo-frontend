'use client';

import { useGetProductQuery } from 'src/store/shop-owner/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ProductResDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';

export const UseGetProduct = (id: number) => {
  const { data, isLoading, error } = useGetProductQuery({ id });

  const product = isSuccessResponse<ProductResDT>(data) ? data.payload.data : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { product, errorMessage };
};
