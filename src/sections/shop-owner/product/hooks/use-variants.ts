import { useGetPoductVariantsQuery } from 'src/store/shop-owner/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { VariantsDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';

export const UseVariants = () => {
  const { data, isLoading, error } = useGetPoductVariantsQuery();

  const variants = isSuccessResponse<VariantsDT>(data) ? data.payload.data : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { variants, errorMessage, isVariantsLoading: isLoading };
};
