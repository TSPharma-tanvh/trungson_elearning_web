'use client';

import * as React from 'react';
import { GetUserCourseProgressRequest } from '@/domain/models/user-course/request/get-user-course-progress-request';
import { type CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { CoreEnumUtils, CourseTypeEnum, UserProgressEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';
import { CourseSingleFilter } from '@/presentation/components/shared/courses/courses/course-single-filter';

export function UserLinearCourseProgressFilters({
  onFilter,
  courseUsecase,
}: {
  onFilter: (filters: GetUserCourseProgressRequest) => void;
  courseUsecase: CourseUsecase;
}): React.JSX.Element {
  const { t } = useTranslation();

  const [form, setForm] = React.useState<Partial<GetUserCourseProgressRequest>>({
    searchText: '',
    status: undefined,
    enrollmentCriteriaId: undefined,
  });

  const handleChange = <K extends keyof GetUserCourseProgressRequest>(
    key: K,
    value: GetUserCourseProgressRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilter = () => {
    const request = new GetUserCourseProgressRequest({
      ...form,
      pageNumber: 1,
      pageSize: 10,
      courseType: CourseTypeEnum[CourseTypeEnum.Linear],
    });
    onFilter(request);
  };

  const handleClear = () => {
    setForm({
      searchText: '',
      status: undefined,
      enrollmentCriteriaId: undefined,
    });
    onFilter(
      new GetUserCourseProgressRequest({
        pageNumber: 1,
        pageSize: 10,
        courseType: CourseTypeEnum[CourseTypeEnum.Linear],
      })
    );
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
          value={form.status as unknown as string}
          onChange={(val) => {
            handleChange('status', String(val));
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
          onChange={(value) => {
            handleChange('courseID', value);
          }}
          disabled={false}
          courseTypeValue={CourseTypeEnum.Linear}
        />

        {/* Enrollment Criteria */}
        {/* <EnrollmentSingleFilter
          enrollmentUsecase={enrollUsecase}
          value={form.enrollmentCriteriaId ?? ''}
          onChange={(value: string) => {
            handleChange('enrollmentCriteriaId', value);
          }}
          disabled={false}
          categoryEnum={category}
        /> */}

        {/* <CustomSelectFilter<boolean>
          label={t('hasPath')}
          value={form.hasPath}
          onChange={(val) => {
            handleChange('hasPath', val);
          }}
          options={[
            { value: true, label: 'yes' },
            { value: false, label: 'no' },
          ]}
          withAllOption
          allLabel="all"
        /> */}

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
