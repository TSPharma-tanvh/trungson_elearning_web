'use client';

import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface CustomTextFieldProps {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
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
  disabled = false,
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
  const [isEmpty, setIsEmpty] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestValueRef = useRef<string>('');

  const validateInput = useCallback(
    (val: string, immediate = false): boolean => {
      let valid = true;
      let message = '';

      if (required && val.trim() === '') {
        message = t('requiredField');
        valid = false;
      } else {
        switch (inputMode) {
          case 'text':
            if (pattern && val) {
              const regex = new RegExp(pattern);
              if (!regex.test(val)) {
                message = t('invalidFormat', { patternError: patternError || '' });
                valid = false;
              }
            }
            break;
          case 'numeric':
            if (val && !/^\d*$/.test(val)) {
              message = t('numericOnly');
              valid = false;
            }
            break;
          case 'decimal':
            if (val && !/^\d*\.?\d*$/.test(val)) {
              message = t('decimalOnly');
              valid = false;
            }
            break;
          case 'tel':
            if (val && !/^[0-9+\-()\s]*$/.test(val)) {
              message = t('invalidPhone');
              valid = false;
            }
            break;
          case 'email':
            if (val && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)) {
              message = t('invalidEmail');
              valid = false;
            }
            break;
          case 'url':
            if (val) {
              try {
                new URL(val);
              } catch {
                message = t('invalidUrl');
                valid = false;
              }
            }
            break;
        }
      }

      if (immediate) {
        setError(!valid);
        setHelperText(message);
        onValidationChange?.(valid);
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setError(!valid);
          setHelperText(message);
          onValidationChange?.(valid);
        }, 200);
      }

      return valid;
    },
    [required, inputMode, pattern, patternError, t, onValidationChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    latestValueRef.current = val;
    onChange(val);

    const empty = val.trim() === '';
    setIsEmpty(empty);
    if (required && empty) {
      setError(true);
      setHelperText(t('requiredField'));
    } else if (!required || !empty) {
      setError(false);
      setHelperText('');
    }

    validateInput(val);
  };

  const handleBlur = () => {
    const val = latestValueRef.current;
    validateInput(val, true);
  };

  const getEffectiveType = () => (['numeric', 'decimal', 'tel'].includes(inputMode) ? 'text' : type || 'text');

  useEffect(() => {
    const val = String(value ?? '');
    latestValueRef.current = val;
    setIsEmpty(val.trim() === '');
    validateInput(val);
  }, [value, required, validateInput]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const shouldBeRed = required && isEmpty;

  return (
    <TextField
      label={
        <span>
          {t(label)}
          {required && <span style={{ color: 'error.main', marginLeft: 4 }}>*</span>}
        </span>
      }
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
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: shouldBeRed ? 'error.main' : 'grey.400',
          },
          '&:hover fieldset': {
            borderColor: shouldBeRed ? 'error.dark' : 'primary.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: shouldBeRed ? 'error.main' : 'primary.main',
          },
        },
        '& .MuiFormLabel-root': {
          color: shouldBeRed ? 'error.main' : 'inherit',
          '&.Mui-focused': { color: shouldBeRed ? 'error.main' : 'primary.main' },
        },
        ...sx,
      }}
    />
  );
};
