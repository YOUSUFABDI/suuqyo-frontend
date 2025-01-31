import { isErrorResponse } from 'src/utils/is-error-res';

export function getErrorMessage(error: any): string {
  let errorMessage = 'An unexpected error occurred';

  // Check for network error (no internet connection)
  if (!navigator.onLine) {
    errorMessage = 'No internet connection. Please check your network and try again.';
  }
  // Check if error is an API error response
  else if (error?.data && isErrorResponse(error.data)) {
    errorMessage = error.data.error.message || errorMessage;
  }
  // Fallback if the error object has a `message` field
  else if (error?.data?.message) {
    errorMessage = error.data.message;
  }
  // Handle generic error objects
  else if (error?.message) {
    errorMessage = error.message;
  }

  return errorMessage;
}
