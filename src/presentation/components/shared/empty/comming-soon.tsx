'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Timer } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

export const ComingSoonPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        px: 2,
        py: 4,
        minHeight: 'calc(100vh - 30vh)',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      {/* Icon Timer lấp lánh */}
      <Box
        sx={{
          mb: 2,
          animation: 'glow 3s ease-in-out infinite',
        }}
      >
        <Timer size={128} weight="fill" color="var(--mui-palette-primary-main)" />
      </Box>

      {/* Text */}
      <Typography
        variant="h2"
        fontWeight="bold"
        sx={{
          mb: 3,
          background: `linear-gradient(90deg, var(--mui-palette-primary-main), var(--mui-palette-secondary-main))`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '3rem', md: '4rem' },
          userSelect: 'none',
        }}
      >
        {t('comingSoon')}
      </Typography>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mb: 1,
          background: `linear-gradient(90deg, var(--mui-palette-primary-main), var(--mui-palette-secondary-main))`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {t('comingSoonTitle')}
      </Typography>
      <Typography variant="body1" maxWidth={500}>
        {t('comingSoonDescription')}
      </Typography>
    </Box>
  );
};
