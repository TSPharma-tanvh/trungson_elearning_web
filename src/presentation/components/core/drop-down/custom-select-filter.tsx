'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FilterSelectProps<T> {
  label: string;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  options: { value: T; label: string }[];
  size?: 'small' | 'medium';
  minWidth?: number;
  withAllOption?: boolean;
  allLabel?: string;

  loading?: boolean;
  onOpen?: () => void;
  isLowerCase?: boolean;
}

export function CustomSelectFilter<T extends string | number | boolean>({
  label,
  value,
  onChange,
  options,
  size = 'small',
  minWidth = 150,
  withAllOption = true,
  allLabel = 'all',
  loading = false,
  onOpen,
  isLowerCase = true,
}: FilterSelectProps<T>): React.JSX.Element {
  const { t } = useTranslation();

  const handleChange = (e: SelectChangeEvent) => {
    const val = e.target.value;
    if (val === '') {
      onChange(undefined);
      return;
    }

    const isBool = options.length > 0 && typeof options[0].value === 'boolean';
    const isNumber = options.length > 0 && typeof options[0].value === 'number';

    const castedValue = isBool ? val === 'true' : isNumber ? Number(val) : val;

    onChange(castedValue as T);
  };

  return (
    <FormControl
      size={size}
      sx={{
        minWidth,
        '& .MuiInputLabel-root': { color: 'var(--mui-palette-secondary-main)' },
        '& .MuiInputLabel-root.Mui-focused': { color: 'var(--mui-palette-primary-main)' },
        '& .MuiInputLabel-shrink': { color: 'var(--mui-palette-primary-main)' },
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value === undefined ? '' : value.toString()}
        onChange={handleChange}
        onOpen={onOpen}
        displayEmpty={loading}
        sx={{
          '& .MuiSelect-select': {
            backgroundColor: 'var(--mui-palette-common-white)',
            color: 'var(--mui-palette-secondary-main)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-primary-main)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-secondary-main)',
          },
        }}
      >
        {loading ? (
          <MenuItem disabled>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              {t('loading')}...
            </Box>
          </MenuItem>
        ) : null}

        {withAllOption && !loading ? (
          <MenuItem
            value=""
            sx={{
              color: 'var(--mui-palette-primary-main)',
              backgroundColor: 'var(--mui-palette-common-white)',
            }}
          >
            {t(allLabel)}
          </MenuItem>
        ) : null}

        {!loading &&
          options.map((opt) => (
            <MenuItem
              key={String(opt.value)}
              value={String(opt.value)}
              sx={{
                color: 'var(--mui-palette-primary-main)',
                backgroundColor: 'var(--mui-palette-common-white)',
              }}
            >
              {isLowerCase ? t(opt.label.charAt(0).toLowerCase() + opt.label.slice(1)) : t(opt.label)}
            </MenuItem>
          ))}

        {!loading && options.length === 0 && withAllOption ? (
          <MenuItem disabled value="">
            <em>{t('noData')}</em>
          </MenuItem>
        ) : null}
      </Select>
    </FormControl>
  );
}
