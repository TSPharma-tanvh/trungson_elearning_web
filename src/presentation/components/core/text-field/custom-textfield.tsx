'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

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
  patternError?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
  onValidationChange?: (isValid: boolean) => void;
  required?: boolean;
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
  patternError,
  icon,
  sx,
  onValidationChange,
  required = false,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const validateInput = (val: string): boolean => {
    let valid = true;

    if (required && val.trim() === '') {
      setHelperText(t('requiredField'));
      setError(true);
      onValidationChange?.(false);
      return false;
    }

    switch (inputMode) {
      case 'text':
        if (pattern) {
          const regex = new RegExp(pattern);
          valid = regex.test(val);
          if (!valid) setHelperText(t('invalidFormat', { patternError }));
        }
        break;

      case 'numeric':
        valid = /^\d*$/.test(val);
        if (!valid) setHelperText(t('numericOnly'));
        break;

      case 'decimal':
        valid = /^\d*\.?\d*$/.test(val);
        if (!valid) setHelperText(t('decimalOnly'));
        break;

      case 'tel':
        valid = /^[0-9+\-()\s]*$/.test(val);
        if (!valid) setHelperText(t('invalidPhone'));
        break;

      case 'email':
        valid = val === '' || /^[\w-.]+@(?:[\w-]+\.)+[\w-]{2,4}$/.test(val);
        if (!valid) setHelperText(t('invalidEmail'));
        break;

      case 'url':
        if (val) {
          try {
            const _ = new URL(val);
          } catch {
            valid = false;
            setHelperText(t('invalidUrl'));
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

  const handleBlur = () => {
    validateInput(String(value ?? ''));
  };

  const getEffectiveType = () => {
    if (['numeric', 'decimal', 'tel'].includes(inputMode)) return 'text';
    return type || 'text';
  };

  useEffect(() => {
    validateInput(String(value ?? ''));
  }, [value, required]);

  return (
    <TextField
      label={label}
      value={value ?? ''}
      onChange={handleChange}
      onBlur={handleBlur}
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
