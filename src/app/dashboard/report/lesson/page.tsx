'use client';

import React, { useState } from 'react';
import { GetEmployeeDistinctRequest } from '@/domain/models/employee/request/get-employee-distinct-request';
import { EmployeeDistinctResponse } from '@/domain/models/employee/response/employee-distinct-response';
import { ExportLessonProgressReportRequest } from '@/domain/models/lessons/request/export-lesson-progress-report-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
import { Card, Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDownListMultiple } from '@/presentation/components/core/drop-down/custom-select-drop-down-list-multiple';
import { CustomSelectDropDownNullable } from '@/presentation/components/core/drop-down/custom-select-drop-down-nullable';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { LessonSingleSelectDialog } from '@/presentation/components/shared/courses/lessons/lesson-select';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { lessonUsecase, employeeUsecase } = useDI();

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<EmployeeDistinctResponse[]>([]);

  const [form, setForm] = useState(
    new ExportLessonProgressReportRequest({
      lessonId: '',
      sortDescending: false,
    })
  );

  const handleChange = <K extends keyof ExportLessonProgressReportRequest>(
    key: K,
    value: ExportLessonProgressReportRequest[K] | null | undefined
  ) => {
    setForm((prev) => new ExportLessonProgressReportRequest({ ...prev, [key]: value as any }));
  };

  const fetchDepartments = async () => {
    try {
      const request = new GetEmployeeDistinctRequest({
        type: DepartmentFilterType[DepartmentFilterType.Department],
      });
      const res = await employeeUsecase.getEmployeeDistinct(request);
      setItems(res);
    } catch (err) {
      return null;
    }
  };

  const handleExport = async () => {
    if (!form.lessonId) {
      CustomSnackBar.showSnackbar(t('pleaseSelectLesson'), 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await lessonUsecase.exportLesson(form);

      const byteCharacters = atob(response.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: response.contentType ?? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = response.fileName ?? 'LessonReport.xlsx';
      link.click();

      URL.revokeObjectURL(link.href);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('exportLessonProgress')}
          </Typography>
        </Stack>

        <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4}>
            {/* Lesson ID */}
            <Grid item xs={12}>
              <LessonSingleSelectDialog
                lessonUsecase={lessonUsecase}
                value={form.lessonId ?? ''}
                onChange={(value: string) => {
                  handleChange('lessonId', value);
                }}
                disabled={false}
              />
            </Grid>

            {/* Statuses */}
            <Grid item xs={12}>
              <CustomSelectDropDownListMultiple<string>
                label={t('status')}
                value={form.statuses || []}
                onChange={(v) => handleChange('statuses', v)}
                options={[
                  { value: null, label: t('all') },
                  { value: 'NotStarted', label: t('notStarted') },
                  { value: 'Ongoing', label: t('ongoing') },
                  { value: 'Done', label: t('done') },
                ]}
                disabled={loading}
              />
            </Grid>

            {/* Departments */}
            <Grid item xs={12}>
              <CustomSelectDropDownListMultiple<string>
                onOpen={fetchDepartments}
                label={t('department')}
                value={form.departmentCodes ?? []}
                onChange={(v) => handleChange('departmentCodes', v)}
                options={items.map((d) => ({
                  value: d.code!,
                  label: d.name!,
                }))}
              />
            </Grid>

            {/* Progress Range */}
            <Grid item xs={6}>
              <CustomSelectDropDownNullable<number>
                label={t('minProgress')}
                value={form.minProgress ?? undefined}
                onChange={(v) => handleChange('minProgress', Number(v))}
                options={[0, 10, 20, 30, 50, 75, 100].map((v) => ({
                  value: v,
                  label: `${v}%`,
                }))}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomSelectDropDownNullable<number>
                label={t('maxProgress')}
                value={form.maxProgress ?? undefined}
                onChange={(v) => handleChange('maxProgress', Number(v))}
                options={[0, 10, 20, 30, 50, 75, 100].map((v) => ({
                  value: v,
                  label: `${v}%`,
                }))}
                disabled={loading}
              />
            </Grid>

            {/* Date Filters */}
            {/* {[
              { key: 'actualStartDateFrom', label: t('actualStartDateFrom') },
              { key: 'actualStartDateTo', label: t('actualStartDateTo') },
              { key: 'actualEndDateFrom', label: t('actualEndDateFrom') },
              { key: 'actualEndDateTo', label: t('actualEndDateTo') },
            ].map((item) => (
              <Grid item xs={6} key={item.key}>
                <CustomDateTimePicker
                  label={item.label}
                  value={(form as any)[item.key] ? DateTimeUtils.formatISODateToString((form as any)[item.key]) : ''}
                  onChange={(val) => {
                    const date = val ? DateTimeUtils.formatStringToDateTime(val) : null;
                    handleChange(item.key as any, date ? date.toISOString() : null);
                  }}
                />
              </Grid>
            ))} */}

            {/* Last Access */}
            {/* <Grid item xs={6}>
              <CustomDateTimePicker
                label={t('lastAccessFrom')}
                value={form.lastAccessFrom ? DateTimeUtils.formatISODateToString(form.lastAccessFrom) : ''}
                onChange={(v) =>
                  handleChange('lastAccessFrom', v ? DateTimeUtils.formatStringToDateTime(v)?.toISOString() : undefined)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomDateTimePicker
                label={t('lastAccessTo')}
                value={form.lastAccessTo ? DateTimeUtils.formatISODateToString(form.lastAccessTo) : ''}
                onChange={(v) =>
                  handleChange('lastAccessTo', v ? DateTimeUtils.formatStringToDateTime(v)?.toISOString() : undefined)
                }
              />
            </Grid> */}

            {/* Sort */}
            <Grid item xs={12}>
              <CustomSelectDropDownNullable<string>
                label={t('sortBy')}
                value={form.sortBy}
                onChange={(v) => handleChange('sortBy', v)}
                options={[
                  { value: 'fullname', label: t('fullName') },
                  { value: 'department', label: t('department') },
                  { value: 'progress', label: t('progress') },
                  { value: 'lastaccess', label: t('lastAccess') },
                ]}
              />
            </Grid>

            {/* Sort Direction */}
            <Grid item xs={12}>
              <CustomSelectDropDownNullable<boolean>
                label={t('sortOrder')}
                value={form.sortDescending}
                onChange={(v) => handleChange('sortDescending', v)}
                options={[
                  { value: false, label: t('ascending') },
                  { value: true, label: t('descending') },
                ]}
                allowEmpty={false}
              />
            </Grid>

            {/* Export Button */}
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end">
                <CustomButton loading={loading} onClick={handleExport} label={t('export')} />
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Stack>
    </Container>
  );
}
