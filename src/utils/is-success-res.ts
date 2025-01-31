import { ApiResponseDT, ApiSuccessResponseDT } from '../types/api-response';

export const isSuccessResponse = <T>(
  response: ApiResponseDT<T> | undefined
): response is ApiSuccessResponseDT<T> => {
  return response !== undefined && response.error === null && 'payload' in response;
};
