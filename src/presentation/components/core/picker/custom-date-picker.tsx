'use client';

import { InputAdornment, Popper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Calendar } from '@phosphor-icons/react';
import dayjs from 'dayjs';

interface CustomDateTimePickerProps {
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

export function CustomDateTimePicker({ label, value, onChange, disabled = false }: CustomDateTimePickerProps) {
  return (
    <DateTimePicker
      label={label}
      value={value ? dayjs(value) : null}
      format="DD/MM/YYYY hh:mm A"
      onChange={(newValue) => {
        onChange(newValue ? dayjs(newValue).format('YYYY-MM-DDTHH:mm:ss') : '');
      }}
      disabled={disabled}
      slots={{
        popper: StyledPopper,
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          InputProps: {
            startAdornment: (
              <InputAdornment position="start">
                <Calendar size={20} weight="fill" color="#616161" />
              </InputAdornment>
            ),
          },
        },
      }}
      ampm
    />
  );
}
