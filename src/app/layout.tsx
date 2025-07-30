// import * as React from 'react';
// import type { Viewport } from 'next';

// import '@/styles/global.css';

// import i18n from '@/i18n';
// import { UserProvider } from '@/presentation/contexts/user-context';
// import { DIProvider } from '@/presentation/hooks/use-dependency-container';
// import { getStoredLanguage } from '@/utils/app-actions';

// import { LocalizationProvider } from '@/presentation/components/core/localization-provider';
// import { CustomSnackBarProvider } from '@/presentation/components/core/snack-bar/CustomSnackBarProvider';
// import { ThemeProvider } from '@/presentation/components/core/theme-provider/theme-provider';

// // import { LocalizationProvider } from '@/presentation/components/core/localization-provider';
// // import { ThemeProvider } from '@/presentation/components/core/theme-provider/theme-provider';

// // export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

// // interface LayoutProps {
// //   children: React.ReactNode;
// // }

// // export default function Layout({ children }: LayoutProps): React.JSX.Element {
// //   return (
// //     <html lang="en">
// //       <body>
// //         <DIProvider>
// //           <CustomSnackBarProvider>
// //             <LocalizationProvider>
// //               <UserProvider>
// //                 <ThemeProvider>{children}</ThemeProvider>
// //               </UserProvider>
// //             </LocalizationProvider>
// //           </CustomSnackBarProvider>
// //         </DIProvider>
// //       </body>
// //     </html>
// //   );
// // }

// export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export default function Layout({ children }: LayoutProps): React.JSX.Element {
//   React.useEffect(() => {
//     const storedLanguage = getStoredLanguage();
//     if (storedLanguage) {
//       i18n.changeLanguage(storedLanguage);
//     }
//   }, []);

//   return (
//     <html lang="en">
//       <body>
//         <DIProvider>
//           <CustomSnackBarProvider>
//             <LocalizationProvider>
//               <UserProvider>
//                 <ThemeProvider>{children}</ThemeProvider>
//               </UserProvider>
//             </LocalizationProvider>
//           </CustomSnackBarProvider>
//         </DIProvider>
//       </body>
//     </html>
//   );
// }
'use client';

import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import i18n from '@/i18n';
import { UserProvider } from '@/presentation/contexts/user-context';
import { DIProvider } from '@/presentation/hooks/use-dependency-container';
import { getStoredLanguage } from '@/utils/app-actions';

import { LocalizationProvider } from '@/presentation/components/core/localization-provider';
import { CustomSnackBarProvider } from '@/presentation/components/core/snack-bar/CustomSnackBarProvider';
import { ThemeProvider } from '@/presentation/components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  React.useEffect(() => {
    const storedLanguage = getStoredLanguage();
    if (storedLanguage) {
      void i18n.changeLanguage(storedLanguage);
    }
  }, []);

  return (
    <html lang="vi">
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
