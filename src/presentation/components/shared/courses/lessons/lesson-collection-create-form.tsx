'use client';

import React, { useEffect, useState } from 'react';
import { CreateLessonCollectionRequest } from '@/domain/models/courses/request/create-course-lesson-collection-request';
import { Add, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

import { LessonOrderEditor } from './lesson-collection-create-detail-form';

interface LessonCollectionItemCardProps {
  item: CreateLessonCollectionRequest;
  fixedCourse: boolean;
  fixedDuration?: number;
  canDelete: boolean;
  onDelete: () => void;
  onChangeField: <K extends keyof CreateLessonCollectionRequest>(
    field: K,
    val: CreateLessonCollectionRequest[K]
  ) => void;
  onUpdateFixedDuration: (num: number | undefined) => void;
}

function LessonCollectionItemCard({
  item,
  fixedCourse,
  fixedDuration,
  canDelete,
  onDelete,
  onChangeField,
  onUpdateFixedDuration,
}: LessonCollectionItemCardProps) {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent sx={{ pt: 2, pb: 3 }}>
        {/* Header: Part X + Delete */}
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

        {/* Tên collection */}
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

        {/* Danh sách lesson có thứ tự */}
        <LessonOrderEditor
          value={item.collection}
          onChange={(newCollection) => {
            onChangeField('collection', newCollection);
          }}
          label={t('lessonsInCollection')}
        />

        {/* Ngày bắt đầu / kết thúc (nếu không fixed) */}
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

        {/* Thời lượng cố định (nếu là fixed course) */}
        {fixedCourse ? (
          <Box mt={3}>
            <CustomTextField
              label={t('courseDurationInDays')}
              value={fixedDuration?.toString() ?? ''}
              onChange={(val) => {
                const num = val === '' ? undefined : /^\d+$/.test(val) ? Number(val) : fixedDuration;
                onUpdateFixedDuration(num);
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

interface LessonCollectionEditorProps {
  fixedCourse?: boolean;
  value: CreateLessonCollectionRequest[];
  onChange: (value: CreateLessonCollectionRequest[]) => void;
}

export function LessonCollectionCreateEditor({ fixedCourse = false, value, onChange }: LessonCollectionEditorProps) {
  const { t } = useTranslation();

  const normalize = (arr: CreateLessonCollectionRequest[]) =>
    arr.map((item) => new CreateLessonCollectionRequest(item));

  const [items, setItems] = useState<CreateLessonCollectionRequest[]>(
    value.length > 0
      ? normalize(value)
      : [
          new CreateLessonCollectionRequest({
            name: '',
            order: 1,
            collection: [],
          }),
        ]
  );

  const [fixedDuration, setFixedDuration] = useState<number | undefined>(
    fixedCourse && value.length > 0 ? value[0]?.fixedCourseDayDuration ?? undefined : undefined
  );

  // sync
  useEffect(() => {
    if (value.length > 0) {
      const normalized = normalize(value);
      setItems(normalized);
      if (fixedCourse) setFixedDuration(value[0]?.fixedCourseDayDuration ?? undefined);
    }
  }, [value, fixedCourse]);

  // delete fixed course
  useEffect(() => {
    if (!fixedCourse) setFixedDuration(undefined);
  }, [fixedCourse]);

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
      collection: [],
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
    const updated = items.map((item) => {
      if (item.order === order) {
        // Khi update 'collection', merge với dữ liệu cũ thay vì ghi đè
        if (field === 'collection') {
          return new CreateLessonCollectionRequest({
            ...item,
            [field]: val,
          });
        }
        return new CreateLessonCollectionRequest({ ...item, [field]: val });
      }
      return item;
    });
    updateItems(updated);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {t('lessonCollections')}
      </Typography>

      <Stack spacing={3}>
        {items.map((item) => (
          <LessonCollectionItemCard
            key={item.order}
            item={item}
            fixedCourse={fixedCourse}
            fixedDuration={fixedDuration}
            onDelete={() => {
              handleDelete(item.order);
            }}
            onChangeField={(field, val) => {
              handleChange(item.order, field, val);
            }}
            onUpdateFixedDuration={updateFixedDuration}
            canDelete={items.length > 1}
          />
        ))}
      </Stack>

      {/* Nút thêm collection mới */}
      <Box mt={4}>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          {t('addCollection')}
        </Button>
      </Box>
    </Box>
  );
}
