'use client';

import React, { useEffect, useState } from 'react';
import { LessonsCollectionUpdateRequest } from '@/domain/models/lessons/request/lesson-collection-update-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Add, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { LessonMultiSelectAndCreateDialog } from '@/presentation/components/shared/courses/lessons/lesson-multi-select-and-create-form';

interface LessonCollectionUpdateEditorProps {
  fixedCourse?: boolean;
  value: LessonsCollectionUpdateRequest[];
  onChange: (value: LessonsCollectionUpdateRequest[]) => void;
}

export function LessonCollectionUpdateEditor({
  fixedCourse = false,
  value,
  onChange,
}: LessonCollectionUpdateEditorProps) {
  const { t } = useTranslation();
  const { lessonUsecase } = useDI();

  const normalize = (arr: LessonsCollectionUpdateRequest[]) =>
    arr.map((item) => new LessonsCollectionUpdateRequest(item));

  const [items, setItems] = useState<LessonsCollectionUpdateRequest[]>(
    value.length > 0
      ? normalize(value)
      : [new LessonsCollectionUpdateRequest({ id: '', name: '', order: 1, lessonIds: [] })]
  );

  // XÓA: state chung fixedDuration

  useEffect(() => {
    if (value.length > 0) {
      const normalized = normalize(value);
      setItems(normalized);
    }
  }, [value]);

  const updateItems = (newItems: LessonsCollectionUpdateRequest[]) => {
    setItems(newItems);
    onChange(newItems);
  };

  const handleAdd = () => {
    const nextOrder = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;
    const newItem = new LessonsCollectionUpdateRequest({
      id: '',
      name: '',
      order: nextOrder,
      lessonIds: [],
      // Không set fixedCourseDayDuration ở đây
    });
    updateItems([...items, newItem]);
  };

  const handleDelete = (order: number) => {
    const filtered = items.filter((i) => i.order !== order);
    const reindexed = filtered.map((item, idx) => new LessonsCollectionUpdateRequest({ ...item, order: idx + 1 }));
    updateItems(reindexed);
  };

  const handleChange = <K extends keyof LessonsCollectionUpdateRequest>(
    order: number,
    field: K,
    val: LessonsCollectionUpdateRequest[K]
  ) => {
    const updated = items.map((item) =>
      item.order === order ? new LessonsCollectionUpdateRequest({ ...item, [field]: val }) : item
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
              {/* HEADER */}
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

              {/* TÊN COLLECTION */}
              <Box mb={2}>
                <CustomTextField
                  label={t('collectionName')}
                  value={item.name}
                  onChange={(val) => handleChange(item.order, 'name', val)}
                  required
                />
              </Box>

              {/* LESSONS */}
              <Box>
                <LessonMultiSelectAndCreateDialog
                  lessonUsecase={lessonUsecase}
                  value={item.lessonIds}
                  onChange={(ids) => handleChange(item.order, 'lessonIds', ids)}
                  label={t('lessonsInCollection')}
                />
              </Box>

              {/* NGÀY (nếu không fixed) */}
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
