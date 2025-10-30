// src/presentation/components/core/drop-down/custom-select-drop-down-dialog.tsx
'use client';

import React from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CustomSelectDropDownDialogProps<T> {
  label: string;
  value: T | undefined;
  options: Array<{ value: T | undefined; label: string }>; // ← Cho phép undefined
  onChange: (value: T | undefined) => void;
  minWidth?: number;
}

export function CustomSelectDropDownDialog<T extends string | number | boolean>({
  label,
  value,
  options,
  onChange,
  minWidth = 120,
}: CustomSelectDropDownDialogProps<T>) {
  const { t } = useTranslation();

  const handleChange = (e: SelectChangeEvent<string>) => {
    const rawValue = e.target.value;

    // XỬ LÝ "All" → undefined
    if (rawValue === '') {
      onChange(undefined);
      return;
    }

    // XỬ LÝ boolean
    if (rawValue === 'true') {
      onChange(true as T);
      return;
    }
    if (rawValue === 'false') {
      onChange(false as T);
      return;
    }

    // XỬ LÝ number
    const num = Number(rawValue);
    if (!isNaN(num) && rawValue.trim() !== '') {
      onChange(num as T);
      return;
    }

    // XỬ LÝ string
    onChange(rawValue as T);
  };

  return (
    <FormControl size="small" sx={{ minWidth }}>
      <InputLabel>{t(label)}</InputLabel>
      <Select
        value={value === undefined ? '' : String(value)}
        onChange={handleChange}
        input={<OutlinedInput label={t(label)} />}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value === undefined ? 'all' : String(opt.value)}
            value={opt.value === undefined ? '' : String(opt.value)} // ← DÙNG '' CHO undefined
          >
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
