'use client';

import React, { useEffect, useState } from 'react';
import { type EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
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

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

interface EnrollmentDetailProps {
  open: boolean;
  enrollmentId: string | null;
  onClose: () => void;
}

function EnrollmentDetails({
  enrollment,
  fullScreen,
}: {
  enrollment: EnrollmentCriteriaDetailResponse;
  fullScreen: boolean;
}) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleExpanded = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderPathDetails = () => {
    if (!enrollment.path) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Course Path" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Path ID', enrollment.path.id)}
            {renderField('Name', enrollment.path.name)}
            {/* Add other fields from CoursePathResponse if available */}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderCourseDetails = () => {
    if (!enrollment.courses) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Course" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Course ID', enrollment.courses.id)}
            {renderField('Name', enrollment.courses.name)}
            {renderField('detail', enrollment.courses.detail)}
            {renderField('isRequired', enrollment.courses.isRequired)}
            {renderField('disableStatus', enrollment.courses.disableStatus)}
            {renderField('scheduleStatus', enrollment.courses.scheduleStatus)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderClassDetails = () => {
    if (!enrollment.class) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Class" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Class ID', enrollment.class.id)}
            {renderField('Name', enrollment.class.className)}
            {renderField('classDetail', enrollment.class.classDetail)}
            {renderField('qrCodeURL', enrollment.class.qrCodeURL)}
            {/* {renderField('startAt', enrollment.class.startAt)}
            {renderField('endAt', enrollment.class.endAt)} */}
            {renderField('minuteLate', enrollment.class.minuteLate)}
            {renderField('scheduleStatus', enrollment.class.scheduleStatus)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderQuizDetails = () => {
    if (!enrollment.quiz) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Quiz" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Quiz ID', enrollment.quiz.id)}
            {renderField('Name', enrollment.quiz.title)}
            {renderField('description', enrollment.quiz.description)}
            {renderField('status', enrollment.quiz.status)}
            {/* {renderField('startTime', enrollment.quiz.startTime)}
            {renderField('endTime', enrollment.quiz.endTime)} */}
            {renderField('totalScore', enrollment.quiz.totalScore)}
            {renderField('canStartOver', enrollment.quiz.canStartOver)}
            {renderField('isRequired', enrollment.quiz.isRequired)}
            {renderField('isAutoSubmitted', enrollment.quiz.isAutoSubmitted)}
            {renderField('type', enrollment.quiz.type)}
            {renderField('time', enrollment.quiz.time)}
            {renderField('scoreToPass', enrollment.quiz.scoreToPass)}
            {renderField('totalQuestion', enrollment.quiz.totalQuestion)}
            {renderField('maxAttempts', enrollment.quiz.maxAttempts)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderEnrollments = () => {
    if (!enrollment.enrollments || enrollment.enrollments.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title="Enrollments" sx={{ pl: 2, pb: 1, mb: 2 }} />
        {enrollment.enrollments.map((enroll, index) => {
          const enrollId = enroll.id ?? `enrollment-${index}`;
          const isExpanded = expandedSections[enrollId] || false;

          return (
            <Card
              key={enrollId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={enroll.id ?? `Enrollment ${index + 1}`}
                action={
                  <IconButton
                    onClick={() => {
                      toggleExpanded(enrollId);
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
                    {renderField('ID', enroll.id)}
                    {renderField('userID', enroll.userID)}
                    {renderField('targetType', enroll.targetType)}
                    {renderField('targetID', enroll.targetID)}
                    {/* {renderField('enrollmentDate', enroll.enrollmentDate)} */}
                    {renderField('status', enroll.status)}
                    {renderField('rejectedReason', enroll.rejectedReason)}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    );
  };

  const renderCourseEnrollments = () => {
    if (!enrollment.courseEnrollments || enrollment.courseEnrollments.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title="Course Enrollments" sx={{ pl: 2, pb: 1, mb: 2 }} />
        {enrollment.courseEnrollments.map((courseEnroll, index) => {
          const courseEnrollId = courseEnroll.id ?? `course-enrollment-${index}`;
          const isExpanded = expandedSections[courseEnrollId] || false;

          return (
            <Card
              key={courseEnrollId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={courseEnroll.course?.name ?? `Course Enrollment ${index + 1}`}
                action={
                  <IconButton
                    onClick={() => {
                      toggleExpanded(courseEnrollId);
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
                    {renderField('ID', courseEnroll.id)}
                    {renderField('Enrollment Criteria ID', courseEnroll.enrollmentCriteriaID)}
                    {renderField('Course ID', courseEnroll.courseID)}
                    {courseEnroll.course ? (
                      <>
                        {renderField('Course Name', courseEnroll.course.name)}
                        {renderField('Course ID', courseEnroll.course.id)}
                        {/* Add other fields from CourseResponse if available */}
                      </>
                    ) : null}
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
        <Typography variant="h5">{enrollment.name ?? 'Unnamed Enrollment Criteria'}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Enrollment Criteria Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', enrollment.id)}
            {renderField('Name', enrollment.name)}
            {renderField('Description', enrollment.desc)}
            {renderField('Enrollment Criteria Type', enrollment.enrollmentCriteriaType)}
            {renderField('Enrollment Status', enrollment.enrollmentStatus)}
            {renderField('Max Capacity', enrollment.maxCapacity)}
            {renderField('Target Level ID', enrollment.targetLevelID)}
            {renderField('Path ID', enrollment.pathID)}
            {renderField('Course ID', enrollment.courseID)}
            {renderField('Class ID', enrollment.classID)}
            {renderField('Quiz ID', enrollment.quizID)}
            {renderField('Target Pharmacy ID', enrollment.targetPharmacyID)}
          </Grid>
        </CardContent>
      </Card>
      {renderPathDetails()}
      {renderCourseDetails()}
      {renderClassDetails()}
      {renderQuizDetails()}
      {renderEnrollments()}
      {renderCourseEnrollments()}
    </Box>
  );
}

export default function EnrollmentDetailForm({ open, enrollmentId, onClose }: EnrollmentDetailProps) {
  const { enrollUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [enrollment, setEnrollment] = useState<EnrollmentCriteriaDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && enrollmentId && enrollUsecase) {
      setLoading(true);
      enrollUsecase
        .getEnrollmentById(enrollmentId)
        .then(setEnrollment)
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
          setEnrollment(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, enrollmentId, enrollUsecase]);

  if (!enrollmentId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Enrollment Criteria Details</Typography>
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
        {loading || !enrollment ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <EnrollmentDetails enrollment={enrollment} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
