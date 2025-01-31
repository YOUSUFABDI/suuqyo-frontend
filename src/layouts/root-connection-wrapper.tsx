'use client';

import { useEffect, useState } from 'react';
import { toast } from 'src/components/snackbar'; // Assuming this is your custom toast function

export function RootConnectionWrapper({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window === 'undefined') return;

    // Check localStorage for the offline status after a page refresh
    const storedOfflineStatus = localStorage.getItem('isOffline');
    const initialOfflineStatus =
      storedOfflineStatus === null ? !navigator.onLine : JSON.parse(storedOfflineStatus);
    setIsOffline(initialOfflineStatus);

    // Handle offline event
    const handleOffline = () => {
      if (!isOffline) {
        // Avoid redundant toasts
        setIsOffline(true);
        localStorage.setItem('isOffline', 'true');
        toast.error('You are offline. Please check your internet connection.');
      }
    };

    // Handle online event
    const handleOnline = () => {
      if (isOffline) {
        // Avoid redundant toasts
        setIsOffline(false);
        localStorage.setItem('isOffline', 'false');
        toast.success('You are now connected to the internet');
      }
    };

    // Listen for online/offline events
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Clean up event listeners
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [isOffline]); // Depend on isOffline to trigger updates

  return <>{children}</>;
}
