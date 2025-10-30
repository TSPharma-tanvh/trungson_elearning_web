'use client';

import * as React from 'react';
import { GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { CoreEnumUtils, UserProgressEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';
import { CourseSingleFilter } from '@/presentation/components/shared/courses/courses/course-single-filter';
import { LessonSingleFilter } from '@/presentation/components/shared/courses/lessons/lesson-single-filter';

export function UserLessonProgressFilters({
  onFilter,
  courseUsecase,
  lessonUsecase,
}: {
  onFilter: (filters: GetUserLessonProgressRequest) => void;
  courseUsecase: any;
  lessonUsecase: any;
}): React.JSX.Element {
  const { t } = useTranslation();

  const [form, setForm] = React.useState<Partial<GetUserLessonProgressRequest>>({
    searchText: '',
    status: undefined,
    courseID: undefined,
    lessonID: undefined,
  });

  const handleChange = <K extends keyof GetUserLessonProgressRequest>(
    key: K,
    value: GetUserLessonProgressRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilter = () => {
    const request = new GetUserLessonProgressRequest({
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
      courseID: undefined,
      lessonID: undefined,
    });
    onFilter(new GetUserLessonProgressRequest({ pageNumber: 1, pageSize: 10 }));
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
          onEnter={() => handleFilter()}
          placeholder={t('searchProgress')}
        />

        {/* Status */}
        <CustomSelectFilter<string>
          label={t('status')}
          value={form.status}
          onChange={(val) => {
            handleChange('status', val ?? '');
          }}
          options={CoreEnumUtils.getEnumOptions(UserProgressEnum).map((opt) => ({
            value: opt.label,
            label: opt.label,
          }))}
        />

        {/* Course */}
        <CourseSingleFilter
          courseUsecase={courseUsecase}
          value={form.courseID ?? ''}
          onChange={(value: string) => {
            handleChange('courseID', value);
          }}
          disabled={false}
        />

        {/* Lesson */}
        <LessonSingleFilter
          lessonUsecase={lessonUsecase}
          value={form.lessonID ?? ''}
          onChange={(value: string) => {
            handleChange('lessonID', value);
          }}
          disabled={false}
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
