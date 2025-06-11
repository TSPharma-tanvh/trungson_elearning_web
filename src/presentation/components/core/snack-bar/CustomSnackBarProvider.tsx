// src/layouts/core/CustomSnackBarProvider.tsx
'use client';

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

import { registerEnqueueSnackbar } from './custom-snack-bar';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface Snack {
  message: string;
  type: SnackbarType;
  key: number;
  duration?: number;
}

interface SnackbarContextValue {
  enqueueSnackbar: (message: string, type?: SnackbarType, durationMs?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const CustomSnackBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);

  const enqueueSnackbar = useCallback((message: string, type: SnackbarType = 'info', durationMs = 3000) => {
    const key = new Date().getTime() + Math.random();
    setSnacks((prev) => [...prev, { message, type, key, duration: durationMs }]);
  }, []);

  // Register the function once provider mounts
  useEffect(() => {
    registerEnqueueSnackbar(enqueueSnackbar);
  }, [enqueueSnackbar]);

  const handleClose = (key: number) => {
    setSnacks((prev) => prev.filter((snack) => snack.key !== key));
  };

  return (
    <SnackbarContext.Provider value={{ enqueueSnackbar }}>
      {children}
      {snacks.map((snack) => (
        <Snackbar
          key={snack.key}
          open
          autoHideDuration={snack.duration}
          onClose={() => handleClose(snack.key)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => handleClose(snack.key)} severity={snack.type} sx={{ width: '100%' }}>
            {snack.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
};
