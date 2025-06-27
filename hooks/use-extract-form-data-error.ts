"use client";

import { useState, useCallback } from "react";

interface ExtractFormDataError {
  message: string;
  timestamp: Date;
  details?: any;
}

/**
 * Custom hook to manage extraction errors for SmartInput component
 * Provides functions to set, clear, and log errors with timestamp tracking
 */
export function useExtractFormDataError() {
  const [error, setError] = useState<ExtractFormDataError | null>(null);

  /**
   * Set a new error with timestamp
   */
  const setErrorMessage = useCallback((message: string, details?: any) => {
    const errorObj: ExtractFormDataError = {
      message,
      timestamp: new Date(),
      details
    };
    
    setError(errorObj);
    
    // Log error for debugging purposes
    console.error(`[ExtractFormData Error] ${message}`, {
      timestamp: errorObj.timestamp.toISOString(),
      details
    });
  }, []);

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Log error details without setting the error state
   */
  const logError = useCallback((message: string, details?: any) => {
    console.error(`[ExtractFormData Log] ${message}`, {
      timestamp: new Date().toISOString(),
      details
    });
  }, []);

  /**
   * Check if there's currently an error
   */
  const hasError = error !== null;

  /**
   * Get error message or null
   */
  const errorMessage = error?.message || null;

  /**
   * Get full error object
   */
  const errorDetails = error;

  return {
    error: errorMessage,
    errorDetails,
    hasError,
    setError: setErrorMessage,
    clearError,
    logError
  };
} 