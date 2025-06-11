import * as React from 'react';
import type { UserContextValue } from '@/presentation/contexts/user-context';
import { UserContext } from '@/presentation/contexts/user-context';

export function useUser(): UserContextValue {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
