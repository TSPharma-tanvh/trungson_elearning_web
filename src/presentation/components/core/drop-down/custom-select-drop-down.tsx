'use client';

import { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface CustomFormControlSelectProps<T extends string | number> {
  label: string;
  value: T | '';
  onChange: (value: T) => void;
  disabled?: boolean;
  options: Array<{ value: T; label: string }>;
}

export function CustomSelectDropDown<T extends string | number>({
  label,
  value,
  onChange,
  disabled = false,
  options,
}: CustomFormControlSelectProps<T>) {
  const [internalValue, setInternalValue] = useState<T | ''>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (event: SelectChangeEvent<T>) => {
    const newValue = event.target.value as T;
    setInternalValue(newValue);
    onChange(newValue);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        label={label}
        value={internalValue}
        onChange={handleChange}
        displayEmpty
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
