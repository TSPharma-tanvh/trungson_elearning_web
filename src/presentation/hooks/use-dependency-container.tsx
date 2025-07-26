'use client';

import React, { createContext, useContext } from 'react';
import { container } from '@/dependency-container';
import type { DependencyContainer } from '@/dependency-container';

const DIContext = createContext<DependencyContainer | null>(null);

/**
 * Wrap your app tree so that useDI() can retrieve the same container instance.
 */
export const DIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
};

/**
 * Hook to get the container.
 * Throws if used outside DIProvider.
 */
export const useDI = (): DependencyContainer => {
  const ctx = useContext(DIContext);
  if (!ctx) {
    throw new Error('useDI must be used within a DIProvider');
  }
  return ctx;
};
