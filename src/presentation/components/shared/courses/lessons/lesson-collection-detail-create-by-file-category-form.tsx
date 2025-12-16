'use client';

import React, { useEffect, useState } from 'react';
import { CourseCreateLessonCollectionRequest } from '@/domain/models/courses/request/create-course-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { Add, Delete } from '@mui/icons-material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

import { QuizMultiSelectAndCreateDialog } from '../../quiz/quiz/quiz-multi-select-and-create-form';
import { QuizOrderCollectionCreateForm } from '../../quiz/quiz/quiz-order-collection-create-form';
import { LessonOrderEditor } from './lesson-order-editor';

interface LessonCollectionEditorProps {
  fixedCourse?: boolean;
  value: CourseCreateLessonCollectionRequest[];
  onChange: (value: CourseCreateLessonCollectionRequest[]) => void;
}

export function LessonCollectionCreateByFileEditor({
  fixedCourse = false,
  value,
  onChange,
}: LessonCollectionEditorProps) {
  const { t } = useTranslation();
  const { quizUsecase } = useDI();

  const normalize = (arr: CourseCreateLessonCollectionRequest[]) =>
    arr.map((i) => new CourseCreateLessonCollectionRequest(i));

  const [items, setItems] = useState<CourseCreateLessonCollectionRequest[]>(
    value.length
      ? normalize(value)
      : [
          new CourseCreateLessonCollectionRequest({
            name: '',
            order: 1,
            lessonCollection: [],
          }),
        ]
  );

  useEffect(() => {
    if (value.length) setItems(normalize(value));
  }, [value]);

  const updateItems = (next: CourseCreateLessonCollectionRequest[]) => {
    setItems(next);
    onChange(next);
  };

  const addCollection = () => {
    updateItems([
      ...items,
      new CourseCreateLessonCollectionRequest({
        name: '',
        order: items.length + 1,
        lessonCollection: [],
      }),
    ]);
  };

  const removeCollection = (order: number) => {
    const reIndexed = items
      .filter((i) => i.order !== order)
      .map((i, idx) => new CourseCreateLessonCollectionRequest({ ...i, order: idx + 1 }));
    updateItems(reIndexed);
  };

  const moveCollection = (order: number, direction: 'up' | 'down') => {
    const index = items.findIndex((i) => i.order === order);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const cloned = [...items];
    const temp = cloned[index];
    cloned[index] = cloned[targetIndex];
    cloned[targetIndex] = temp;

    const reIndexed = cloned.map(
      (item, idx) =>
        new CourseCreateLessonCollectionRequest({
          ...item,
          order: idx + 1,
        })
    );

    updateItems(reIndexed);
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
        {items.map((item) => (
          <Card key={item.order} variant="outlined">
            <CardContent>
              <Grid container alignItems="center" justifyContent="space-between" mb={2}>
                <Typography fontWeight={600} color="primary">
                  {t('part')} {item.order}
                </Typography>

                <Box>
                  <IconButton size="small" disabled={item.order === 1} onClick={() => moveCollection(item.order, 'up')}>
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    disabled={item.order === items.length}
                    onClick={() => moveCollection(item.order, 'down')}
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    color="error"
                    size="small"
                    disabled={items.length === 1}
                    onClick={() => removeCollection(item.order)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>

              <Stack spacing={2} mt={2}>
                <Typography fontWeight={600} mb={1}>
                  {t('basicInfo')}
                </Typography>

                <CustomTextField
                  label={t('collectionName')}
                  value={item.name}
                  onChange={(v) => updateField(item.order, 'name', v)}
                  required
                />

                <CustomTextField
                  label={t('lessonCollectionName')}
                  value={item.lessonCollectionName}
                  onChange={(v) => updateField(item.order, 'lessonCollectionName', v || '')}
                  required
                />

                <CustomTextField
                  label={t('lessonCollectionDetail')}
                  value={item.lessonCollectionDetail}
                  onChange={(v) => updateField(item.order, 'lessonCollectionDetail', v || '')}
                />
              </Stack>

              <Box mt={3}>
                <LessonOrderEditor
                  value={item.lessonCollection}
                  onChange={(val) => updateField(item.order, 'lessonCollection', val)}
                  label={t('lessonsInCollection')}
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
                <Typography fontWeight={600} mb={1}>
                  {fixedCourse ? t('duration') : t('time')}
                </Typography>
              </Box>

              {!fixedCourse && (
                <Grid container spacing={2} mt={2}>
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
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Box mt={4}>
        <Button variant="outlined" startIcon={<Add />} onClick={addCollection}>
          {t('addCollection')}
        </Button>
      </Box>
    </Box>
  );
}
