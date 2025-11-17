'use client';

import React, { useEffect, useState } from 'react';
import { CreateLessonCollectionRequest } from '@/domain/models/courses/request/create-course-lesson-collection-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Add, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { LessonMultiSelectAndCreateDialog } from '@/presentation/components/shared/courses/lessons/lesson-multi-select-and-create-form';

interface LessonCollectionEditorProps {
  fixedCourse?: boolean;
  value: CreateLessonCollectionRequest[];
  onChange: (value: CreateLessonCollectionRequest[]) => void;
}

export function LessonCollectionCreateEditor({ fixedCourse = false, value, onChange }: LessonCollectionEditorProps) {
  const { t } = useTranslation();
  const { lessonUsecase } = useDI();

  const normalize = (arr: CreateLessonCollectionRequest[]) =>
    arr.map((item) => new CreateLessonCollectionRequest(item));

  const [items, setItems] = useState<CreateLessonCollectionRequest[]>(
    value.length > 0 ? normalize(value) : [new CreateLessonCollectionRequest({ name: '', order: 1, lessonIds: [] })]
  );

  const [fixedDuration, setFixedDuration] = useState<number | undefined>(
    fixedCourse && value.length > 0 ? value[0]?.fixedCourseDayDuration ?? undefined : undefined
  );

  useEffect(() => {
    if (!fixedCourse) setFixedDuration(undefined);
  }, [fixedCourse]);

  useEffect(() => {
    if (value.length > 0) {
      const normalized = normalize(value);
      setItems(normalized);
      if (fixedCourse) setFixedDuration(value[0]?.fixedCourseDayDuration ?? undefined);
    }
  }, [value, fixedCourse]);

  const updateItems = (newItems: CreateLessonCollectionRequest[]) => {
    setItems(newItems);
    onChange(newItems);
  };

  const updateFixedDuration = (num: number | undefined) => {
    setFixedDuration(num);
    const updated = items.map(
      (item) =>
        new CreateLessonCollectionRequest({
          ...item,
          fixedCourseDayDuration: num,
          startDate: fixedCourse ? undefined : item.startDate,
          endDate: fixedCourse ? undefined : item.endDate,
        })
    );
    updateItems(updated);
  };

  const handleAdd = () => {
    const nextOrder = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;
    const newItem = new CreateLessonCollectionRequest({
      name: '',
      order: nextOrder,
      lessonIds: [],
      fixedCourseDayDuration: undefined,
    });
    updateItems([...items, newItem]);
  };

  const handleDelete = (order: number) => {
    const filtered = items.filter((i) => i.order !== order);
    const reindexed = filtered.map((item, idx) => new CreateLessonCollectionRequest({ ...item, order: idx + 1 }));
    updateItems(reindexed);
  };

  const handleChange = <K extends keyof CreateLessonCollectionRequest>(
    order: number,
    field: K,
    val: CreateLessonCollectionRequest[K]
  ) => {
    const updated = items.map((item) =>
      item.order === order ? new CreateLessonCollectionRequest({ ...item, [field]: val }) : item
    );
    updateItems(updated);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {t('lessonCollections')}
      </Typography>

      <Stack spacing={3}>
        {items.map((item) => (
          <Card key={item.order} variant="outlined">
            <CardContent sx={{ pt: 2, pb: 3 }}>
              <Grid container alignItems="center" justifyContent="space-between" mb={1}>
                <Grid item>
                  <Typography fontWeight={600} color="primary">
                    {t('part')} {item.order}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item.order)}
                    disabled={items.length === 1}
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>

              <Box mb={2}>
                <CustomTextField
                  label={t('collectionName')}
                  value={item.name}
                  onChange={(val) => handleChange(item.order, 'name', val)}
                  required
                />
              </Box>

              <Box>
                <LessonMultiSelectAndCreateDialog
                  lessonUsecase={lessonUsecase}
                  value={item.lessonIds}
                  onChange={(ids) => handleChange(item.order, 'lessonIds', ids)}
                  label={t('lessonsInCollection')}
                />
              </Box>

              {/* Ngày (nếu không phải fixed course) */}
              {!fixedCourse && (
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomDateTimePicker
                      label={t('startDate')}
                      value={item.startDate ? item.startDate.toISOString() : undefined}
                      onChange={(iso) => handleChange(item.order, 'startDate', iso ? new Date(iso) : undefined)}
                      allowClear
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomDateTimePicker
                      label={t('endDate')}
                      value={item.endDate ? item.endDate.toISOString() : undefined}
                      onChange={(iso) => handleChange(item.order, 'endDate', iso ? new Date(iso) : undefined)}
                      allowClear
                    />
                  </Grid>
                </Grid>
              )}

              {/* Thời lượng cố định (nếu là fixed course) */}
              {fixedCourse && (
                <Box mt={2}>
                  <CustomTextField
                    label={t('courseDuration')}
                    value={item.fixedCourseDayDuration?.toString() ?? ''}
                    onChange={(value) => {
                      const numericValue =
                        value === '' ? undefined : /^\d+$/.test(value) ? Number(value) : item.fixedCourseDayDuration;
                      handleChange(item.order, 'fixedCourseDayDuration', numericValue);
                    }}
                    required
                    inputMode="numeric"
                    patternError={t('onlyPositiveIntegerError')}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Box mt={3}>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          {t('addCollection')}
        </Button>
      </Box>
    </Box>
  );
}
