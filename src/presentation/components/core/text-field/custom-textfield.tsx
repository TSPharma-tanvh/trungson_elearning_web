'use client';

import { InputAdornment, TextField } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles'; // Import SxProps and Theme

interface CustomTextFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  disabled,
  multiline = false,
  rows,
  type = 'text',
  icon,
  sx,
}) => (
  <TextField
    label={label}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    disabled={disabled}
    multiline={multiline}
    rows={rows}
    type={type}
    InputLabelProps={{ shrink: true }}
    InputProps={{
      startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : undefined,
    }}
    sx={sx}
  />
);
