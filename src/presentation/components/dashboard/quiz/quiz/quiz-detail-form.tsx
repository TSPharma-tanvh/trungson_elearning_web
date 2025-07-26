'use client';

import React, { useEffect, useState } from 'react';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
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

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

import QuestionInformationForm from '../../../shared/quiz/question/question-information-form';

interface Props {
  open: boolean;
  quizId: string | null;
  onClose: () => void;
}

function QuizDetails({ quiz, fullScreen }: { quiz: QuizResponse; fullScreen: boolean }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = React.useState<UserQuestionResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 3 : 4}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollmentCriteria = () => {
    if (!quiz.enrollmentCriteria || quiz.enrollmentCriteria.length === 0) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Enrollment Criteria" />
        <CardContent>
          {quiz.enrollmentCriteria.map((criteria, index) => (
            <Box key={criteria.id ?? index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Criteria #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                {renderField('ID', criteria.id)}
                {renderField('Name', criteria.name)}
                {renderField('Description', criteria.desc)}
                {renderField('Target Type', criteria.targetType)}
                {renderField('Target ID', criteria.targetID)}
                {renderField('Target Level ID', criteria.targetLevelID)}
                {renderField('Max Capacity', criteria.maxCapacity)}
                {renderField('Target Pharmacy ID', criteria.targetPharmacyID)}
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderQuestions = () => {
    if (!quiz.quizQuestions || quiz.quizQuestions.length === 0) return null;

    const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});

    const toggleExpanded = (lessonId: string) => {
      setExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title="Quizzes" sx={{ pl: 2, pb: 1, mb: 2 }} />
        {quiz.quizQuestions.map((question, index) => {
          const lessonId = question.question?.id ?? `lesson-${index}`;
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
                title={question.question?.questionText ?? `Lesson ${index + 1}`}
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
                      onClick={() => { toggleExpanded(lessonId); }}
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
                    {renderField('ID', question.question?.id)}
                    {renderField('Detail', question.question?.questionText)}
                    {renderField('questionType', question.question?.questionType)}
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
                    {isImage ? <Box
                        component="img"
                        src={res.resourceUrl}
                        alt={res.name}
                        onClick={() => { setPreviewUrl(res.resourceUrl ?? ''); }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                      /> : null}

                    {isVideo ? <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <CustomVideoPlayer src={res.resourceUrl ?? ''} fullscreen={fullScreen} />
                      </Box> : null}

                    {isOther ? <Box
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
                      </Box> : null}
                  </Box>

                  <Typography variant="body2" noWrap>
                    {res.name}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>

          {/* Preview image modal */}
          {previewUrl ? <ImagePreviewDialog
              open={Boolean(previewUrl)}
              onClose={() => { setPreviewUrl(null); }}
              imageUrl={previewUrl}
              title="Image Preview"
              fullscreen={fullScreen}
              onToggleFullscreen={() => {}}
            /> : null}
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
        <Typography variant="h5">{quiz.title ?? 'Unnamed Quiz'}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Quiz Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', quiz.id)}
            {renderField('Title', quiz.title)}
            {renderField('Description', quiz.description)}
            {renderField('Status', quiz.status)}
            {renderField(
              'Start Time',
              quiz.startTime ? DateTimeUtils.formatISODateFromDate(quiz.startTime) : undefined
            )}
            {renderField('End Time', quiz.endTime ? DateTimeUtils.formatISODateFromDate(quiz.endTime) : undefined)}
            {renderField('Total Score', quiz.totalScore)}
            {renderField('time', quiz.time)}
            {renderField('type', quiz.type)}
            {renderField('scoreToPass', quiz.scoreToPass)}
            {renderField('scoreToPass', quiz.scoreToPass)}
            {renderField('maxAttempts', quiz.maxAttempts)}
            {renderField('canStartOver', quiz.canStartOver ? 'Yes' : 'No')}
            {renderField('canShuffle', quiz.canShuffle ? 'Yes' : 'No')}
            {renderField('isRequired', quiz.isRequired ? 'Yes' : 'No')}
            {renderField('isAutoSubmitted', quiz.isAutoSubmitted ? 'Yes' : 'No')}
          </Grid>
        </CardContent>
      </Card>
      {renderEnrollmentCriteria()}
      {renderQuestions()}
      {renderFiles()}

      {/* question details */}
      {selectedQuestion ? <QuestionInformationForm
          open={viewOpen}
          questionId={selectedQuestion?.id ?? null}
          onClose={() => { setViewOpen(false); }}
        /> : null}
    </Box>
  );
}

export default function QuizDetailForm({ open, quizId, onClose }: Props) {
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
        .catch((error) => {
          console.error('Error fetching course details:', error);
          setQuiz(null);
        })
        .finally(() => { setLoading(false); });
    }
  }, [open, quizId, quizUsecase]);

  if (!quizId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Quiz Details</Typography>
        <Box>
          <IconButton onClick={() => { setFullScreen((prev) => !prev); }}>
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
