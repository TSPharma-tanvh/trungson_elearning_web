'use client';

import React, { useEffect, useState } from 'react';
import { QuizzesCollectionUpdateDetailRequest } from '@/domain/models/lessons/request/lesson-collection-update-request';
import { QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { Add, ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { QuizSingleSelectAndCreateDialog } from './quiz-single-select-and-create-form';

interface QuizOrderCollectionUpdateProps {
  value: QuizzesCollectionUpdateDetailRequest[];
  onChange: (val: QuizzesCollectionUpdateDetailRequest[]) => void;
  label?: string;
  quizUsecase: QuizUsecase;
}

export function QuizOrderCollectionUpdateForm({ value, onChange, label, quizUsecase }: QuizOrderCollectionUpdateProps) {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState<QuizzesCollectionUpdateDetailRequest[]>(
    value.map((q, idx) => new QuizzesCollectionUpdateDetailRequest({ ...q, order: idx + 1 }))
  );

  useEffect(() => {
    setQuizzes(value.map((q, idx) => new QuizzesCollectionUpdateDetailRequest({ ...q, order: idx + 1 })));
  }, [value]);

  const updateQuizId = (idx: number, quizId: string | null) => {
    const cloned = [...quizzes];
    cloned[idx] = new QuizzesCollectionUpdateDetailRequest({ ...cloned[idx], quizId: quizId || '' });
    setQuizzes(cloned);
    onChange(cloned);
  };

  const addQuiz = () => {
    const newQuiz = new QuizzesCollectionUpdateDetailRequest({ quizId: '', order: quizzes.length + 1 });
    const updated = [...quizzes, newQuiz];
    setQuizzes(updated);
    onChange(updated);
  };

  const removeQuiz = (idx: number) => {
    const cloned = [...quizzes];
    cloned.splice(idx, 1);
    const reIndexed = cloned.map((q, i) => new QuizzesCollectionUpdateDetailRequest({ ...q, order: i + 1 }));
    setQuizzes(reIndexed);
    onChange(reIndexed);
  };

  const moveQuiz = (idx: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIndex < 0 || targetIndex >= quizzes.length) return;
    const cloned = [...quizzes];
    [cloned[idx], cloned[targetIndex]] = [cloned[targetIndex], cloned[idx]];
    const reIndexed = cloned.map((q, i) => new QuizzesCollectionUpdateDetailRequest({ ...q, order: i + 1 }));
    setQuizzes(reIndexed);
    onChange(reIndexed);
  };

  return (
    <Box>
      {label && (
        <Typography fontWeight={600} mb={2} mt={2}>
          {label}
        </Typography>
      )}

      <Stack spacing={1}>
        {quizzes.map((quiz, idx) => (
          <Box
            key={idx}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={1}
            border="1px solid #e0e0e0"
            borderRadius={2}
          >
            <Box flex={1} mr={2} padding={1}>
              <QuizSingleSelectAndCreateDialog
                quizUsecase={quizUsecase}
                value={quiz.quizId}
                onChange={(quizId) => updateQuizId(idx, quizId)}
              />
            </Box>

            <Box display="flex" gap={1}>
              <IconButton size="small" disabled={idx === 0} onClick={() => moveQuiz(idx, 'up')}>
                <ArrowUpward fontSize="small" />
              </IconButton>
              <IconButton size="small" disabled={idx === quizzes.length - 1} onClick={() => moveQuiz(idx, 'down')}>
                <ArrowDownward fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => removeQuiz(idx)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Stack>

      <Box mt={1}>
        <Button variant="outlined" startIcon={<Add />} onClick={addQuiz}>
          {t('addQuiz')}
        </Button>
      </Box>
    </Box>
  );
}
