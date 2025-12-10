'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface AuthNotification {
  message: string;
  show: boolean;
}

export default function AuthNotificationHandler() {
  const [notification, setNotification] = useState<AuthNotification>({
    message: '',
    show: false,
  });

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      setNotification({
        message: customEvent.detail.message,
        show: true,
      });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const handleClose = () => {
    setNotification({ ...notification, show: false });
  };

  if (!notification.show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
              Session Expired
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              {notification.message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
