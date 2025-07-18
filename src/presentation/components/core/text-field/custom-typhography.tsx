import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface CustomFieldTypographyProps extends Omit<TypographyProps, 'children'> {
  value?: string | number | boolean | null;
  fallback?: string;
  children?: React.ReactNode;
}

export default function CustomFieldTypography({
  value,
  fallback = '-',
  children,
  ...typographyProps
}: CustomFieldTypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      {...typographyProps}
      sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
    >
      {children ?? (value != null ? String(value) : fallback)}
    </Typography>
  );
}
