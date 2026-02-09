/**
 * Centralized Error Handling System
 * Provides consistent error handling and user-friendly messages
 */

import { showToast } from '@/components/ui/Toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  CLIENT = 'CLIENT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

// User-friendly error messages
const ERROR_MESSAGES: Record<string, string> = {
  // Network errors
  [ErrorType.NETWORK]: 'Unable to connect. Please check your internet connection and try again.',
  FETCH_FAILED: 'Failed to load data. Please refresh the page.',
  TIMEOUT: 'Request timed out. Please try again.',

  // Validation errors
  [ErrorType.VALIDATION]: 'Please check your input and try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  REQUIRED_FIELD: 'This field is required.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image (PNG, JPG, or GIF).',

  // Auth errors
  [ErrorType.AUTHENTICATION]: 'Please sign in to continue.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',

  // Authorization errors
  [ErrorType.AUTHORIZATION]: 'You don\'t have permission to perform this action.',
  FORBIDDEN: 'Access denied. Contact your administrator for access.',

  // Not found errors
  [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
  PAGE_NOT_FOUND: 'Page not found. Please check the URL.',

  // Server errors
  [ErrorType.SERVER]: 'Something went wrong on our end. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again in a few minutes.',

  // Storage errors
  STORAGE_FULL: 'Storage is full. Please delete some items and try again.',
  STORAGE_ACCESS_DENIED: 'Unable to access storage. Please check your browser settings.',

  // Generic
  [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: Error | AppError | unknown): string {
  if (error instanceof AppError && error.userMessage) {
    return error.userMessage;
  }

  if (error instanceof AppError && error.code) {
    return ERROR_MESSAGES[error.code] || ERROR_MESSAGES[ErrorType.UNKNOWN];
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return ERROR_MESSAGES[ErrorType.NETWORK];
    }

    // Permission errors
    if (error.message.includes('permission') || error.message.includes('denied')) {
      return ERROR_MESSAGES[ErrorType.AUTHORIZATION];
    }

    // Return sanitized error message for development
    if (process.env.NODE_ENV === 'development') {
      return error.message;
    }
  }

  return ERROR_MESSAGES[ErrorType.UNKNOWN];
}

/**
 * Handle error and show appropriate UI feedback
 */
export function handleError(
  error: Error | AppError | unknown,
  options?: {
    showToast?: boolean;
    log?: boolean;
    throwError?: boolean;
    context?: string;
  }
) {
  const {
    showToast: shouldShowToast = true,
    log: shouldLog = true,
    throwError: shouldThrow = false,
    context = '',
  } = options || {};

  const userMessage = getUserMessage(error);

  // Log error
  if (shouldLog) {
    const errorLog = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
    };

    console.error('[Error Handler]', errorLog);

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorLog });
    }
  }

  // Show toast notification
  if (shouldShowToast) {
    showToast(userMessage, 'error');
  }

  // Re-throw if needed
  if (shouldThrow) {
    throw error;
  }

  return userMessage;
}

/**
 * Async function wrapper with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    errorMessage?: string;
    successMessage?: string;
    context?: string;
  }
): Promise<T | null> {
  try {
    const result = await fn();

    if (options?.successMessage) {
      showToast(options.successMessage, 'success');
    }

    return result;
  } catch (error) {
    handleError(error, {
      context: options?.context,
      showToast: true,
    });
    return null;
  }
}

/**
 * Validate and handle localStorage operations
 */
export const safeLocalStorage = {
  getItem: (key: string, fallback: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      handleError(error, {
        context: `localStorage.getItem(${key})`,
        showToast: false,
      });
      return fallback;
    }
  },

  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      // Likely quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        handleError(new AppError(
          'Storage quota exceeded',
          'STORAGE_FULL',
          undefined,
          ERROR_MESSAGES.STORAGE_FULL
        ));
      } else {
        handleError(error, {
          context: `localStorage.setItem(${key})`,
        });
      }
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      handleError(error, {
        context: `localStorage.removeItem(${key})`,
        showToast: false,
      });
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      handleError(error, {
        context: 'localStorage.clear()',
      });
      return false;
    }
  },
};

/**
 * Retry failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoff?: boolean;
    onRetry?: (attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    onRetry,
  } = options;

  let lastError: Error | unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        onRetry?.(attempt + 1);

        // Calculate delay with exponential backoff
        const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}
