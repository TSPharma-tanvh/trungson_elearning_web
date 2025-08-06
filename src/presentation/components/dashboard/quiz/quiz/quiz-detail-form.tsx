'use client';

import React, { useEffect, useState } from 'react';
import { type UserQuestionResponse } from '@/domain/models/question/response/user-question-response';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
import { useTranslation } from 'react-i18next';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

import QuestionInformationForm from '../../../shared/quiz/question/question-information-form';

interface QuizDetailFormProps {
  open: boolean;
  quizId: string | null;
  onClose: () => void;
}

function QuizDetails({ quiz, fullScreen }: { quiz: QuizResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = React.useState<UserQuestionResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const [previewFullScreen, setPreviewFullScreen] = useState(false);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 3 : 4}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollmentCriteria = () => {
    if (!quiz.enrollmentCriteria || quiz.enrollmentCriteria.length === 0) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="enrollmentCriteria" />
        <CardContent>
          {quiz.enrollmentCriteria.map((criteria, index) => (
            <Box key={criteria.id ?? index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                criteriaNumber #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                {renderField('id', criteria.id)}
                {renderField('name', criteria.name)}
                {renderField('description', criteria.desc)}
                {renderField('targetType', criteria.targetType)}
                {renderField('targetId', criteria.targetID)}
                {renderField('targetLevelId', criteria.targetLevelID)}
                {renderField('maxCapacity', criteria.maxCapacity)}
                {renderField('targetPharmacyId', criteria.targetPharmacyID)}
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderQuestions = () => {
    if (!quiz.quizQuestions || quiz.quizQuestions.length === 0) return null;

    const toggleExpanded = (lessonId: string) => {
      setExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('quizzes')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {quiz.quizQuestions.map((question, index) => {
          const lessonId = question.question?.id ?? `${t('lesson')}-${index}`;
          const isExpanded = expandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={question.question?.questionText ?? `${t('lesson')} ${index + 1}`}
                action={
                  <Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (question.question) {
                          setSelectedQuestion(question.question ?? null);
                        }
                        setViewOpen(true);
                      }}
                      sx={{
                        transition: 'transform 0.2s',
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>

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
                  </Box>
                }
                sx={{ py: 1 }}
              />

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Grid container spacing={2}>
                    {renderField('id', question.question?.id)}
                    {renderField('detail', question.question?.questionText)}
                    {renderField(
                      'questionType',
                      question.question?.questionType
                        ? t(
                            question.question?.questionType.charAt(0).toLowerCase() +
                              t(question.question?.questionType).slice(1)
                          )
                        : ''
                    )}
                    {renderField('point', question.question?.point)}
                    {renderField('canShuffle', question.question?.canShuffle)}
                    {renderField('totalAnswer', question.question?.totalAnswer)}
                    {renderField('status', question.question?.status)}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    );
  };

  const renderFiles = () => {
    if (!quiz.fileQuizRelation?.length) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Attached Files" />
        <CardContent>
          <Grid container spacing={2}>
            {quiz.fileQuizRelation.map((r) => {
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
                        <Typography variant="body2">{t('noPreview')}</Typography>
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
              title={t('imagePreview')}
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

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={quiz.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {quiz.title?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{quiz.title ?? ''}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('quizInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', quiz.id)}
            {renderField('title', quiz.title)}
            {renderField('description', quiz.description)}
            {renderField('status', quiz.status)}
            {renderField('startTime', quiz.startTime ? DateTimeUtils.formatISODateFromDate(quiz.startTime) : undefined)}
            {renderField('endTime', quiz.endTime ? DateTimeUtils.formatISODateFromDate(quiz.endTime) : undefined)}
            {renderField('totalScore', quiz.totalScore)}
            {renderField('time', quiz.time)}
            {renderField(
              'type',
              quiz.type ? t(quiz.type.toString().charAt(0).toLowerCase() + t(quiz.type.toString().slice(1))) : ''
            )}
            {renderField('scoreToPass', quiz.scoreToPass)}
            {renderField('maxAttempts', quiz.maxAttempts)}
            {renderField('canStartOver', quiz.canStartOver ? t('yes') : t('no'))}
            {renderField('canShuffle', quiz.canShuffle ? t('yes') : t('no'))}
            {renderField('isRequired', quiz.isRequired ? t('yes') : t('no'))}
            {renderField('isAutoSubmitted', quiz.isAutoSubmitted ? t('yes') : t('no'))}
          </Grid>
        </CardContent>
      </Card>
      {renderEnrollmentCriteria()}
      {renderQuestions()}
      {renderFiles()}

      {/* question details */}
      {selectedQuestion ? (
        <QuestionInformationForm
          open={viewOpen}
          questionId={selectedQuestion?.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </Box>
  );
}

export default function QuizDetailForm({ open, quizId, onClose }: QuizDetailFormProps) {
  const { t } = useTranslation();
  const { quizUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [course, setQuiz] = useState<QuizResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && quizId && quizUsecase) {
      setLoading(true);
      quizUsecase
        .getQuizById(quizId)
        .then(setQuiz)
        .catch(() => {
          setQuiz(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, quizId, quizUsecase]);

  if (!quizId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('quizDetails')}</Typography>
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
        {loading || !course ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <QuizDetails quiz={course} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
