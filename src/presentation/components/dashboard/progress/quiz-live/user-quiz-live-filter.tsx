'use client';

import * as React from 'react';
import { GetUserQuizLiveStatusRequest } from '@/domain/models/user-quiz/request/get-user-quiz-live-status-request';
import { type EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { type QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { CategoryEnum, CoreEnumUtils, StatusEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';
import { EnrollmentSingleFilter } from '@/presentation/components/shared/enrollment/enrollment-single-filter';
import { QuizSingleFilter } from '@/presentation/components/shared/quiz/quiz/quiz-single-filter';

export function UserQuizLiveFilters({
  onFilter,
  enrollUsecase,
  quizUsecase,
  form,
  handleChange,
}: {
  onFilter: (filters: GetUserQuizLiveStatusRequest, intervalSeconds?: number) => void;
  enrollUsecase: EnrollmentUsecase;
  quizUsecase: QuizUsecase;
  form: GetUserQuizLiveStatusRequest;
  handleChange: (field: string, value: string) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [intervalSeconds, setIntervalSeconds] = React.useState<number | undefined>(15);
  const [pageSize, setPageSize] = React.useState(50);

  const handleFilter = () => {
    if (!form.quizId || !form.enrollmentCriteriaId || !intervalSeconds) {
      CustomSnackBar.showSnackbar(t('pleaseSelectQuizEnrollmentAndInterval') ?? '', 'error');
      return;
    }

    const request = new GetUserQuizLiveStatusRequest({
      ...form,
      searchText: searchText || undefined,
      activeStatus: status !== undefined ? status : undefined,
      pageNumber: 1,
      pageSize,
    });

    onFilter(request, intervalSeconds);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus(undefined);
    setIntervalSeconds(15);
    setPageSize(50);
    onFilter(new GetUserQuizLiveStatusRequest({ pageNumber: 1, pageSize: 10 }), undefined);
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder={t('searchProgress')} />

        {/* Status */}
        <CustomSelectFilter<StatusEnum>
          label={t('status')}
          value={status}
          onChange={(val) => {
            setStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(StatusEnum)}
        />

        {/* Quiz */}
        <QuizSingleFilter
          quizUsecase={quizUsecase}
          value={form.quizId ?? ''}
          onChange={(value) => {
            handleChange('quizId', value);
          }}
          disabled={false}
          maxWidth={160}
        />

        {/* Enrollment Criteria */}
        <EnrollmentSingleFilter
          enrollmentUsecase={enrollUsecase}
          value={form.enrollmentCriteriaId ?? ''}
          onChange={(value: string) => {
            handleChange('enrollmentCriteriaId', value);
          }}
          disabled={false}
          categoryEnum={CategoryEnum.Quiz}
          maxWidth={160}
        />

        {/* Interval seconds */}
        <CustomSelectFilter<number>
          label={t('refreshIntervalSeconds')}
          value={intervalSeconds}
          onChange={(val) => {
            setIntervalSeconds(val);
          }}
          options={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 15, label: '15' },
            { value: 30, label: '30' },
            { value: 60, label: '60' },
          ]}
          size="small"
          minWidth={120}
          withAllOption={false}
        />

        {/* Page Size */}
        <CustomSelectFilter<number>
          label={t('pageSize')}
          value={pageSize}
          onChange={(val) => {
            setPageSize(val ?? 0);
          }}
          options={[
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 200, label: '200' },
            { value: 300, label: '300' },
          ]}
          size="small"
          minWidth={120}
          withAllOption={false}
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
          {t('start')}
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
          {t('end')}
        </Button>
      </Stack>
    </Card>
  );
}
