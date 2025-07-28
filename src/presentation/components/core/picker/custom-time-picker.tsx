'use client';

import { InputAdornment, Popper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Clock } from '@phosphor-icons/react';
import dayjs from 'dayjs';

interface CustomTimePickerProps {
  label: string;
  value: string | undefined; // expected format: 'HH:mm:ss' -- Hour format
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

    '& .MuiDateCalendar-root': {
      display: 'none',
    },
    '& .MuiMultiSectionDigitalClock-root': {
      height: 'auto',
    },
  },
}));

export function CustomTimePicker({ label, value, onChange, disabled = false }: CustomTimePickerProps) {
  return (
    <DateTimePicker
      label={label}
      value={value ? dayjs(value, 'HH:mm:ss') : null}
      onChange={(newValue) => {
        if (newValue?.isValid()) {
          onChange(newValue.format('HH:mm:ss'));
        }
      }}
      views={['hours', 'minutes', 'seconds']}
      format="HH:mm:ss"
      ampm={false}
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
                <Clock size={20} weight="fill" color="#616161" />
              </InputAdornment>
            ),
          },
        },
      }}
    />
  );
}
