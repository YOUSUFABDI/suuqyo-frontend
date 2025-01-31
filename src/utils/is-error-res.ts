import { ApiResponseDT, ApiErrorResponseDT } from '../types/api-response';

export const isErrorResponse = <T>(
  response: ApiResponseDT<T> | undefined
): response is ApiErrorResponseDT => {
  return (
    response !== undefined &&
    response.statusCode !== 200 &&
    response.error !== null &&
    'data' in response &&
    response.data === null
  );
};
