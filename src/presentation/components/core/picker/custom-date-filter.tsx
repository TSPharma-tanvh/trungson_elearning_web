'use client';

import { InputAdornment, Popper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Calendar } from '@phosphor-icons/react';
import dayjs from 'dayjs';

interface CustomDateTimeFilterProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
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
export function CustomDateTimeFilter({ label, value, onChange, disabled = false }: CustomDateTimeFilterProps) {
  return (
    <DateTimePicker
      label={label}
      value={value ? dayjs(value) : null}
      format="DD/MM/YYYY hh:mm A"
      onChange={(newValue) => onChange(newValue ? dayjs(newValue).format('YYYY-MM-DDTHH:mm:ss') : '')}
      disabled={disabled}
      ampm
      slots={{
        popper: StyledPopper,
      }}
      slotProps={{
        textField: {
          fullWidth: false,
          variant: 'outlined',
          InputLabelProps: {
            shrink: true,
          },
          InputProps: {
            startAdornment: (
              <InputAdornment position="start">
                <Calendar size={20} weight="fill" color="#616161" />
              </InputAdornment>
            ),
            sx: {
              height: 40,
              paddingRight: 1,
              backgroundColor: 'var(--mui-palette-common-white)',
              color: 'var(--mui-palette-secondary-main)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--mui-palette-primary-main)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--mui-palette-secondary-main)',
              },
            },
          },
          sx: {
            minWidth: 240,
            '& .MuiInputLabel-root': {
              color: 'var(--mui-palette-secondary-main)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'var(--mui-palette-primary-main)',
            },
            '& .MuiInputLabel-shrink': {
              color: 'var(--mui-palette-primary-main)',
            },
            '& .MuiInputLabel-shrink.Mui-focused': {
              color: 'var(--mui-palette-secondary-main)',
            },
          },
        },
      }}
    />
  );
}
