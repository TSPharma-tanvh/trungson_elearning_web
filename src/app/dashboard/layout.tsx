'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AuthGuard } from '@/presentation/components/auth/auth-guard';
import { MainNav } from '@/presentation/components/layout/main-nav';
import { SideNav } from '@/presentation/components/layout/side-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const [isSideNavOpen, setIsSideNavOpen] = React.useState(true);

  const toggleSideNav = () => {
    setIsSideNavOpen((prev) => !prev);
  };

  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
            '--SideNav-closed-padding': '16px',
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav isOpen={isSideNavOpen} />
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: { lg: isSideNavOpen ? 'var(--SideNav-width)' : 0 },
            transition: 'padding-left 0.3s ease-in-out',
          }}
        >
          <MainNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} />
          <main>
            <Container
              maxWidth={isSideNavOpen ? 'xl' : false}
              sx={{
                py: '64px',
                transition: 'max-width 0.3s ease-in-out',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  p: { lg: isSideNavOpen ? 0 : 'var(--SideNav-closed-padding)' },
                  transition: 'padding 0.3s ease-in-out',
                }}
              >
                {children}
              </Box>
            </Container>
          </main>
        </Box>
      </Box>
    </AuthGuard>
  );
}
