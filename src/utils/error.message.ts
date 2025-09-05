import { isErrorResponse } from 'src/utils/is-error-res';

export function getErrorMessage(error: any): string {
  let errorMessage = 'An unexpected error occurred';

  // Check for network error (no internet connection)
  if (!navigator.onLine) {
    errorMessage = 'No internet connection. Please check your network and try again.';
  }
  // Handle RTK Query errors with data property
  else if (error?.data) {
    // Check if error is an API error response with our standard format
    if (isErrorResponse(error.data)) {
      errorMessage = error.data.error.message || errorMessage;
    }
    // Handle direct error message in data
    else if (typeof error.data === 'string') {
      errorMessage = error.data;
    }
    // Handle nested message in data
    else if (error.data.message) {
      errorMessage = error.data.message;
    }
    // Handle error object with error property
    else if (error.data.error) {
      if (typeof error.data.error === 'string') {
        errorMessage = error.data.error;
      } else if (error.data.error.message) {
        errorMessage = error.data.error.message;
      }
    }
  }
  // Handle axios-style errors
  else if (error?.response?.data) {
    if (typeof error.response.data === 'string') {
      errorMessage = error.response.data;
    } else if (error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.data.error?.message) {
      errorMessage = error.response.data.error.message;
    }
  }
  // Handle direct error messages
  else if (error?.message) {
    errorMessage = error.message;
  }
  // Handle status-based errors
  else if (error?.status) {
    switch (error.status) {
      case 400:
        errorMessage = 'Bad request. Please check your input and try again.';
        break;
      case 401:
        errorMessage = 'Unauthorized. Please log in and try again.';
        break;
      case 403:
        errorMessage = 'Access denied. You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'Resource not found.';
        break;
      case 413:
        errorMessage = 'File too large. Please use a smaller file.';
        break;
      case 415:
        errorMessage = 'Unsupported file type. Please use a supported image format.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        errorMessage = `Request failed with status ${error.status}`;
    }
  }

  // Clean up the error message
  errorMessage = errorMessage.trim();

  // Provide more user-friendly messages for common upload errors
  if (
    errorMessage.toLowerCase().includes('file size too large') ||
    errorMessage.toLowerCase().includes('payload too large')
  ) {
    errorMessage = 'The image file is too large. Please use a smaller image (max 10MB).';
  } else if (
    errorMessage.toLowerCase().includes('invalid image') ||
    errorMessage.toLowerCase().includes('unsupported file type')
  ) {
    errorMessage = 'Invalid image format. Please use JPEG, PNG, GIF, WebP, or BMP images.';
  } else if (
    errorMessage.toLowerCase().includes('timeout') ||
    errorMessage.toLowerCase().includes('network error')
  ) {
    errorMessage = 'Upload timeout. Please check your connection and try again.';
  } else if (errorMessage.toLowerCase().includes('cors')) {
    errorMessage = 'Connection error. Please try again.';
  }

  return errorMessage;
}
