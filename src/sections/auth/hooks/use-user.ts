import { useGetUserQuery } from 'src/store/auth/auth';
import { UserResDT } from '../types/types';
import { isSuccessResponse } from 'src/utils/is-success-res';

export const useUser = () => {
  const { data, error, isLoading, refetch } = useGetUserQuery();

  const user = isSuccessResponse<UserResDT>(data) ? data.payload.data : null;

  return { user, isLoading, error, refetch };
};
