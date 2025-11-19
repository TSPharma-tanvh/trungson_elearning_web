'use client';

import React from 'react';
import { CreateLessonCollectionLessonDetailRequest } from '@/domain/models/courses/request/create-course-lesson-collection-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import {
  Add as AddIcon,
  ArrowDownward as ArrowDown,
  ArrowUpward as ArrowUp,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { LessonSingleSelectAndCreateDialog } from '@/presentation/components/shared/courses/lessons/lesson-single-select-and-create-form';

interface LessonOrderEditorProps {
  value: CreateLessonCollectionLessonDetailRequest[];
  onChange: (value: CreateLessonCollectionLessonDetailRequest[]) => void;
  label?: string;
}

function LessonOrderEditorComponent({
  value: lessons,
  onChange,
  label = 'lessonsInCollection',
}: LessonOrderEditorProps) {
  const { t } = useTranslation();
  const { lessonUsecase } = useDI();

  const handleLessonChange = (index: number, lessonId: string) => {
    const updated = [...lessons];
    updated[index] = new CreateLessonCollectionLessonDetailRequest({
      lessonId,
      order: index + 1,
    });
    onChange(updated);
  };

  const handleAdd = () => {
    const updated = [
      ...lessons,
      new CreateLessonCollectionLessonDetailRequest({
        lessonId: '',
        order: lessons.length + 1,
      }),
    ];
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const filtered = lessons.filter((_, i) => i !== index);
    const reindexed = filtered.map(
      (item, i) =>
        new CreateLessonCollectionLessonDetailRequest({
          lessonId: item.lessonId,
          order: i + 1,
        })
    );
    onChange(reindexed);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...lessons];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((item, i) => (item.order = i + 1));
    onChange([...updated]);
  };

  const moveDown = (index: number) => {
    if (index >= lessons.length - 1) return;
    const updated = [...lessons];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((item, i) => (item.order = i + 1));
    onChange([...updated]);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {t(label)}
      </Typography>

      <Stack spacing={2}>
        {lessons.map((lesson, index) => (
          <Card key={index} variant="outlined">
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>{index + 1}</Typography>

                <LessonSingleSelectAndCreateDialog
                  lessonUsecase={lessonUsecase}
                  value={lesson.lessonId}
                  onChange={(id) => {
                    handleLessonChange(index, id);
                  }}
                  label={t('selectLesson')}
                />

                <IconButton
                  onClick={() => {
                    moveUp(index);
                  }}
                  disabled={index === 0}
                >
                  <ArrowUp fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() => {
                    moveDown(index);
                  }}
                  disabled={index === lessons.length - 1}
                >
                  <ArrowDown fontSize="small" />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => {
                    handleRemove(index);
                  }}
                  disabled={lessons.length === 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Box mt={3}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAdd}>
          {t('addLesson')}
        </Button>
      </Box>
    </Box>
  );
}

export const LessonOrderEditor = React.memo(LessonOrderEditorComponent);
