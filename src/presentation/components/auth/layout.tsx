'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { DynamicLogo } from '@/presentation/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        minHeight: '100vh',
      }}
    >
      {/* Left: Form Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <RouterLink href={paths.home} passHref>
            <Box sx={{ display: 'inline-block' }}>
              <DynamicLogo colorDark="light" colorLight="light" height={52} width={160} />
            </Box>
          </RouterLink>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 480 }}>{children}</Box>
        </Box>
      </Box>

      {/* Right: Background Welcome Panel */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'common.white',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.35)), url(/assets/images/sign-in.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          p: 6,
        }}
      >
        <Stack
          spacing={3}
          sx={{
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 3,
            p: 4,
            maxWidth: 620,
            width: '100%',
          }}
        >
          <Box
            component="img"
            alt="Widgets"
            src="/assets/icon/logo-white-text.svg"
            sx={{
              width: '100%',
              maxWidth: 240,
              height: 'auto',
              mx: 'auto',
            }}
          />
          <Typography color="inherit" sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
            {t('welcomeTo')}{' '}
            <Box component="span" sx={{ color: theme.palette.primary.light }}>
              Trung Son Elearning
            </Box>
          </Typography>
          <Typography align="center" variant="subtitle1" color={theme.palette.warning.dark}>
            {t('welcomeSlogan')}{' '}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
