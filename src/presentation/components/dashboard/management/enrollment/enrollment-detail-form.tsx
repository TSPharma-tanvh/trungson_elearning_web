'use client';

import React, { useEffect, useState } from 'react';
import { type EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderPathDetails = () => {
    if (!enrollment.path) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('coursePath')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('pathId', enrollment.path.id)}
            {renderField('name', enrollment.path.name)}
            {renderField('detail', enrollment.path.detail)}
            {renderField('isRequired', enrollment.path.isRequired ? t('yes') : t('no'))}
            {renderField('startTime', enrollment.path.startTime)}
            {renderField('endTime', enrollment.path.endTime)}
            {renderField('status', enrollment.path.status)}
            {renderField('displayType', enrollment.path.displayType)}
            {renderField('categoryId', enrollment.path.categoryID)}
            {renderField('thumbnailId', enrollment.path.thumbnailID)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderCourseDetails = () => {
    if (!enrollment.courses) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('courses')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('courseId', enrollment.courses?.id)}
            {renderField('name', enrollment.courses?.name)}
            {renderField('detail', enrollment.courses?.detail)}
            {renderField('isRequired', enrollment.courses?.isRequired)}
            {renderField('disableStatus', enrollment.courses?.disableStatus)}
            {renderField('scheduleStatus', enrollment.courses?.scheduleStatus)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderClassDetails = () => {
    if (!enrollment.class) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('class')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('classId', enrollment.class?.id)}
            {renderField('name', enrollment.class?.className)}
            {renderField('classDetail', enrollment.class?.classDetail)}
            {renderField('qrCodeURL', enrollment.class?.qrCode?.resourceUrl)}
            {renderField(
              'startAt',
              enrollment.class?.startAt !== undefined
                ? DateTimeUtils.formatISODateFromDate(enrollment.class.startAt)
                : ''
            )}
            {renderField(
              'endAt',
              enrollment.class?.endAt !== undefined ? DateTimeUtils.formatISODateFromDate(enrollment.class.endAt) : ''
            )}
            {renderField('minuteLate', enrollment.class?.minuteLate)}
            {renderField('scheduleStatus', enrollment.class?.scheduleStatus)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderQuizDetails = () => {
    if (!enrollment.quiz) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('quiz')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('quizId', enrollment.quiz?.id)}
            {renderField('name', enrollment.quiz?.title)}
            {renderField('description', enrollment.quiz?.description)}
            {renderField('status', enrollment.quiz?.status)}
            {renderField(
              'startTime',
              enrollment.quiz?.startTime ? DateTimeUtils.formatISODateFromDate(enrollment.quiz.startTime) : ''
            )}
            {renderField(
              'endTime',
              enrollment.quiz?.endTime ? DateTimeUtils.formatISODateFromDate(enrollment.quiz.endTime) : ''
            )}
            {renderField('totalScore', enrollment.quiz?.totalScore)}
            {renderField('canStartOver', enrollment.quiz?.canStartOver)}
            {renderField('isRequired', enrollment.quiz?.isRequired)}
            {renderField('isAutoSubmitted', enrollment.quiz?.isAutoSubmitted)}
            {renderField('type', enrollment.quiz?.type)}
            {renderField('time', enrollment.quiz?.time)}
            {renderField('scoreToPass', enrollment.quiz?.scoreToPass)}
            {renderField('totalQuestion', enrollment.quiz?.totalQuestion)}
            {renderField('maxAttempts', enrollment.quiz?.maxAttempts)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderEnrollments = () => {
    if (!enrollment.enrollments || enrollment.enrollments.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('enrollment')} sx={{ pl: 2, pb: 1, mb: 2 }} />
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
                title={enroll.id ?? `${t('enrollment')} ${index + 1}`}
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
                    {renderField(
                      'enrollmentDate',
                      enroll.enrollmentDate ? DateTimeUtils.formatISODateFromDate(enroll.enrollmentDate) : ''
                    )}
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
        <CardHeader title={t('courseEnrollments')} sx={{ pl: 2, pb: 1, mb: 2 }} />
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
                title={courseEnroll.course?.name ?? `${t('courseEnrollments')} ${index + 1}`}
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
                    {renderField('id', courseEnroll.id)}
                    {renderField('enrollmentCriteriaId', courseEnroll.enrollmentCriteriaID)}
                    {renderField('courseId', courseEnroll.courseID)}
                    {courseEnroll.course ? (
                      <>
                        {renderField('courseName', courseEnroll.course.name)}
                        {renderField('courseId', courseEnroll.course.id)}
                        {renderField('pathId', courseEnroll.course.pathId)}
                        {renderField('detail', courseEnroll.course.detail)}
                        {renderField('isRequired', courseEnroll.course.isRequired ? 'Yes' : 'No')}
                        {renderField('disableStatus', courseEnroll.course.disableStatus)}
                        {renderField('teacherId', courseEnroll.course.teacherId)}
                        {renderField('courseType', courseEnroll.course.courseType)}
                        {renderField('displayType', courseEnroll.course.displayType)}
                        {renderField('startTime', courseEnroll.course.startTime)}
                        {renderField('endTime', courseEnroll.course.endTime)}
                        {renderField('meetingLink', courseEnroll.course.meetingLink)}
                        {renderField('scheduleStatus', courseEnroll.course.scheduleStatus)}
                        {renderField('enrollmentCriteriaId', courseEnroll.course.enrollmentCriteriaId)}
                        {renderField('categoryId', courseEnroll.course.categoryId)}
                        {renderField('thumbnailId', courseEnroll.course.thumbnailId)}
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
        <Typography variant="h5">{enrollment.name ?? ''}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('enrollmentCriteriaInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', enrollment.id)}
            {renderField('name', enrollment.name)}
            {renderField('desc', enrollment.desc)}
            {renderField('enrollmentCriteriaType', enrollment.enrollmentCriteriaType)}
            {renderField('enrollmentStatus', enrollment.enrollmentStatus)}
            {renderField('maxCapacity', enrollment.maxCapacity)}
            {renderField('targetLevelID', enrollment.targetLevelID)}
            {renderField('pathID', enrollment.pathID)}
            {renderField('courseID', enrollment.courseID)}
            {renderField('classID', enrollment.classID)}
            {renderField('quizID', enrollment.quizID)}
            {renderField('targetPharmacyID', enrollment.targetPharmacyID)}
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
  const { t } = useTranslation();
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
        .catch(() => {
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
        <Typography variant="h6">{t('enrollmentCriteriaDetails')}</Typography>
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
