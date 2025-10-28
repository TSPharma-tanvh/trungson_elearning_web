'use client';

import { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CustomFormControlSelectProps<T extends string | number | boolean> {
  label: string;
  value: T | '';
  onChange: (value: T) => void;
  disabled?: boolean;
  options: { value: T; label: string }[];
}

export function CustomSelectDropDown<T extends string | number | boolean>({
  label,
  value,
  onChange,
  disabled = false,
  options,
}: CustomFormControlSelectProps<T>) {
  const { t } = useTranslation();
  const [internalValue, setInternalValue] = useState<T | ''>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (event: SelectChangeEvent) => {
    const raw = event.target.value;
    let newValue: T;
    if (raw === 'true') newValue = true as T;
    else if (raw === 'false') newValue = false as T;
    else newValue = raw as T;

    setInternalValue(newValue);
    onChange(newValue);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel shrink>{t(label)}</InputLabel>
      <Select
        label={t(label)}
        value={String(internalValue)}
        onChange={handleChange}
        displayEmpty
        MenuProps={{
          PaperProps: { sx: { maxHeight: 300 } },
        }}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={String(option.value)}>
            {t(option.label)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
