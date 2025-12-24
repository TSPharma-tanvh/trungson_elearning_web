'use client';

import React, { useEffect, useState } from 'react';
import { CourseCreateLessonCollectionRequest } from '@/domain/models/courses/request/create-course-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { UnfoldLess, UnfoldMore } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

import { QuizOrderCollectionCreateForm } from '../../quiz/quiz/quiz-order-collection-create-form';
import { LinearLessonOrderEditor } from './linear-lesson-order-editor';

interface LinearLessonCollectionEditorProps {
  fixedCourse?: boolean;
  value: CourseCreateLessonCollectionRequest[];
  onChange: (value: CourseCreateLessonCollectionRequest[]) => void;
}

export function LinearLessonCollectionCreateByFileEditor({
  fixedCourse = false,
  value,
  onChange,
}: LinearLessonCollectionEditorProps) {
  const { t } = useTranslation();
  const { quizUsecase } = useDI();

  const normalize = (arr: CourseCreateLessonCollectionRequest[]) =>
    arr.map((i) => new CourseCreateLessonCollectionRequest(i));

  const [items, setItems] = useState<CourseCreateLessonCollectionRequest[]>(
    value.length
      ? normalize(value)
      : [
          new CourseCreateLessonCollectionRequest({
            order: 1,
            lessonCollection: [],
          }),
        ]
  );

  const [collapsedMap, setCollapsedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (value.length) setItems(normalize(value));
  }, [value]);

  const updateItems = (next: CourseCreateLessonCollectionRequest[]) => {
    setItems(next);
    onChange(next);
  };

  const toggleCollapse = (order: number) => {
    setCollapsedMap((p) => ({ ...p, [order]: !p[order] }));
  };

  const updateField = <K extends keyof CourseCreateLessonCollectionRequest>(
    order: number,
    field: K,
    value: CourseCreateLessonCollectionRequest[K]
  ) => {
    updateItems(
      items.map((i) => (i.order === order ? new CourseCreateLessonCollectionRequest({ ...i, [field]: value }) : i))
    );
  };

  return (
    <Box mt={3}>
      <Stack spacing={3}>
        {items.map((item) => {
          const isCollapsed = collapsedMap[item.order];

          return (
            <Card key={item.order} variant="outlined">
              <CardContent
                sx={{
                  padding: isCollapsed ? '8px 12px' : 2,
                  '&:last-child': {
                    paddingBottom: isCollapsed ? '8px' : 2,
                  },
                }}
              >
                {/*  Header  */}
                <Grid container alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={600} color="primary">
                      {t('basicInfo')}
                    </Typography>
                  </Stack>

                  <Box>
                    <IconButton size="small" onClick={() => toggleCollapse(item.order)}>
                      {isCollapsed ? <UnfoldMore fontSize="small" /> : <UnfoldLess fontSize="small" />}
                    </IconButton>
                  </Box>
                </Grid>

                {/*  COLLAPSED  */}
                {isCollapsed && <Box mt={1} />}

                {/*  EXPANDED  */}
                {!isCollapsed && (
                  <>
                    <Box mt={3}>
                      <LinearLessonOrderEditor
                        value={item.lessonCollection}
                        onChange={(val) => updateField(item.order, 'lessonCollection', val)}
                        label={t('lesson')}
                      />
                    </Box>

                    <Box mt={3}>
                      <QuizOrderCollectionCreateForm
                        value={item.quizzes || []}
                        onChange={(val) => updateField(item.order, 'quizzes', val)}
                        label={t('lessonsQuizzes')}
                        quizUsecase={quizUsecase}
                      />
                    </Box>

                    <Box mt={3}>
                      <Typography fontWeight={600}>{fixedCourse ? t('duration') : t('time')}</Typography>
                    </Box>

                    {!fixedCourse && (
                      <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={6}>
                          <CustomDateTimePicker
                            label={t('startDate')}
                            value={item.startDate ? DateTimeUtils.formatISODateToString(item.startDate) : undefined}
                            onChange={(iso) => updateField(item.order, 'startDate', iso ? new Date(iso) : undefined)}
                            allowClear
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <CustomDateTimePicker
                            label={t('endDate')}
                            value={item.endDate ? DateTimeUtils.formatISODateToString(item.endDate) : undefined}
                            onChange={(iso) => updateField(item.order, 'endDate', iso ? new Date(iso) : undefined)}
                            allowClear
                          />
                        </Grid>
                      </Grid>
                    )}

                    {fixedCourse && (
                      <Box mt={2}>
                        <CustomTextField
                          label={t('durationInDaysForThisPart')}
                          value={item.fixedCourseDayDuration?.toString() ?? ''}
                          onChange={(v) =>
                            updateField(item.order, 'fixedCourseDayDuration', v === '' ? undefined : Number(v))
                          }
                          inputMode="numeric"
                        />
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
