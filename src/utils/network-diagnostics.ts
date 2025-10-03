/**
 * Network diagnostics utility to help identify upload issues
 */

export interface NetworkDiagnostics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  userAgent: string;
  isOnline: boolean;
  timestamp: number;
}

export const getNetworkDiagnostics = (): NetworkDiagnostics => {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  return {
    connectionType: connection?.type || 'unknown',
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0,
    rtt: connection?.rtt || 0,
    saveData: connection?.saveData || false,
    userAgent: navigator.userAgent,
    isOnline: navigator.onLine,
    timestamp: Date.now(),
  };
};

export const logNetworkDiagnostics = (context: string) => {
  const diagnostics = getNetworkDiagnostics();
  // console.log(`[Network Diagnostics - ${context}]`, diagnostics);
  return diagnostics;
};

export const isSlowConnection = (): boolean => {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) return false;

  return (
    connection.effectiveType === '2g' ||
    connection.effectiveType === 'slow-2g' ||
    (connection.downlink && connection.downlink < 1)
  );
};

export const getRecommendedTimeout = (fileSizeBytes: number): number => {
  const fileSizeMB = fileSizeBytes / (1024 * 1024);
  const diagnostics = getNetworkDiagnostics();

  // Base timeout calculation
  let timeoutMinutes = 5; // 5 minutes base

  // Adjust based on file size
  if (fileSizeMB > 100) {
    timeoutMinutes = 30; // 30 minutes for files > 100MB
  } else if (fileSizeMB > 50) {
    timeoutMinutes = 20; // 20 minutes for files > 50MB
  } else if (fileSizeMB > 10) {
    timeoutMinutes = 10; // 10 minutes for files > 10MB
  }

  // Adjust based on connection quality
  if (diagnostics.effectiveType === '2g' || diagnostics.effectiveType === 'slow-2g') {
    timeoutMinutes *= 3; // Triple timeout for slow connections
  } else if (diagnostics.effectiveType === '3g') {
    timeoutMinutes *= 2; // Double timeout for 3G
  }

  // Cap at 60 minutes maximum
  return Math.min(timeoutMinutes * 60 * 1000, 60 * 60 * 1000);
};

export const testServerConnectivity = async (
  apiUrl: string
): Promise<{
  success: boolean;
  responseTime: number;
  error?: string;
}> => {
  const startTime = Date.now();

  try {
    // Try a simple GET request to the API root or a known endpoint
    const response = await Promise.race([
      fetch(`${apiUrl}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      ),
    ]);

    const responseTime = Date.now() - startTime;

    return {
      success: response.ok || response.status === 404, // 404 is OK, means server is reachable
      responseTime,
      error:
        response.ok || response.status === 404
          ? undefined
          : `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      responseTime,
      error: error.message || 'Network connectivity test failed',
    };
  }
};

export const diagnoseUploadIssue = async (
  error: any,
  fileSizeBytes: number,
  apiUrl: string
): Promise<string> => {
  // console.log('🔍 Diagnosing upload issue...');

  // Get network diagnostics
  const networkDiag = logNetworkDiagnostics('Upload Error');

  // Test server connectivity
  const connectivityTest = await testServerConnectivity(apiUrl);
  // console.log('🌐 Server connectivity test:', connectivityTest);

  // Analyze the issue
  let diagnosis = 'Upload Issue Diagnosis:\n\n';

  // Network analysis
  if (!networkDiag.isOnline) {
    diagnosis += '❌ Device is offline\n';
  } else if (networkDiag.effectiveType === '2g' || networkDiag.effectiveType === 'slow-2g') {
    diagnosis += '🐌 Very slow network detected (2G)\n';
  } else if (networkDiag.effectiveType === '3g') {
    diagnosis += '📶 Moderate network speed (3G)\n';
  } else {
    diagnosis += '✅ Good network speed detected\n';
  }

  // Server connectivity analysis
  if (!connectivityTest.success) {
    diagnosis += `❌ Server connectivity failed: ${connectivityTest.error}\n`;
  } else if (connectivityTest.responseTime > 5000) {
    diagnosis += `⚠️ Slow server response (${connectivityTest.responseTime}ms)\n`;
  } else {
    diagnosis += `✅ Server responding normally (${connectivityTest.responseTime}ms)\n`;
  }

  // File size analysis
  const fileSizeMB = fileSizeBytes / (1024 * 1024);
  if (fileSizeMB > 100) {
    diagnosis += `📁 Very large file (${fileSizeMB.toFixed(1)}MB) - may require stable connection\n`;
  } else if (fileSizeMB > 50) {
    diagnosis += `📁 Large file (${fileSizeMB.toFixed(1)}MB) - may take time on mobile\n`;
  }

  // Error analysis
  if (error?.status === 'FETCH_ERROR') {
    diagnosis += '🔌 Network connection interrupted during upload\n';
  } else if (error?.status === 0) {
    diagnosis += '🚫 Request blocked or server unreachable\n';
  } else if (error?.status >= 500) {
    diagnosis += '🖥️ Server error - backend processing issue\n';
  }

  // Recommendations
  diagnosis += '\n💡 Recommendations:\n';

  if (networkDiag.effectiveType === '2g' || networkDiag.effectiveType === 'slow-2g') {
    diagnosis += '• Try uploading when you have a faster connection (WiFi/4G)\n';
    diagnosis += '• Consider compressing large images before upload\n';
  }

  if (!connectivityTest.success) {
    diagnosis += '• Check if the server URL is correct and accessible\n';
    diagnosis += '• Try again in a few minutes - server may be temporarily down\n';
  }

  if (fileSizeMB > 50) {
    diagnosis += '• Keep the browser tab open during upload\n';
    diagnosis += '• Ensure stable internet connection for large files\n';
  }

  // console.log(diagnosis);
  return diagnosis;
};
