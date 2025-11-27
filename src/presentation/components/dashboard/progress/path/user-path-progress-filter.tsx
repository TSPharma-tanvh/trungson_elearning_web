'use client';

import * as React from 'react';
import { GetUserPathProgressRequest } from '@/domain/models/user-path/request/get-user-path-progress-request';
import { type EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { type PathUsecase } from '@/domain/usecases/path/path-usecase';
import { CategoryEnum, CoreEnumUtils, UserProgressEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';
import { PathSingleFilter } from '@/presentation/components/shared/courses/path/path-single-filter';
import { EnrollmentSingleFilter } from '@/presentation/components/shared/enrollment/enrollment-single-filter';

export function UserPathProgressFilters({
  onFilter,
  pathUsecase,
  enrollUsecase,
}: {
  onFilter: (filters: GetUserPathProgressRequest) => void;
  pathUsecase: PathUsecase;
  enrollUsecase: EnrollmentUsecase;
}): React.JSX.Element {
  const { t } = useTranslation();

  // Gom form state vào 1 object
  const [form, setForm] = React.useState<Partial<GetUserPathProgressRequest>>({
    searchText: '',
    status: undefined,
    pathID: undefined,
  });

  const handleChange = <K extends keyof GetUserPathProgressRequest>(key: K, value: GetUserPathProgressRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilter = () => {
    const request = new GetUserPathProgressRequest({
      ...form,
      pageNumber: 1,
      pageSize: 10,
    });
    onFilter(request);
  };

  const handleClear = () => {
    setForm({
      searchText: '',
      status: undefined,
      pathID: undefined,
    });
    onFilter(new GetUserPathProgressRequest({ pageNumber: 1, pageSize: 10 }));
  };

  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: 'var(--mui-palette-common-white)',
        color: 'var(--mui-palette-primary-main)',
        border: '1px solid var(--mui-palette-primary-main)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        {/* Search */}
        <CustomSearchFilter
          value={form.searchText ?? ''}
          onChange={(val) => {
            handleChange('searchText', val);
          }}
          onEnter={() => {
            handleFilter();
          }}
          placeholder={t('searchProgress')}
        />

        {/* Status */}
        <CustomSelectFilter<string>
          label={t('status')}
          value={form.status}
          onChange={(val) => {
            handleChange('status', val);
          }}
          options={CoreEnumUtils.getEnumOptions(UserProgressEnum).map((opt) => ({
            value: opt.label,
            label: opt.label,
          }))}
        />

        {/* Path */}
        <PathSingleFilter
          pathUsecase={pathUsecase}
          value={form.pathID ?? ''}
          onChange={(value: string) => {
            handleChange('pathID', value);
          }}
          disabled={false}
        />

        {/* Enrollment Criteria */}
        <EnrollmentSingleFilter
          enrollmentUsecase={enrollUsecase}
          value={form.enrollmentCriteriaId ?? ''}
          onChange={(value: string) => {
            handleChange('enrollmentCriteriaId', value);
          }}
          disabled={false}
          categoryEnum={CategoryEnum.Path}
        />

        <Button variant="contained" color="primary" size="small" onClick={handleFilter}>
          {t('filter')}
        </Button>
        <Button variant="outlined" color="secondary" size="small" onClick={handleClear}>
          {t('clear')}
        </Button>
      </Stack>
    </Card>
  );
}
