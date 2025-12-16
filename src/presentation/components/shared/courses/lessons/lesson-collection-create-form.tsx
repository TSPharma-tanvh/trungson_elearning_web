'use client';

import React, { useEffect, useState } from 'react';
import { CreateLessonCollectionRequest } from '@/domain/models/courses/request/create-course-lesson-collection-request';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { Add, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

import { LessonCollectionCreateDetailForm } from './lesson-collection-create-detail-form';

interface LessonCollectionItemCardProps {
  item: CreateLessonCollectionRequest;
  isFixedCourse: boolean;
  canDelete: boolean;
  onDelete: () => void;
  onChangeField: <K extends keyof CreateLessonCollectionRequest>(
    field: K,
    val: CreateLessonCollectionRequest[K]
  ) => void;
}

function LessonCollectionItemCard({
  item,
  isFixedCourse,
  canDelete,
  onDelete,
  onChangeField,
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
            value={item.name || ''}
            onChange={(val) => {
              onChangeField('name', val);
            }}
            required
          />
        </Box>

        {/* Danh sách lesson */}
        <LessonCollectionCreateDetailForm
          value={item.collection || []}
          onChange={(newCollection) => {
            onChangeField('collection', newCollection);
          }}
          label={t('lessonsInCollection')}
        />

        {/* Trường hợp KHÔNG fixed course hiển thị StartDate / EndDate */}
        {!isFixedCourse && (
          <Grid container spacing={2} mt={3}>
            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startDate')}
                value={item.startDate ? DateTimeUtils.formatISODateToString(item.startDate) : undefined}
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

        {isFixedCourse ? (
          <Box mt={3}>
            <CustomTextField
              label={t('durationInDaysForThisPart')}
              value={item.fixedCourseDayDuration?.toString() ?? ''}
              onChange={(val) => {
                const num = val === '' ? undefined : /^\d+$/.test(val) ? Number(val) : item.fixedCourseDayDuration;
                onChangeField('fixedCourseDayDuration', num);
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

  //sync value
  useEffect(() => {
    if (value.length > 0) {
      setItems(normalize(value));
    }
  }, [value]);

  const updateItems = (newItems: CreateLessonCollectionRequest[]) => {
    setItems(newItems);
    onChange(newItems);
  };

  const handleAdd = () => {
    const nextOrder = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;
    const newItem = new CreateLessonCollectionRequest({
      name: '',
      order: nextOrder,
      collection: [],
      startDate: fixedCourse ? undefined : undefined,
      endDate: fixedCourse ? undefined : undefined,
      fixedCourseDayDuration: fixedCourse ? undefined : undefined,
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
      {/* <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {t('lessonCollections')}
      </Typography> */}

      <Stack spacing={3}>
        {items.map((item) => (
          <LessonCollectionItemCard
            key={item.order}
            item={item}
            isFixedCourse={fixedCourse}
            canDelete={items.length > 1}
            onDelete={() => {
              handleDelete(item.order);
            }}
            onChangeField={(field, val) => {
              handleChange(item.order, field, val);
            }}
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
