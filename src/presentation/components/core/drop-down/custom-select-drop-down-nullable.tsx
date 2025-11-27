'use client';

import { FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CustomFormControlSelectNullableProps<T> {
  label: string;
  value: T | '' | null | undefined;
  onChange: (value: T | null) => void;
  disabled?: boolean;
  options: { value: T | null; label: string }[];
  isRequired?: boolean;
  allowEmpty?: boolean;
}

export function CustomSelectDropDownNullable<T>({
  label,
  value,
  onChange,
  disabled = false,
  options,
  isRequired = false,
  allowEmpty = true,
}: CustomFormControlSelectNullableProps<T>) {
  const { t } = useTranslation();

  const displayValue = value === null ? '' : String(value);

  const handleChange = (event: SelectChangeEvent) => {
    const raw = event.target.value;

    if (raw === '' || raw === 'null') {
      onChange(null);
      return;
    }

    const matchedOption = options.find((opt) => String(opt.value) === raw);
    if (matchedOption) {
      onChange(matchedOption.value as T);
    }
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel shrink>
        {t(label)}
        {isRequired ? <span style={{ color: 'error.main' }}> *</span> : null}
      </InputLabel>
      <Select value={displayValue} label={t(label)} onChange={handleChange} displayEmpty={allowEmpty}>
        {allowEmpty ? <MenuItem value="">{t('all')}</MenuItem> : null}
        {options.map((option) => (
          <MenuItem key={String(option.value ?? '')} value={String(option.value ?? '')}>
            {t(option.label)}
          </MenuItem>
        ))}
      </Select>
      {isRequired && !value ? <FormHelperText error>{t('thisFieldIsRequired')}</FormHelperText> : null}
    </FormControl>
  );
}
