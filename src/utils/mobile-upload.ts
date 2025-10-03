/**
 * Mobile upload utilities to handle file uploads on mobile devices
 * with better error handling and optimization
 */

// Check if the user is on a mobile device
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check network connection quality
export const getNetworkQuality = (): 'slow' | 'fast' | 'unknown' => {
  if (typeof window === 'undefined') return 'unknown';

  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) return 'unknown';

  // Consider 2G and slow-2g as slow
  if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    return 'slow';
  }

  return 'fast';
};

// Compress image file for mobile uploads with aggressive compression for large files
export const compressImageForMobile = async (file: File, maxSizeMB: number = 5): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // More aggressive compression for large files
      const fileSizeMB = file.size / (1024 * 1024);
      let maxWidth = 1920;
      let maxHeight = 1080;
      let quality = 0.8;

      // Adjust compression based on file size
      if (fileSizeMB > 10) {
        maxWidth = 1280;
        maxHeight = 720;
        quality = 0.6;
      } else if (fileSizeMB > 5) {
        maxWidth = 1600;
        maxHeight = 900;
        quality = 0.7;
      }

      let { width, height } = img;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            // console.log(
            //   `Image compressed: ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
            // );
            resolve(compressedFile);
          } else {
            resolve(file); // Return original if compression fails
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => resolve(file); // Return original if loading fails
    img.src = URL.createObjectURL(file);
  });
};

// Optimize files for mobile upload - now more conservative to preserve quality
export const optimizeFilesForMobile = async (files: File[]): Promise<File[]> => {
  // Don't compress on mobile anymore - let users upload original files
  // Only compress if network is extremely slow and file is very large
  const networkQuality = getNetworkQuality();

  const optimizedFiles = await Promise.all(
    files.map(async (file) => {
      // Only compress images if network is slow AND file is > 100MB
      if (file.type.startsWith('image/')) {
        const fileSizeMB = file.size / (1024 * 1024);

        // Very conservative compression - only for extremely large files on slow networks
        const shouldCompress = networkQuality === 'slow' && fileSizeMB > 100;

        if (shouldCompress) {
          // console.log(
          //   `Compressing very large image for slow network: ${file.name} (${fileSizeMB.toFixed(2)}MB)`
          // );
          return await compressImageForMobile(file);
        } else {
          // console.log(`Keeping original image: ${file.name} (${fileSizeMB.toFixed(2)}MB)`);
        }
      }

      // For PDFs, just log the size but never compress
      if (file.type === 'application/pdf') {
        const fileSizeDisplay =
          file.size > 1024 * 1024 * 1024
            ? `${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB`
            : `${(file.size / (1024 * 1024)).toFixed(2)}MB`;
        // console.log(`PDF file: ${file.name} (${fileSizeDisplay}) - keeping original`);
      }

      return file;
    })
  );

  return optimizedFiles;
};

// Create FormData with mobile optimizations
export const createOptimizedFormData = async (
  data: Record<string, any>,
  files: Record<string, File | File[] | null>
): Promise<FormData> => {
  const formData = new FormData();

  // Add non-file data
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  });

  // Add files with mobile optimization
  for (const [key, fileValue] of Object.entries(files)) {
    if (fileValue) {
      if (Array.isArray(fileValue)) {
        const optimizedFiles = await optimizeFilesForMobile(fileValue);
        optimizedFiles.forEach((file) => {
          formData.append(key, file);
        });
      } else {
        const optimizedFiles = await optimizeFilesForMobile([fileValue]);
        formData.append(key, optimizedFiles[0]);
      }
    }
  }

  return formData;
};

// Retry function for mobile uploads
export const retryMobileUpload = async <T>(
  uploadFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // console.log(`Upload attempt ${attempt}/${maxRetries}`);
      return await uploadFn();
    } catch (error: any) {
      lastError = error;
      console.error(`Upload attempt ${attempt} failed:`, error);

      // Don't retry on certain errors
      if (error.status === 400 || error.status === 401 || error.status === 403) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1);
        // console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
};

// Get user-friendly error message for mobile uploads with debugging info
export const getMobileUploadErrorMessage = (error: any): string => {
  // Log detailed error for debugging
  console.error('Upload error details:', {
    status: error?.status,
    message: error?.message,
    data: error?.data,
    originalError: error?.originalError,
    stack: error?.stack,
  });

  if (
    error?.status === 'FETCH_ERROR' ||
    error?.message?.includes('fetch') ||
    error?.message === 'NETWORK_ERROR'
  ) {
    return 'Network connection failed. This often happens with large files on mobile networks or when the server takes too long to respond. The upload will automatically retry up to 5 times. Please ensure you have a stable internet connection.';
  }

  if (error?.status === 502 || error?.status === 504) {
    return 'Server gateway error. This usually means the server is taking too long to process your large file. Please try again - the system will automatically retry.';
  }

  if (
    error?.status === 413 ||
    error?.message?.includes('too large') ||
    error?.message?.includes('payload')
  ) {
    return 'File size exceeds the server limit. Please use a smaller file or compress your images.';
  }

  if (error?.status === 408 || error?.message?.includes('timeout')) {
    return 'Upload timed out. This can happen with very large files on slow mobile connections. Please try again when you have a faster internet connection, or try uploading smaller files.';
  }

  if (error?.status === 0) {
    return "Connection failed. This usually means there's a network connectivity issue or the server is unreachable. Please check your internet connection and try again.";
  }

  if (error?.status >= 500) {
    return 'Server error occurred during upload. Please try again in a few minutes.';
  }

  // Include more specific error information for debugging
  const errorMessage = error?.data?.message || error?.message || 'Unknown upload error';
  return `Upload failed: ${errorMessage}. The system will automatically retry. Please wait...`;
};

// Show upload progress for large files
export const showUploadProgress = (files: File[]): string => {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeGB = totalSize / (1024 * 1024 * 1024);
  const totalSizeMB = totalSize / (1024 * 1024);

  // Handle GB-sized files
  if (totalSizeGB >= 1) {
    return `Uploading ${files.length} file(s) (${totalSizeGB.toFixed(1)}GB). This will take 10-30 minutes depending on your internet speed. Please keep this page open and don't close the browser.`;
  } else if (totalSizeMB > 100) {
    return `Uploading ${files.length} file(s) (${totalSizeMB.toFixed(0)}MB). This may take 5-15 minutes on mobile networks. Please be patient...`;
  } else if (totalSizeMB > 50) {
    return `Uploading ${files.length} file(s) (${totalSizeMB.toFixed(0)}MB). This may take 2-10 minutes depending on your connection...`;
  } else if (totalSizeMB > 10) {
    return `Uploading ${files.length} file(s) (${totalSizeMB.toFixed(1)}MB). This may take several minutes on mobile networks...`;
  } else if (totalSizeMB > 5) {
    return `Uploading ${files.length} file(s) (${totalSizeMB.toFixed(1)}MB). Please wait...`;
  } else {
    return `Uploading ${files.length} file(s)...`;
  }
};
