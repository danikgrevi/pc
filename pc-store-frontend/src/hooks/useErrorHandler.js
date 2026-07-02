// src/hooks/useErrorHandler.js
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleError = useCallback((error, defaultMessage = 'Something went wrong') => {
    console.error('API Error:', error);
    
    const errorMessage = error?.error?.message || error?.message || defaultMessage;
    const errorCode = error?.error?.code;

    // Показываем toast уведомление
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setError({
      message: errorMessage,
      code: errorCode,
      details: error?.error?.details || {},
    });

    return error;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeWithErrorHandling = useCallback(async (asyncFunction, options = {}) => {
    const { 
      loading: showLoading = true, 
      successMessage = null,
      errorMessage = null 
    } = options;

    try {
      if (showLoading) setLoading(true);
      clearError();

      const result = await asyncFunction();
      
      if (successMessage) {
        toast.success(successMessage);
      }

      return result;
    } catch (error) {
      handleError(error, errorMessage);
      throw error;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [handleError, clearError]);

  return {
    error,
    loading,
    handleError,
    clearError,
    executeWithErrorHandling,
  };
};

export default useErrorHandler;