'use client';

import React from 'react';
import { type EmployeeDistinctResponse } from '@/domain/models/employee/response/employee-distinct-response';
import { useEmployeeDistinct } from '@/presentation/hooks/employee/use-employee-distinct';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDownDialog } from './custom-select-drop-down-dialog';

interface CustomEmployeeDistinctProps {
  label: string;
  value?: string | undefined;
  type: number; // enum DepartmentFilterType
  onChange: (value: string | undefined) => void;
}

export function CustomEmployeeDistinctSelectFilter({ label, value, type, onChange }: CustomEmployeeDistinctProps) {
  const { t } = useTranslation();
  const { employeeUsecase } = useDI();
  const { items } = useEmployeeDistinct(employeeUsecase, type);

  const options = items.map((x: EmployeeDistinctResponse) => ({
    value: x.code,
    label: x.name ?? x.code ?? '',
  }));

  return (
    <CustomSelectDropDownDialog
      label={label}
      value={value}
      options={[{ value: undefined, label: t('all') }, ...options]}
      onChange={onChange}
    />
  );
}
