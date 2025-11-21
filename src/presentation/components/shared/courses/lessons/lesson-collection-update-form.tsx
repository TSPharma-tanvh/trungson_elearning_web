'use client';

import React, { useEffect, useState } from 'react';
import { LessonsCollectionUpdateRequest } from '@/domain/models/lessons/request/lesson-collection-update-request';
import { Add, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

import { LessonOrderEditor } from './lesson-collection-create-detail-form'; // Reuse the same ordered editor

interface LessonCollectionUpdateItemCardProps {
  item: LessonsCollectionUpdateRequest;
  fixedCourse: boolean;
  sharedFixedDuration?: number;
  canDelete: boolean;
  onDelete: () => void;
  onChangeField: <K extends keyof LessonsCollectionUpdateRequest>(
    field: K,
    val: LessonsCollectionUpdateRequest[K]
  ) => void;
  onUpdateSharedDuration: (num: number | undefined) => void;
}

function LessonCollectionUpdateItemCard({
  item,
  fixedCourse,
  sharedFixedDuration,
  canDelete,
  onDelete,
  onChangeField,
  onUpdateSharedDuration,
}: LessonCollectionUpdateItemCardProps) {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent sx={{ pt: 2, pb: 3 }}>
        {/* Header */}
        <Grid container alignItems="center" justifyContent="space-between" mb={2}>
          <Grid item>
            <Typography fontWeight={600} color="primary">
              {t('part')} {item.order}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton color="error" onClick={onDelete} disabled={!canDelete} size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>

        {/* Collection Name */}
        <Box mb={3}>
          <CustomTextField
            label={t('collectionName')}
            value={item.name}
            onChange={(val) => {
              onChangeField('name', val);
            }}
            required
          />
        </Box>

        {/* Ordered Lessons */}
        <LessonOrderEditor
          value={item.collection}
          onChange={(newCollection) => {
            onChangeField('collection', newCollection);
          }}
          label={t('lessonsInCollection')}
        />

        {/* Start/End Date (only if not fixed course) */}
        {!fixedCourse && (
          <Grid container spacing={2} mt={3}>
            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startDate')}
                value={item.startDate ? item.startDate.toISOString() : undefined}
                onChange={(iso) => {
                  onChangeField('startDate', iso ? new Date(iso) : undefined);
                }}
                allowClear
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endDate')}
                value={item.endDate ? item.endDate.toISOString() : undefined}
                onChange={(iso) => {
                  onChangeField('endDate', iso ? new Date(iso) : undefined);
                }}
                allowClear
              />
            </Grid>
          </Grid>
        )}

        {/* Fixed Duration (shared across all collections) */}
        {fixedCourse ? (
          <Box mt={3}>
            <CustomTextField
              label={t('courseDurationInDays')}
              value={sharedFixedDuration?.toString() ?? ''}
              onChange={(val) => {
                const num = val === '' ? undefined : /^\d+$/.test(val) ? Number(val) : sharedFixedDuration;
                onUpdateSharedDuration(num);
              }}
              required
              inputMode="numeric"
              patternError={t('onlyPositiveIntegerError')}
            />
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}

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
  // const { lessonUsecase } = useDI();

  const normalize = (arr: LessonsCollectionUpdateRequest[]) =>
    arr.map((item) => new LessonsCollectionUpdateRequest(item));

  const [items, setItems] = useState<LessonsCollectionUpdateRequest[]>(
    value.length > 0
      ? normalize(value)
      : [
          new LessonsCollectionUpdateRequest({
            id: '',
            name: '',
            order: 1,
            collection: [],
          }),
        ]
  );

  // Shared fixed duration
  const [sharedFixedDuration, setSharedFixedDuration] = useState<number | undefined>(
    fixedCourse && value.length > 0 ? value[0]?.fixedCourseDayDuration ?? undefined : undefined
  );

  useEffect(() => {
    if (value.length > 0) {
      const normalized = normalize(value);
      setItems(normalized);
      if (fixedCourse) {
        setSharedFixedDuration(value[0]?.fixedCourseDayDuration ?? undefined);
      }
    }
  }, [value, fixedCourse]);

  useEffect(() => {
    if (!fixedCourse) {
      setSharedFixedDuration(undefined);
    }
  }, [fixedCourse]);

  const updateItems = (newItems: LessonsCollectionUpdateRequest[]) => {
    setItems(newItems);
    onChange(newItems);
  };

  const updateSharedFixedDuration = (num: number | undefined) => {
    setSharedFixedDuration(num);
    const updated = items.map(
      (item) =>
        new LessonsCollectionUpdateRequest({
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
    const newItem = new LessonsCollectionUpdateRequest({
      id: '',
      name: '',
      order: nextOrder,
      collection: [],
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
          <LessonCollectionUpdateItemCard
            key={item.order}
            item={item}
            fixedCourse={fixedCourse}
            sharedFixedDuration={sharedFixedDuration}
            canDelete={items.length > 1}
            onDelete={() => {
              handleDelete(item.order);
            }}
            onChangeField={(field, val) => {
              handleChange(item.order, field, val);
            }}
            onUpdateSharedDuration={updateSharedFixedDuration}
          />
        ))}
      </Stack>

      <Box mt={4}>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          {t('addCollection')}
        </Button>
      </Box>
    </Box>
  );
}
