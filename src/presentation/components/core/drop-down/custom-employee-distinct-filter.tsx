'use client';

import React from 'react';
import { EmployeeDistinctResponse } from '@/domain/models/employee/response/employee-distinct-response';
import { useEmployeeDistinct } from '@/presentation/hooks/employee/use-employee-distinct';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from './custom-select-filter';

interface Props {
  label: string;
  value?: string;
  type: number;
  onChange: (value: string | undefined) => void;
  minWidth?: number;
  withAllOption?: boolean;
}

export function CustomEmployeeDistinctFilter({
  label,
  value,
  type,
  onChange,
  minWidth = 150,
  withAllOption = true,
}: Props) {
  const { t } = useTranslation();
  const { employeeUsecase } = useDI();
  const { items, loading, load, loaded } = useEmployeeDistinct(employeeUsecase, type);

  // Chỉ load khi mở dropdown lần đầu
  const handleOpen = () => {
    if (!loaded && !loading) {
      load();
    }
  };

  const options = items
    .filter((x) => x.code)
    .map((x: EmployeeDistinctResponse) => ({
      value: x.code!,
      label: x.name ?? x.code!,
    }));

  return (
    <CustomSelectFilter<string>
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      minWidth={minWidth}
      withAllOption={withAllOption}
      allLabel={t('all')}
      loading={loading}
      onOpen={handleOpen}
      isLowerCase={false}
    />
  );
}
