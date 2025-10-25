import { useGetOneColorQuery } from 'src/store/admin/variant';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ColorDT } from '../types/types';

export const UseOneColor = (id: number) => {
  const { data, error, isLoading } = useGetOneColorQuery({ id });

  const oneColor = isSuccessResponse<ColorDT>(data) ? data.payload.data : null;

  return { oneColor, error, isLoading };
};
