'use client';

import { useState } from 'react';
import { IconButton, InputAdornment, Popper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarBlank, X } from '@phosphor-icons/react';
import dayjs from 'dayjs';

import 'dayjs/locale/vi';
import 'dayjs/locale/en';

import { useTranslation } from 'react-i18next';

const localeMap = {
  vi: 'vi',
  en: 'en',
};

interface CustomDateTimePickerProps {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  allowClear?: boolean;
}

const StyledPopper = styled(Popper)(({ theme }) => ({
  zIndex: 1300,
  '& .MuiPaper-root': {
    borderRadius: 12,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiPickersCalendarHeader-root': {
    paddingBottom: theme.spacing(1),
  },
  '& .MuiDayCalendar-weekDayLabel': {
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  '& .MuiPickersDay-root': {
    margin: '0 6px',
    fontWeight: 500,
  },
  '& .MuiPickersDay-today': {
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

export function CustomDateTimePicker({
  label,
  value,
  onChange,
  disabled = false,
  allowClear = false,
}: CustomDateTimePickerProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLocale = localeMap[i18n.language as keyof typeof localeMap] || 'vi';

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={currentLocale}
      localeText={{
        okButtonLabel: t('ok'),
        cancelButtonLabel: t('cancel'),
        clearButtonLabel: t('clear'),
        datePickerToolbarTitle: t('datePickerToolbarTitle'),
        timePickerToolbarTitle: t('timePickerToolbarTitle'),
        dateTimePickerToolbarTitle: t('dateTimePickerToolbarTitle'),
        dateRangePickerToolbarTitle: t('dateRangePickerToolbarTitle'),
      }}
    >
      <DateTimePicker
        label={t(label)} // Translate label
        value={value ? dayjs(value) : null}
        format="DD/MM/YYYY hh:mm A"
        onChange={(newValue) => {
          if (newValue && dayjs(newValue).isValid()) {
            onChange(dayjs(newValue).format('YYYY-MM-DDTHH:mm:ss'));
          } else {
            onChange(undefined);
          }
        }}
        disabled={disabled}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slots={{
          popper: StyledPopper,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            onClick: () => !disabled && setOpen(true),
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    edge="start"
                    disabled={disabled}
                    onClick={() => setOpen(true)}
                    aria-label={t('openCalendar')}
                  >
                    <CalendarBlank size={20} weight="fill" color={disabled ? '#9e9e9e' : '#616161'} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {allowClear && value && !disabled && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(undefined);
                      }}
                      edge="end"
                      size="small"
                      aria-label={t('clearDate')}
                    >
                      <X size={20} color="#616161" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            },
          },
          actionBar: {
            actions: allowClear ? ['cancel', 'clear', 'accept'] : ['cancel', 'accept'],
          },
        }}
        ampm
      />
    </LocalizationProvider>
  );
}
