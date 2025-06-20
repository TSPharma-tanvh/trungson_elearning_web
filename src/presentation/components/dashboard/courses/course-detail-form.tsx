'use client';

import React, { useEffect, useState } from 'react';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
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

import CustomFieldTypography from '../../core/text-field/custom-typhography';

interface Props {
  open: boolean;
  courseId: string | null;
  onClose: () => void;
}

function CourseDetails({ course, fullScreen }: { course: CourseDetailResponse; fullScreen: boolean }) {
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollmentCriteria = () => {
    if (!course.enrollmentCriteria) return null;
    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Enrollment Criteria" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', course.enrollmentCriteria.id)}
            {renderField('Name', course.enrollmentCriteria.name)}
            {renderField('Description', course.enrollmentCriteria.desc)}
            {renderField('Target Type', course.enrollmentCriteria.targetType)}
            {renderField('Target ID', course.enrollmentCriteria.targetID)}
            {renderField('Target Level ID', course.enrollmentCriteria.targetLevelID)}
            {renderField('Max Capacity', course.enrollmentCriteria.maxCapacity)}
            {renderField('Target Pharmacy ID', course.enrollmentCriteria.targetPharmacyID)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderLessons = () => {
    if (!course.lessons || course.lessons.length === 0) return null;

    const [expandedLessons, setExpandedLessons] = useState<{ [key: string]: boolean }>({});

    const toggleExpanded = (lessonId: string) => {
      setExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader
          title="Lessons"
          sx={{ pl: 2, pb: 1, mb: 2 }} // Added mb: 2 for title margin, adjusted pb: 1
        />
        {course.lessons.map((lesson, index) => {
          const lessonId = lesson.id ?? `lesson-${index}`;
          const isExpanded = expandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3, // Increased margin-bottom to 24px for more separation
                mx: window.innerWidth < 600 ? 1 : 2, // Retained responsive horizontal margin
              }}
            >
              <CardHeader
                title={lesson.name ?? `Lesson ${index + 1}`}
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
                    {renderField('ID', lesson.id)}
                    {renderField('Detail', lesson.detail)}
                    {renderField('Enable Play', lesson.enablePlay ? 'Yes' : 'No')}
                    {renderField('Status', lesson.status)}
                    {renderField('Lesson Type', lesson.lessonType)}
                    {renderField('Enrollment Criteria ID', lesson.enrollmentCriteriaID)}
                    {renderField('Category ID', lesson.categoryID)}
                    {renderField('Thumbnail ID', lesson.thumbnailID)}
                    {renderField('Video ID', lesson.videoID)}
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
        <Typography variant="h5">{course.name ?? 'Unnamed Course'}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Course Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', course.id)}
            {renderField('Name', course.name)}
            {renderField('Detail', course.detail)}
            {renderField('Is Required', course.isRequired ? 'Yes' : 'No')}
            {renderField('Course Type', course.courseType)}
            {renderField('Display Type', course.displayType)}
            {renderField('Disable Status', course.disableStatus)}
            {renderField('Schedule Status', course.scheduleStatus)}
            {renderField('Teacher ID', course.teacherId)}
            {renderField('Meeting Link', course.meetingLink)}
            {renderField(
              'Start Time',
              course.startTime ? DateTimeUtils.formatISODateFromDate(course.startTime) : undefined
            )}
            {renderField('End Time', course.endTime ? DateTimeUtils.formatISODateFromDate(course.endTime) : undefined)}
            {renderField('Enrollment Criteria ID', course.enrollmentCriteriaId)}
            {renderField('Category ID', course.categoryId)}
            {renderField('Thumbnail ID', course.thumbnailId)}
          </Grid>
        </CardContent>
      </Card>
      {renderEnrollmentCriteria()}
      {renderLessons()}
    </Box>
  );
}

export default function CourseDetailForm({ open, courseId, onClose }: Props) {
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
        .catch((error) => {
          console.error('Error fetching course details:', error);
          setCourse(null);
        })
        .finally(() => setLoading(false));
    }
  }, [open, courseId, courseUsecase]);

  if (!courseId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Course Details</Typography>
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
