'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeDistinctResponse } from '@/domain/models/employee/response/employee-distinct-response';
import { useEmployeeDistinct } from '@/presentation/hooks/employee/use-employee-distinct';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
import { Animation, Apartment, Badge, Domain, Person, School, Work } from '@mui/icons-material';
import { FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CustomEmployeeDistinctSelectProps {
  label: string;
  value?: string;
  type?: DepartmentFilterType;
  onChange?: (value?: string) => void;
  disabled?: boolean;
  maxHeight?: number;
  loadOnMount?: boolean;
}

const typeIconMap = {
  [DepartmentFilterType.Department]: Domain,
  [DepartmentFilterType.DepartmentType]: Apartment,
  [DepartmentFilterType.Position]: Work,
  [DepartmentFilterType.PositionState]: Badge,
  [DepartmentFilterType.Asm]: Person,
  [DepartmentFilterType.Status]: Animation,
};

export function CustomEmployeeDistinctSelectInForm({
  label,
  value,
  type,
  onChange,
  disabled = false,
  maxHeight = 300,
  loadOnMount = false,
}: CustomEmployeeDistinctSelectProps) {
  const { t } = useTranslation();
  const { employeeUsecase } = useDI();
  const { items, load, loaded, loading } = useEmployeeDistinct(employeeUsecase, type);

  const [localValue, setLocalValue] = useState<string | undefined>(undefined);

  /** Load data ngay khi mở form */
  useEffect(() => {
    if (loadOnMount && !loaded && !loading && type !== undefined) {
      void load();
    }
  }, [loadOnMount, loaded, loading, type, load]);

  /** Sync localValue khi data đã load */
  useEffect(() => {
    if (!loaded) return;

    if (value && items.some((x) => x.code === value)) {
      setLocalValue(value);
    } else {
      setLocalValue(undefined);
    }
  }, [loaded, items, value]);

  const handleChange = (val: string) => {
    setLocalValue(val);
    onChange?.(val || undefined);
  };

  const handleOpen = () => {
    if (!loadOnMount && !loaded && !loading && type !== undefined) {
      void load();
    }
  };

  const IconComponent = type !== undefined ? typeIconMap[type] || School : School;

  const options = [
    { value: undefined, label: t('all') },
    ...items.map((x: EmployeeDistinctResponse) => ({
      value: x.code,
      label: x.name ?? x.code ?? '',
    })),
  ];

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id={`${label}-select-label`}>{t(label)}</InputLabel>

      <Select
        labelId={`${label}-select-label`}
        value={localValue ?? ''}
        onOpen={handleOpen}
        input={<OutlinedInput label={t(label)} startAdornment={<IconComponent sx={{ mr: 1, opacity: 0.7 }} />} />}
        /** Hiển thị đúng theo trạng thái load */
        renderValue={() => {
          if (!loaded) return t('loading');

          const selected = items.find((x) => x.code === localValue);
          return selected ? `${selected.name} (${selected.code})` : t('all');
        }}
        onChange={(e) => handleChange(e.target.value)}
        MenuProps={{ PaperProps: { style: { maxHeight } } }}
      >
        {loading ? (
          <MenuItem disabled>
            <Typography variant="body2">{t('loading')}</Typography>
          </MenuItem>
        ) : (
          options.map((opt) => (
            <MenuItem key={opt.value ?? 'all'} value={opt.value ?? ''}>
              <ListItemText primary={opt.label} />
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
