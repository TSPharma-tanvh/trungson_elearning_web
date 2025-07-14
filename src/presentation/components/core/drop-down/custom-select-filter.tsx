'use client';

import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface FilterSelectProps<T> {
  label: string;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  options: { value: T; label: string }[];
  size?: 'small' | 'medium';
  minWidth?: number;
  withAllOption?: boolean;
  allLabel?: string;
}

export function CustomSelectFilter<T extends string | number | boolean>({
  label,
  value,
  onChange,
  options,
  size = 'small',
  minWidth = 150,
  withAllOption = true,
  allLabel = 'All',
}: FilterSelectProps<T>): React.JSX.Element {
  const handleChange = (e: SelectChangeEvent<string>) => {
    const val = e.target.value;
    if (val === '') return onChange(undefined);

    const isBool = typeof options[0].value === 'boolean';
    const isNumber = typeof options[0].value === 'number';

    const castedValue = isBool ? (val === 'true' ? true : false) : isNumber ? Number(val) : val;

    onChange(castedValue as T);
  };

  return (
    <FormControl
      size={size}
      sx={{
        minWidth,
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
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value === undefined ? '' : value.toString()}
        onChange={handleChange}
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
        {withAllOption && (
          <MenuItem value="">
            <span style={{ color: 'var(--mui-palette-primary-main)' }}>{allLabel}</span>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem
            key={String(opt.value)}
            value={String(opt.value)}
            style={{
              color: 'var(--mui-palette-primary-main)',
              backgroundColor: 'var(--mui-palette-common-white)',
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
