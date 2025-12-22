/**
 * Toast Configuration Utility
 * Provides consistent toast styling and behavior across the application
 */

import toast from 'react-hot-toast';

/**
 * Toast configuration options
 */
export const toastConfig = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: 'rgba(30, 41, 59, 0.95)',
    color: '#fff',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '0.75rem',
    padding: '1rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
  },
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
    style: {
      background: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
    style: {
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
  },
  loading: {
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#fff',
    },
    style: {
      background: 'rgba(59, 130, 246, 0.15)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
  },
};

/**
 * Success toast with consistent styling
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...toastConfig.success,
    ...options,
  });
};

/**
 * Error toast with consistent styling
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...toastConfig.error,
    duration: 5000, // Longer duration for errors
    ...options,
  });
};

/**
 * Loading toast with consistent styling
 * Returns a toast ID that can be used with toast.dismiss()
 */
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    ...toastConfig.loading,
    ...options,
  });
};

/**
 * Promise toast - automatically shows loading, then success/error
 */
export const showPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'An error occurred',
    },
    toastConfig
  );
};

/**
 * Toast with action button
 */
export const showToastWithAction = (message, action) => {
  return toast(
    (t) => (
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button
          onClick={() => {
            action();
            toast.dismiss(t.id);
          }}
          className="px-3 py-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {action.label || 'Action'}
        </button>
      </div>
    ),
    {
      ...toastConfig,
      duration: 6000, // Longer duration for action toasts
    }
  );
};

export default toast;

