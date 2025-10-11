import { useGetOneSizeQuery } from 'src/store/admin/variant';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { SizeDT } from '../types/types';

export const UseOneSize = (id: number) => {
  const { data, error, isLoading } = useGetOneSizeQuery({ id });

  const oneSize = isSuccessResponse<SizeDT>(data) ? data.payload.data : null;

  return { oneSize, error, isLoading };
};
