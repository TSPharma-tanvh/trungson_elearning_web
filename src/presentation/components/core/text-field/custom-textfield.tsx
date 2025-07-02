'use client';

import React, { useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomTextFieldProps {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
  pattern?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
  onValidationChange?: (isValid: boolean) => void;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  disabled,
  multiline = false,
  rows,
  type,
  inputMode = 'text',
  pattern,
  icon,
  sx,
  onValidationChange,
}) => {
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const validateInput = (val: string): boolean => {
    let valid = true;
    switch (inputMode) {
      case 'numeric':
        valid = /^\d*$/.test(val);
        if (!valid) setHelperText('Chỉ được nhập số');
        break;
      case 'decimal':
        valid = /^\d*\.?\d*$/.test(val);
        if (!valid) setHelperText('Chỉ được nhập số thực');
        break;
      case 'tel':
        valid = /^[0-9+\-()\s]*$/.test(val);
        if (!valid) setHelperText('Số điện thoại không hợp lệ');
        break;
      case 'email':
        valid = val === '' || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
        if (!valid) setHelperText('Email không hợp lệ');
        break;
      case 'url':
        if (val) {
          try {
            new URL(val);
          } catch {
            valid = false;
            setHelperText('URL không hợp lệ');
          }
        }
        break;
    }
    if (valid) setHelperText('');
    setError(!valid);
    onValidationChange?.(valid);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    validateInput(val);
    onChange(val);
  };

  const getEffectiveType = () => {
    if (['numeric', 'decimal', 'tel'].includes(inputMode)) return 'text';
    return type || 'text';
  };

  return (
    <TextField
      label={label}
      value={value ?? ''}
      onChange={handleChange}
      fullWidth
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      type={getEffectiveType()}
      error={error}
      helperText={helperText}
      inputProps={{ inputMode, pattern }}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : undefined,
      }}
      sx={sx}
    />
  );
};
