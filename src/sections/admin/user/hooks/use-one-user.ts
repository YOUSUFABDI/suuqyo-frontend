import { useGetOneUserQuery } from 'src/store/admin/user';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { UserDT } from '../types/types';

export const UseOneUser = (id: string) => {
  const { data, error, isLoading } = useGetOneUserQuery({ id });

  const oneUser = isSuccessResponse<UserDT>(data) ? data.payload.data : null;

  return { oneUser, error, isLoading };
};
