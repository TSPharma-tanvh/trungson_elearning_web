'use client';

import * as React from 'react';
import { GetAttendanceRecordsRequest } from '@/domain/models/attendance/request/get-attendance-records-request';
import { type ClassUsecase } from '@/domain/usecases/class/class-usecase';
import { type EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { CategoryEnum, CheckinTimeEnum, CoreEnumUtils } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';
import { ClassSingleFilter } from '@/presentation/components/shared/classes/class/class-single-filter';
import { EnrollmentSingleFilter } from '@/presentation/components/shared/enrollment/enrollment-single-filter';

export function AttendanceRecordsFilters({
  onFilter,
  classUsecase,
  enrollUsecase,
  form,
  handleChange,
}: {
  onFilter: (filters: GetAttendanceRecordsRequest) => void;
  classUsecase: ClassUsecase;
  enrollUsecase: EnrollmentUsecase;
  form: GetAttendanceRecordsRequest;
  handleChange: (field: string, value: string) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<CheckinTimeEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetAttendanceRecordsRequest({
      ...form,
      searchText: searchText || undefined,
      status,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus(undefined);
    onFilter(new GetAttendanceRecordsRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder={t('searchAttendance')} />

        {/* Status */}
        <CustomSelectFilter<CheckinTimeEnum>
          label={t('status')}
          value={status}
          onChange={(val) => {
            setStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(CheckinTimeEnum)}
        />

        {/* Class */}
        <ClassSingleFilter
          classUsecase={classUsecase}
          value={form.classID ?? ''}
          onChange={(value) => {
            handleChange('classID', value);
          }}
          disabled={false}
          // maxWidth={160}
        />

        {/* Enrollment Criteria */}
        <EnrollmentSingleFilter
          enrollmentUsecase={enrollUsecase}
          value={form.enrollmentCriteriaId ?? ''}
          onChange={(value: string) => {
            handleChange('enrollmentCriteriaId', value);
          }}
          disabled={false}
          categoryEnum={CategoryEnum.Class}
          maxWidth={160}
        />

        <Button
          variant="contained"
          size="small"
          onClick={handleFilter}
          sx={{
            backgroundColor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-common-white)',
            borderRadius: '12px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'var(--mui-palette-secondary-main)',
            },
          }}
        >
          {t('filter')}
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={handleClear}
          sx={{
            color: 'var(--mui-palette-primary-main)',
            borderColor: 'var(--mui-palette-primary-main)',
            borderRadius: '12px',
            textTransform: 'none',
            '&:hover': {
              borderColor: 'var(--mui-palette-secondary-main)',
              color: 'var(--mui-palette-secondary-main)',
            },
          }}
        >
          {t('clear')}
        </Button>
      </Stack>
    </Card>
  );
}
