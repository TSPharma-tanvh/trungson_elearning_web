'use client';

import React, { useEffect, useState } from 'react';
import { LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
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

import CustomFieldTypography from '../../../core/text-field/custom-typhography';

interface Props {
  open: boolean;
  lessonId: string | null;
  onClose: () => void;
}

function LessonDetails({ lesson: lesson, fullScreen }: { lesson: LessonDetailResponse; fullScreen: boolean }) {
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollmentCriteria = () => {
    if (!lesson.enrollmentCriteria) return null;

    const criteria = lesson.enrollmentCriteria;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Enrollment Criteria" />
        <CardContent>
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
        </CardContent>
      </Card>
    );
  };

  const renderQuizzes = () => {
    if (!lesson.quizzes || lesson.quizzes.length === 0) return null;

    const [expandedLessons, setExpandedLessons] = useState<{ [key: string]: boolean }>({});

    const toggleExpanded = (lessonId: string) => {
      setExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title="Quizzes" sx={{ pl: 2, pb: 1, mb: 2 }} />
        {lesson.quizzes.map((quiz, index) => {
          const lessonId = quiz.id ?? `${index}`;
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
                title={quiz.title ?? `Quiz ${index + 1}`}
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
                    {renderField('ID', quiz.id)}
                    {renderField('Name', quiz.title)}
                    {renderField('Detail', quiz.description)}
                    {renderField('Status', quiz.status)}
                    {renderField('Start Time', DateTimeUtils.formatISODateFromString(quiz.startTime ?? ''))}
                    {renderField('End Time', DateTimeUtils.formatISODateFromString(quiz.endTime ?? ''))}
                    {renderField('Total Score', quiz.totalScore)}
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

    const [expandedLessons, setExpandedLessons] = useState<{ [key: string]: boolean }>({});

    const toggleExpanded = (lessonId: string) => {
      setExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title="User Progress" sx={{ pl: 2, pb: 1, mb: 2 }} />
        {lesson.userLessonProgress.map((progress, index) => {
          const lessonId = progress.id ?? `${index}`;
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
                title={progress.id ?? `Quiz ${index + 1}`}
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
                    {renderField('ID', progress.id)}
                    {renderField('userID', progress.userID)}
                    {renderField('lessonID', progress.lessonID)}
                    {renderField('Start Time', DateTimeUtils.formatISODateFromString(progress.startDate ?? ''))}
                    {renderField('End Time', DateTimeUtils.formatISODateFromString(progress.endDate ?? ''))}
                    {renderField('Total Score', progress.lastAccess)}
                    {renderField('Status', progress.status)}
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
        <Avatar src={lesson.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {lesson.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{lesson.name ?? 'Unnamed Lesson'}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Lesson Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', lesson.id)}
            {renderField('Course ID', lesson.courseID)}
            {renderField('Name', lesson.name)}
            {renderField('Detail', lesson.detail)}
            {renderField('Enable Play', lesson.enablePlay ? 'Yes' : 'No')}
            {renderField('Status', lesson.status)}
            {renderField('Lesson Type', lesson.lessonType)}
            {renderField('Enrollment Criteria ID', lesson.enrollmentCriteriaID)}
            {renderField('Category ID', lesson.categoryID)}
            {renderField('Thumbnail ID', lesson.thumbnailID)}
            {renderField('Video ID', lesson.videoID)}
            {renderField('Category Name', lesson.category?.categoryName)}
            {renderField('Thumbnail File Name', lesson.thumbnail?.name)}
            {renderField('Video File Name', lesson.video?.name)}
          </Grid>
        </CardContent>
      </Card>
      {renderEnrollmentCriteria()}
      {renderQuizzes()}
    </Box>
  );
}

export default function LessonDetailForm({ open, lessonId, onClose }: Props) {
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
        .catch((error) => {
          console.error('Error fetching Lesson details:', error);
          setLesson(null);
        })
        .finally(() => setLoading(false));
    }
  }, [open, lessonId, lessonUsecase]);

  if (!lessonId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Lesson Details</Typography>
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
