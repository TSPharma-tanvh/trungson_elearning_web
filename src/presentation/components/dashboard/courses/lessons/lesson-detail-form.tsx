'use client';

import React, { useEffect, useState } from 'react';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
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
import { useTranslation } from 'react-i18next';

import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

import CustomFieldTypography from '../../../core/text-field/custom-typhography';

interface LessonDetailFormProps {
  open: boolean;
  lessonId: string | null;
  onClose: () => void;
}

function LessonDetails({ lesson, fullScreen }: { lesson: LessonDetailResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [quizExpandedLessons, setQuizExpandedLessons] = useState<Record<string, boolean>>({});
  const [progressExpandedLessons, setProgressExpandedLessons] = useState<Record<string, boolean>>({});
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imageFullscreen, setImageFullscreen] = useState(false);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollmentCriteria = () => {
    if (!lesson.enrollmentCriteria) return null;

    const criteria = lesson.enrollmentCriteria;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('enrollment')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('criteriaId', criteria.id)}
            {renderField('criteriaName', criteria.name)}
            {renderField('criteriaDescription', criteria.desc)}
            {renderField('criteriaTargetType', criteria.targetType)}
            {renderField('criteriaTargetId', criteria.targetID)}
            {renderField('criteriaTargetLevelId', criteria.targetLevelID)}
            {renderField('criteriaMaxCapacity', criteria.maxCapacity)}
            {renderField('criteriaTargetPharmacyId', criteria.targetPharmacyID)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderQuizzes = () => {
    if (!lesson.quizzes || lesson.quizzes.length === 0) return null;

    const toggleExpanded = (lessonId: string) => {
      setQuizExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('quizzes')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {lesson.quizzes.map((quiz, index) => {
          const lessonId = quiz.id ?? `${index}`;
          const isExpanded = quizExpandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={quiz.title ?? `${t('quiz')} ${index + 1}`}
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
                    {renderField('quizId', quiz.id)}
                    {renderField('quizName', quiz.title)}
                    {renderField('quizDetail', quiz.description)}
                    {renderField('quizStatus', quiz.status)}
                    {renderField('quizStartTime', DateTimeUtils.formatISODateStringToString(quiz.startTime ?? ''))}
                    {renderField('quizEndTime', DateTimeUtils.formatISODateStringToString(quiz.endTime ?? ''))}
                    {renderField('quizTotalScore', quiz.totalScore)}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    );
  };

  const renderUserProgress = () => {
    if (!lesson.userLessonProgress || lesson.userLessonProgress.length === 0) return null;

    const toggleExpanded = (lessonId: string) => {
      setProgressExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('userProgress')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {lesson.userLessonProgress.map((progress, index) => {
          const lessonId = progress.id ?? `${index}`;
          const isExpanded = progressExpandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={progress.id ?? `Quiz ${index + 1}`}
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
                    {renderField('progressId', progress.id)}
                    {renderField('progressUserID', progress.userID)}
                    {renderField('progressLessonID', progress.lessonID)}
                    {renderField(
                      'progressStartTime',
                      DateTimeUtils.formatISODateStringToString(progress.startDate ?? '')
                    )}
                    {renderField('progressEndTime', DateTimeUtils.formatISODateStringToString(progress.endDate ?? ''))}
                    {renderField('progressLastAccess', progress.lastAccess)}
                    {renderField('progressStatus', progress.status)}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    );
  };

  const renderVideoPreview = () => {
    if (!lesson.video?.resourceUrl) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('videoPreview')} />
        <CardContent>
          <CustomVideoPlayer src={lesson.video.resourceUrl} fullscreen />
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box
            onClick={() => {
              setImagePreviewOpen(true);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <Avatar src={lesson.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
              {lesson.name?.[0] ?? '?'}
            </Avatar>
          </Box>
          <Typography variant="h5">{lesson.name ?? ''}</Typography>
        </Box>
        <Card sx={{ mb: 2 }}>
          <CardHeader title={t('lessonInformation')} />
          <CardContent>
            <Grid container spacing={2}>
              {renderField('lessonId', lesson.id)}
              {renderField('lessonCourseID', lesson.courseID)}
              {renderField('lessonName', lesson.name)}
              {renderField('lessonDetail', lesson.detail)}
              {renderField('lessonEnablePlay', lesson.enablePlay ? t('yes') : t('no'))}
              {renderField('lessonStatus', t(lesson.status.charAt(0).toLowerCase() + t(lesson.status).slice(1)))}
              {renderField('lessonType', t(lesson.lessonType.charAt(0).toLowerCase() + t(lesson.lessonType).slice(1)))}
              {renderField('lessonEnrollmentCriteriaID', lesson.enrollmentCriteriaID)}
              {renderField('lessonCategoryID', lesson.categoryID)}
              {renderField('lessonThumbnailID', lesson.thumbnailID)}
              {renderField('lessonVideoID', lesson.videoID)}
              {renderField('lessonCategoryName', lesson.category?.categoryName)}
              {renderField('lessonThumbnailFileName', lesson.thumbnail?.name)}
              {renderField('lessonVideoFileName', lesson.video?.name)}
            </Grid>
          </CardContent>
        </Card>
        {renderVideoPreview()}
        {renderEnrollmentCriteria()}
        {renderQuizzes()}
        {renderUserProgress()}
      </Box>
      <ImagePreviewDialog
        open={imagePreviewOpen}
        onClose={() => {
          setImagePreviewOpen(false);
        }}
        imageUrl={lesson.thumbnail?.resourceUrl || ''}
        title={lesson.name || t('thumbnailPreview')}
        fullscreen={imageFullscreen}
        onToggleFullscreen={() => {
          setImageFullscreen((prev) => !prev);
        }}
      />
    </>
  );
}

export default function LessonDetailForm({ open, lessonId, onClose }: LessonDetailFormProps) {
  const { t } = useTranslation();
  const { lessonUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [Lesson, setLesson] = useState<LessonDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && lessonId && lessonUsecase) {
      setLoading(true);
      lessonUsecase
        .getLessonById(lessonId)
        .then(setLesson)
        .catch(() => {
          setLesson(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, lessonId, lessonUsecase]);

  if (!lessonId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('lessonDetails')}</Typography>
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
        {loading || !Lesson ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <LessonDetails lesson={Lesson} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
