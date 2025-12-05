import { useState } from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CustomSelectDropDownListMultipleProps<T> {
  label: string;
  value: T[] | null;
  onChange: (value: T[] | null) => void;
  disabled?: boolean;
  options: { value: T | null; label: string }[];
  isRequired?: boolean;
  onOpen?: () => void;
}

export function CustomSelectDropDownListMultiple<T>({
  label,
  value,
  onChange,
  disabled = false,
  options,
  isRequired = false,
  onOpen,
}: CustomSelectDropDownListMultipleProps<T>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const displayValue = value?.map((v) => (v === null ? '' : String(v))) ?? [];

  const handleChange = (event: SelectChangeEvent<any>) => {
    const raw = event.target.value as string[];

    let mapped: T[] | null = null;
    if (raw.includes('')) {
      mapped = null;
    } else {
      mapped = raw.map((x) => options.find((opt) => String(opt.value ?? '') === String(x))!.value!);
    }

    onChange(mapped);

    setOpen(false);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel shrink>{t(label)}</InputLabel>
      <Select
        multiple
        value={displayValue}
        onChange={handleChange}
        onOpen={() => {
          if (onOpen) onOpen();
          setOpen(true);
        }}
        open={open}
        onClose={() => setOpen(false)}
        input={<OutlinedInput label={t(label)} />}
        displayEmpty
        renderValue={(selected) => {
          if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return <span style={{ color: '#aaa' }}>{t('select')}</span>;
          }
          return (selected as string[]).map((v) => options.find((o) => String(o.value ?? '') === v)?.label).join(', ');
        }}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value ?? '')} value={String(option.value ?? '')}>
            {t(option.label)}
          </MenuItem>
        ))}
      </Select>
      {isRequired && (!value || value.length === 0) && (
        <FormHelperText error>{t('thisFieldIsRequired')}</FormHelperText>
      )}
    </FormControl>
  );
}
