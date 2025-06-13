import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/presentation/contexts/user-context';
import { DIProvider } from '@/presentation/hooks/useDependencyContainer';

import { LocalizationProvider } from '@/presentation/components/core/localization-provider';
import { CustomSnackBarProvider } from '@/presentation/components/core/snack-bar/CustomSnackBarProvider';
import { ThemeProvider } from '@/presentation/components/core/theme-provider/theme-provider';

// import { LocalizationProvider } from '@/presentation/components/core/localization-provider';
// import { ThemeProvider } from '@/presentation/components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <DIProvider>
          <CustomSnackBarProvider>
            <LocalizationProvider>
              <UserProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </UserProvider>
            </LocalizationProvider>
          </CustomSnackBarProvider>
        </DIProvider>
      </body>
    </html>
  );
}
