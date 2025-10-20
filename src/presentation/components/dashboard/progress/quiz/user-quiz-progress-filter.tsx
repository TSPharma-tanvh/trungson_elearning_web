'use client';

import * as React from 'react';
import { GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { type EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { type QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { CategoryEnum, CoreEnumUtils, UserQuizProgressEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';
import { EnrollmentSingleFilter } from '@/presentation/components/shared/enrollment/enrollment-single-filter';
import { QuizSingleFilter } from '@/presentation/components/shared/quiz/quiz/quiz-single-filter';

export function UserQuizProgressFilters({
  onFilter,
  enrollUsecase,
  quizUsecase,
}: {
  onFilter: (filters: GetUserQuizProgressRequest) => void;
  enrollUsecase: EnrollmentUsecase;
  quizUsecase: QuizUsecase;
}): React.JSX.Element {
  const { t } = useTranslation();

  // Form state
  const [form, setForm] = React.useState<Partial<GetUserQuizProgressRequest>>({
    searchText: '',
    progressStatus: undefined,
    quizId: undefined,
    enrollmentCriteriaId: undefined,
  });

  const [selectedCategory, setSelectedCategory] = React.useState<CategoryEnum>(CategoryEnum.Path);

  const handleChange = <K extends keyof GetUserQuizProgressRequest>(key: K, value: GetUserQuizProgressRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilter = () => {
    const request = new GetUserQuizProgressRequest({
      ...form,
      pageNumber: 1,
      pageSize: 10,
    });
    onFilter(request);
  };

  const handleClear = () => {
    setForm({
      searchText: '',
      progressStatus: undefined,
      quizId: undefined,
      enrollmentCriteriaId: undefined,
    });
    setSelectedCategory(CategoryEnum.Path);
    onFilter(new GetUserQuizProgressRequest({ pageNumber: 1, pageSize: 10 }));
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
          onChange={(val) => { handleChange('searchText', val); }}
          placeholder={t('searchProgress')}
        />

        {/* Status */}
        <CustomSelectFilter<UserQuizProgressEnum>
          label={t('status')}
          value={form.progressStatus}
          onChange={(val) => { handleChange('progressStatus', val); }}
          options={CoreEnumUtils.getEnumOptions(UserQuizProgressEnum)}
        />

        {/* Quiz */}
        <QuizSingleFilter
          quizUsecase={quizUsecase}
          value={form.quizId ?? ''}
          onChange={(value) => { handleChange('quizId', value); }}
          disabled={false}
        />

        {/* Enrollment */}
        <CustomSelectFilter<CategoryEnum>
          label={t('enrollmentType')}
          value={selectedCategory}
          onChange={(val) => {
            if (val !== undefined) {
              setSelectedCategory(val);
              handleChange('enrollmentCriteriaId', undefined);
            }
          }}
          options={[
            { label: 'Path', value: CategoryEnum.Path },
            { label: 'Quiz', value: CategoryEnum.Quiz },
          ]}
          withAllOption={false}
        />

        <EnrollmentSingleFilter
          enrollmentUsecase={enrollUsecase}
          value={form.enrollmentCriteriaId ?? ''}
          onChange={(value: string) => { handleChange('enrollmentCriteriaId', value); }}
          disabled={false}
          categoryEnum={selectedCategory}
        />

        {/* Buttons */}
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
