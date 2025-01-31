export type ApiSuccessResponseDT<T> = {
  statusCode: number;
  payload: {
    message: string;
    data: T;
  };
  error: null;
};

export type ApiErrorResponseDT = {
  statusCode: number;
  data: null;
  error: {
    statusCode: number;
    message: string;
    details?: string;
  };
};

export type ApiResponseDT<T> = ApiSuccessResponseDT<T> | ApiErrorResponseDT;
