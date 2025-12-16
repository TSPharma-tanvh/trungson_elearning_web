'use client';

import React, { useEffect, useState } from 'react';
import { QuizzesCollectionCreateDetailRequest } from '@/domain/models/courses/request/create-course-request';
import { QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { Add, ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { QuizSingleSelectAndCreateDialog } from './quiz-single-select-and-create-form';

interface QuizOrderEditorProps {
  value: QuizzesCollectionCreateDetailRequest[];
  onChange: (val: QuizzesCollectionCreateDetailRequest[]) => void;
  label?: string;
  quizUsecase: QuizUsecase;
}

export function QuizOrderCollectionCreateForm({ value, onChange, label, quizUsecase }: QuizOrderEditorProps) {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState<QuizzesCollectionCreateDetailRequest[]>(
    value.map((q, idx) => new QuizzesCollectionCreateDetailRequest({ ...q, order: idx + 1 }))
  );

  useEffect(() => {
    setQuizzes(value.map((q, idx) => new QuizzesCollectionCreateDetailRequest({ ...q, order: idx + 1 })));
  }, [value]);

  const updateQuizId = (idx: number, quizId: string | null) => {
    const cloned = [...quizzes];
    cloned[idx] = new QuizzesCollectionCreateDetailRequest({ ...cloned[idx], quizId: quizId || '' });
    setQuizzes(cloned);
    onChange(cloned);
  };

  const addQuiz = () => {
    const newQuiz = new QuizzesCollectionCreateDetailRequest({ quizId: '', order: quizzes.length + 1 });
    const updated = [...quizzes, newQuiz];
    setQuizzes(updated);
    onChange(updated);
  };

  const removeQuiz = (idx: number) => {
    const cloned = [...quizzes];
    cloned.splice(idx, 1);
    const reIndexed = cloned.map((q, i) => new QuizzesCollectionCreateDetailRequest({ ...q, order: i + 1 }));
    setQuizzes(reIndexed);
    onChange(reIndexed);
  };

  const moveQuiz = (idx: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIndex < 0 || targetIndex >= quizzes.length) return;
    const cloned = [...quizzes];
    [cloned[idx], cloned[targetIndex]] = [cloned[targetIndex], cloned[idx]];
    const reIndexed = cloned.map((q, i) => new QuizzesCollectionCreateDetailRequest({ ...q, order: i + 1 }));
    setQuizzes(reIndexed);
    onChange(reIndexed);
  };

  return (
    <Box>
      {label && (
        <Typography fontWeight={600} mb={1}>
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
            borderRadius={1}
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
