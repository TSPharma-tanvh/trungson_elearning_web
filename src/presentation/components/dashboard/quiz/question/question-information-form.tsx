'use client';

import React, { useEffect, useState } from 'react';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { DateTimeUtils } from '@/utils/date-time-utils';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

interface Props {
  open: boolean;
  questionId: string | null;
  onClose: () => void;
}

function QuestionDetails({ question, fullScreen }: { question: QuestionResponse; fullScreen: boolean }) {
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderAnswers = () => {
    if (!question.answers || question.answers.length === 0) return null;

    const [expandedAnswers, setExpandedAnswers] = useState<{ [key: string]: boolean }>({});

    const toggleExpanded = (lessonId: string) => {
      setExpandedAnswers((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title="Answers" sx={{ pl: 2, pb: 1, mb: 2 }} />
        {question.answers.map((answer, index) => {
          const lessonId = answer.id ?? `lesson-${index}`;
          const isExpanded = expandedAnswers[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={answer.answerText ?? `Answer ${index + 1}`}
                action={
                  <IconButton
                    onClick={() => toggleExpanded(lessonId)}
                    sx={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                }
                sx={{ py: 1 }}
              />
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Grid container spacing={2}>
                    {renderField('ID', answer.id)}
                    {renderField('Detail', answer.answerText)}
                    {renderField('isCorrect', answer.isCorrect)}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={question.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {question.questionText?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{question.questionText ?? 'Unnamed Question'}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Question Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', question.id)}

            {/* {renderField(
              'Start Time',
              question.startTime ? DateTimeUtils.formatISODateFromDate(question.startTime) : undefined
            )}
            {renderField(
              'End Time',
              question.endTime ? DateTimeUtils.formatISODateFromDate(question.endTime) : undefined
            )} */}
            {/* {renderField('Enrollment Criteria ID', question.enrollmentCriteria)} */}
            {renderField('Category ID', question.categoryId)}
            {renderField('Thumbnail ID', question.thumbnailId)}
          </Grid>
        </CardContent>
      </Card>
      {renderAnswers()}
    </Box>
  );
}

export default function QuestionInformationForm({ open, questionId, onClose }: Props) {
  const { questionUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && questionId && questionUsecase) {
      setLoading(true);
      questionUsecase
        .getQuestionById(questionId)
        .then(setQuestion)
        .catch((error) => {
          console.error('Error fetching question details:', error);
          setQuestion(null);
        })
        .finally(() => setLoading(false));
    }
  }, [open, questionId, questionUsecase]);

  if (!questionId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Question Details</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !question ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <QuestionDetails question={question} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
