'use client';

import React, { useEffect, useState } from 'react';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
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

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

interface CourseDetailProps {
  open: boolean;
  courseId: string | null;
  onClose: () => void;
}

function CourseDetails({ course, fullScreen }: { course: CourseDetailResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [courseExpandedLessons, setCourseExpandedLessons] = useState<Record<string, boolean>>({});

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderCoursePath = () => {
    const coursePath = course.coursePath;
    if (!coursePath) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('coursePathInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', coursePath.id)}
            {renderField('name', coursePath.name)}
            {renderField('detail', coursePath.detail)}
            {renderField('isRequired', coursePath.isRequired ? 'Yes' : 'No')}
            {renderField(
              'startTime',
              coursePath.startTime ? DateTimeUtils.formatISODateFromString(coursePath.startTime) : undefined
            )}
            {renderField(
              'endTime',
              coursePath.endTime ? DateTimeUtils.formatISODateFromString(coursePath.endTime) : undefined
            )}
            {renderField('status', coursePath.status)}
            {renderField('displayType', coursePath.displayType)}
            {renderField('categoryId', coursePath.categoryID)}
            {renderField('thumbnailId', coursePath.thumbnailID)}
          </Grid>
        </CardContent>
      </Card>
    );
  };
  const renderEnrollmentCriteria = () => {
    if (!course.courseEnrollments || course.courseEnrollments.length === 0) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('criteria')} />
        <CardContent>
          {course.courseEnrollments.map((relation, index) => {
            const criteria = relation.enrollmentCriteria;
            if (!criteria) return null;

            return (
              <Box key={relation.id ?? index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {t('criteria')} #{index + 1}
                </Typography>
                <Grid container spacing={2}>
                  {renderField('relationId', relation.id)}
                  {renderField('criteriaId', criteria.id)}
                  {renderField('name', criteria.name)}
                  {renderField('description', criteria.desc)}
                  {renderField('targetType', criteria.targetType)}
                  {renderField('targetID', criteria.targetID)}
                  {renderField('targetLevelID', criteria.targetLevelID)}
                  {renderField('maxCapacity', criteria.maxCapacity)}
                  {renderField('targetPharmacyID', criteria.targetPharmacyID)}
                </Grid>
              </Box>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const renderLessons = () => {
    if (!course.lessons || course.lessons.length === 0) return null;

    const toggleExpanded = (lessonId: string) => {
      setCourseExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('lessons')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {course.lessons.map((lesson, index) => {
          const lessonId = lesson.id ?? `lesson-${index}`;
          const isExpanded = courseExpandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={lesson.name ?? `Lesson ${index + 1}`}
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
                    {renderField('id', lesson.id)}
                    {renderField('detail', lesson.detail)}
                    {renderField('enablePlay', lesson.enablePlay ? 'Yes' : 'No')}
                    {renderField('status', lesson.status)}
                    {renderField('lessonType', lesson.lessonType)}
                    {renderField('enrollmentCriteriaID', lesson.enrollmentCriteriaID)}
                    {renderField('categoryID', lesson.categoryID)}
                    {renderField('thumbnailID', lesson.thumbnailID)}
                    {renderField('videoID', lesson.videoID)}
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
        <Avatar src={course.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {course.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{course.name ?? t('unnamedCourse')}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('courseInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', course.id)}
            {renderField('name', course.name)}
            {renderField('detail', course.detail)}
            {renderField('isRequired', course.isRequired ? t('yes') : t('no'))}
            {renderField('courseType', course.courseType)}
            {renderField('displayType', course.displayType)}
            {renderField('disableStatus', course.disableStatus)}
            {renderField('scheduleStatus', course.scheduleStatus)}
            {renderField('teacherId', course.teacherId)}
            {renderField('meetingLink', course.meetingLink)}
            {renderField(
              'startTime',
              course.startTime ? DateTimeUtils.formatISODateFromDate(course.startTime) : undefined
            )}
            {renderField('endTime', course.endTime ? DateTimeUtils.formatISODateFromDate(course.endTime) : undefined)}
            {/* {renderField('enrollmentCriteriaId', course.enrollmentCriteria.id)} */}
            {renderField('categoryId', course.categoryId)}
            {renderField('thumbnailId', course.thumbnailId)}
          </Grid>
        </CardContent>
      </Card>
      {renderCoursePath()}
      {renderEnrollmentCriteria()}
      {renderLessons()}
    </Box>
  );
}

export default function CourseDetailForm({ open, courseId, onClose }: CourseDetailProps) {
  const { t } = useTranslation();
  const { courseUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && courseId && courseUsecase) {
      setLoading(true);
      courseUsecase
        .getCourseById(courseId)
        .then(setCourse)
        .catch(() => {
          setCourse(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, courseId, courseUsecase]);

  if (!courseId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('courseDetails')}</Typography>
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
          <CourseDetails course={course} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
