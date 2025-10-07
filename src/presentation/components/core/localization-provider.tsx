'use client';

import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import 'dayjs/locale/vi';
import 'dayjs/locale/en';

export interface LocalizationProviderProps {
  children: React.ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps): React.JSX.Element {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  return (
    <MuiLocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
      {children}
    </MuiLocalizationProvider>
  );
}
