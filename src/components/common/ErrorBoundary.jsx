// src/components/common/ErrorBoundary.jsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import React from 'react';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="mt-2">
        {error.message || 'An unexpected error occurred'}
      </AlertDescription>
      <Button
        variant="outline"
        size="sm"
        onClick={resetErrorBoundary}
        className="mt-4"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try again
      </Button>
    </Alert>
  );
};

// Usage:
// import { ErrorBoundary } from 'react-error-boundary';
// 
// <ErrorBoundary FallbackComponent={ErrorFallback}>
//   <YourComponent />
// </ErrorBoundary>