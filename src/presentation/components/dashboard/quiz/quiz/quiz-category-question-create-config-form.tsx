'use client';

import React from 'react';
import { QuizCategoryConfigCreate } from '@/domain/models/quiz/request/create-quiz-request';
import { CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { CategoryEnum } from '@/utils/enum/core-enum';
import { Add, Delete } from '@mui/icons-material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { QuestionCategorySelect } from '@/presentation/components/shared/category/question-category-select';

interface QuizCategoryConfigCreateFormProps {
  value: QuizCategoryConfigCreate[];
  onChange: (value: QuizCategoryConfigCreate[]) => void;
  categoryUsecase: CategoryUsecase | null;
}

export function QuizCategoryConfigCreateForm({ value, onChange, categoryUsecase }: QuizCategoryConfigCreateFormProps) {
  const { t } = useTranslation();

  const updateItems = (next: QuizCategoryConfigCreate[]) => {
    onChange(next.map((i, idx) => new QuizCategoryConfigCreate({ ...i, order: idx + 1 })));
  };

  const addItem = () => {
    updateItems([
      ...value,
      new QuizCategoryConfigCreate({
        order: value.length + 1,
      }),
    ]);
  };

  const removeItem = (order: number) => {
    updateItems(value.filter((i) => i.order !== order));
  };

  const moveItem = (order: number, direction: 'up' | 'down') => {
    const index = value.findIndex((i) => i.order === order);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= value.length) return;

    const cloned = [...value];
    [cloned[index], cloned[targetIndex]] = [cloned[targetIndex], cloned[index]];
    updateItems(cloned);
  };

  const updateField = <K extends keyof QuizCategoryConfigCreate>(
    order: number,
    field: K,
    fieldValue: QuizCategoryConfigCreate[K]
  ) => {
    updateItems(
      value.map((i) => (i.order === order ? new QuizCategoryConfigCreate({ ...i, [field]: fieldValue }) : i))
    );
  };

  return (
    <Box mt={0}>
      <Stack spacing={3}>
        {value.map((item) => (
          <Card key={item.order} variant="outlined">
            <CardContent>
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography fontWeight={600}>
                  {t('questionBank')} {item.order}
                </Typography>

                <Box>
                  <IconButton size="small" disabled={item.order === 1} onClick={() => moveItem(item.order, 'up')}>
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    disabled={item.order === value.length}
                    onClick={() => moveItem(item.order, 'down')}
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    color="error"
                    size="small"
                    disabled={value.length === 1}
                    onClick={() => removeItem(item.order)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <QuestionCategorySelect
                    categoryUsecase={categoryUsecase}
                    value={item.categoryID}
                    onChange={(v) => updateField(item.order, 'categoryID', v)}
                    categoryEnum={CategoryEnum.Question}
                    label={t('questionBank')}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label={t('displayedQuestionCount')}
                    value={item.displayedQuestionCount?.toString() ?? ''}
                    onChange={(v) => updateField(item.order, 'displayedQuestionCount', v === '' ? 0 : Number(v))}
                    inputMode="numeric"
                    required
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Box mt={3}>
        <Button variant="outlined" startIcon={<Add />} onClick={addItem}>
          {t('addQuestionBank')}
        </Button>
      </Box>
    </Box>
  );
}
