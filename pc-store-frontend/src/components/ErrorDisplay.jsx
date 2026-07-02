// src/components/ErrorDisplay.jsx
import React from 'react';
import { Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const ErrorDisplay = ({ error, onRetry, className = '' }) => {
  if (!error) return null;

  const getErrorTitle = (code) => {
    const titles = {
      'NETWORK_ERROR': 'Connection Error',
      'VALIDATION_ERROR': 'Validation Error',
      'UNAUTHORIZED': 'Authentication Required',
      'FORBIDDEN': 'Access Denied',
      'NOT_FOUND': 'Not Found',
      'SERVER_ERROR': 'Server Error',
      'INSUFFICIENT_STOCK': 'Insufficient Stock',
    };
    return titles[code] || 'Error';
  };

  return (
    <Alert 
      severity="error" 
      className={className}
      action={
        onRetry && (
          <Button 
            color="inherit" 
            size="small" 
            startIcon={<Refresh />}
            onClick={onRetry}
          >
            Retry
          </Button>
        )
      }
    >
      <strong>{getErrorTitle(error.code)}</strong>
      <div>{error.message}</div>
      {error.details && Object.keys(error.details).length > 0 && (
        <div style={{ marginTop: '8px', fontSize: '0.9em' }}>
          {Object.entries(error.details).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
            </div>
          ))}
        </div>
      )}
    </Alert>
  );
};

export default ErrorDisplay;