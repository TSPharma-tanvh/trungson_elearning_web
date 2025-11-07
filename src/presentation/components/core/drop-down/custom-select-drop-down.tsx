'use client';

import { useEffect, useState } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CustomFormControlSelectProps<T extends string | number | boolean> {
  label: string;
  value: T | '';
  onChange: (value: T) => void;
  disabled?: boolean;
  options: { value: T; label: string }[];
  isRequired?: boolean;
}

export function CustomSelectDropDown<T extends string | number | boolean>({
  label,
  value,
  onChange,
  disabled = false,
  options,
  isRequired = false,
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
    else if (!isNaN(Number(raw))) newValue = Number(raw) as T;
    else newValue = raw as T;

    setInternalValue(newValue);
    onChange(newValue);
  };
  const borderColor = isRequired ? 'error.main' : 'grey.400';

  return (
    <FormControl
      fullWidth
      disabled={disabled}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: borderColor,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: isRequired ? 'error.dark' : 'primary.main',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: isRequired ? 'error.main' : 'primary.main',
        },
      }}
    >
      <InputLabel shrink sx={{ color: isRequired ? 'error.main' : 'inherit' }}>
        {t(label)}
        {isRequired && <span style={{ color: 'error.main' }}> *</span>}
      </InputLabel>
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

      {isRequired && internalValue === '' && <FormHelperText error>{t('thisFieldIsRequired')}</FormHelperText>}
    </FormControl>
  );
}
