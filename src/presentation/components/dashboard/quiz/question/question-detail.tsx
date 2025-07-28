'use client';

import React, { useEffect, useState } from 'react';
import { type QuestionResponse } from '@/domain/models/question/response/question-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
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
  useTheme,
} from '@mui/material';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

interface QuestionDetailsProps {
  open: boolean;
  questionId: string | null;
  onClose: () => void;
}

function QuestionDetails({ question, fullScreen }: { question: QuestionResponse; fullScreen: boolean }) {
  const theme = useTheme();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  const [previewFullScreen, setPreviewFullScreen] = useState(false);

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
                titleTypographyProps={{
                  sx: {
                    fontSize: 18,
                    color: answer.isCorrect ? theme.palette.primary.light : theme.palette.error.main,
                  },
                }}
                action={
                  <IconButton
                    onClick={() => {
                      toggleExpanded(lessonId);
                    }}
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

  const renderFileResources = () => {
    if (!question.fileQuestionRelation?.length) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Attached Files" />
        <CardContent>
          <Grid container spacing={2}>
            {question.fileQuestionRelation.map((r) => {
              const res = r.fileResources;
              if (!res) return null;

              const isImage = res.type?.startsWith('image');
              const isVideo = res.type?.startsWith('video');
              const isOther = !isImage && !isVideo;

              return (
                <Grid item xs={12} sm={fullScreen ? 4 : 6} key={res.id}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%',
                      borderRadius: 1,
                      overflow: 'hidden',
                      mb: 1,
                    }}
                  >
                    {isImage ? (
                      <Box
                        component="img"
                        src={res.resourceUrl}
                        alt={res.name}
                        onClick={() => {
                          setPreviewUrl(res.resourceUrl ?? '');
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                      />
                    ) : null}

                    {isVideo ? (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <CustomVideoPlayer src={res.resourceUrl ?? ''} fullscreen={fullScreen} />
                      </Box>
                    ) : null}

                    {isOther ? (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">No preview</Typography>
                      </Box>
                    ) : null}
                  </Box>

                  <Typography variant="body2" noWrap>
                    {res.name}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>

          {/* Preview image modal */}
          {previewUrl ? (
            <ImagePreviewDialog
              open={Boolean(previewUrl)}
              onClose={() => {
                setPreviewUrl(null);
              }}
              imageUrl={previewUrl}
              title="Image Preview"
              fullscreen={previewFullScreen}
              onToggleFullscreen={() => {
                setPreviewFullScreen((prev) => !prev);
              }}
            />
          ) : null}
        </CardContent>
      </Card>
    );
  };

  const renderCategory = () => {
    if (!question.category) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Category" />
        <CardContent>
          <Box key={question.category.id}>
            <Grid container spacing={2}>
              {renderField('ID', question.category.id)}
              {renderField('Name', question.category.categoryName)}
              {renderField('Description', question.category.description)}
            </Grid>
          </Box>
        </CardContent>
      </Card>
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
            {renderField('questionText', question.questionText)}
            {renderField('point', question.point)}
            {renderField('canShuffle', question.canShuffle ? 'Yes' : 'No')}
            {renderField('totalAnswer', question.totalAnswer)}
            {renderField('questionType', question.questionType)}
            {renderField('Category ID', question.categoryId)}
            {renderField('Thumbnail ID', question.thumbnailId)}
          </Grid>
        </CardContent>
      </Card>
      {renderCategory()}
      {renderAnswers()}
      {renderFileResources()}
    </Box>
  );
}

export default function QuestionDetailForm({ open, questionId, onClose }: QuestionDetailsProps) {
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
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
          setQuestion(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, questionId, questionUsecase]);

  if (!questionId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Question Information</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
          >
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
