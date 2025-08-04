'use client';

import React, { useEffect, useState } from 'react';
import { type CourseResponse } from '@/domain/models/courses/response/course-response';
import { type CoursePathResponse } from '@/domain/models/path/response/course-path-response';
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

interface CoursePathDetailProps {
  open: boolean;
  coursePathId: string | null;
  onClose: () => void;
}

// Path Information
interface PathInfoCardProps {
  coursePath: CoursePathResponse;
  fullScreen: boolean;
}
function PathInfoCard({ coursePath, fullScreen }: PathInfoCardProps) {
  const { t } = useTranslation();
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title={t('pathInformation')} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('id')}
            </Typography>
            <CustomFieldTypography value={coursePath.id} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('name')}
            </Typography>
            <CustomFieldTypography value={coursePath.name} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('description')}
            </Typography>
            <CustomFieldTypography value={coursePath.detail} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('categoryName')}
            </Typography>
            <CustomFieldTypography value={coursePath.category?.categoryName} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('categoryId')}
            </Typography>
            <CustomFieldTypography value={coursePath.categoryID} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('thumbnailId')}
            </Typography>
            <CustomFieldTypography value={coursePath.thumbnailID} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Schedule Information
interface ScheduleCardProps {
  coursePath: CoursePathResponse;
}
function ScheduleCard({ coursePath }: ScheduleCardProps) {
  const { t } = useTranslation();

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title={t('schedule')} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('startTime')}
            </Typography>
            <CustomFieldTypography
              value={coursePath.startTime ? DateTimeUtils.formatISODateFromString(coursePath.startTime) : undefined}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('endTime')}
            </Typography>
            <CustomFieldTypography
              value={coursePath.endTime ? DateTimeUtils.formatISODateFromString(coursePath.endTime) : undefined}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Status and Requirements
interface StatusCardProps {
  coursePath: CoursePathResponse;
}
function StatusCard({ coursePath }: StatusCardProps) {
  const { t } = useTranslation();
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title={t('statusAndRequirements')} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('status')}
            </Typography>
            <CustomFieldTypography value={coursePath.status} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('isRequired')}
            </Typography>
            <CustomFieldTypography value={coursePath.isRequired ? t('yes') : t('no')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              {t('displayType')}
            </Typography>
            <CustomFieldTypography value={coursePath.displayType} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Enrollment Criteria
interface EnrollmentCardProps {
  coursePath: CoursePathResponse;
  fullScreen: boolean;
}

export function EnrollmentCard({ coursePath, fullScreen }: EnrollmentCardProps) {
  const { t } = useTranslation();

  const enrollments = coursePath.enrollmentCriteria ?? [];
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderField = (
    label: string,
    value?: string | number | boolean | null | undefined,
    children?: React.ReactNode
  ) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      {children ?? <CustomFieldTypography value={value} />}
    </Grid>
  );

  if (enrollments.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <CardHeader title={t('criteria')} sx={{ pl: 2, pb: 1, mb: 2 }} />
      {enrollments.map((enroll, index) => {
        const isExpanded = expandedIds[enroll.id] ?? false;

        return (
          <Card
            key={enroll.id}
            variant="outlined"
            sx={{
              mb: 2,
              mx: window.innerWidth < 600 ? 1 : 2,
            }}
          >
            <CardHeader
              title={enroll.name ?? `${t('enrollment')} #${index + 1}`}
              action={
                <IconButton
                  onClick={() => {
                    toggleExpanded(enroll.id);
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
                  {renderField('id', enroll.id)}
                  {renderField('maxCapacity', enroll.maxCapacity)}
                  {renderField('targetType', enroll.targetType)}
                  {renderField('targetID', enroll.targetID)}
                  {renderField('targetLevelID', enroll.targetLevelID)}
                  {renderField('targetPharmacyID', enroll.targetPharmacyID)}
                  {renderField('description', enroll.desc)}
                </Grid>
              </CardContent>
            </Collapse>
          </Card>
        );
      })}
    </Box>
  );
}

// Course Details (Collapsible)
interface CourseDetailsCardProps {
  course: CourseResponse;
  fullScreen: boolean;
}
function CourseDetailsCard({ course, fullScreen }: CourseDetailsCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const renderField = (
    label: string,
    value?: string | number | boolean | null | undefined,
    children?: React.ReactNode
  ) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      {children ? children : <CustomFieldTypography value={value} />}
    </Grid>
  );

  return (
    <Card
      sx={{
        mb: 3,
        mx: window.innerWidth < 600 ? 1 : 2,
      }}
    >
      <CardHeader
        title={course.name ?? 'Unnamed Course'}
        action={
          <IconButton
            onClick={() => {
              setExpanded(!expanded);
            }}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
        sx={{ py: 1 }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', course.id)}
            {renderField('detail', course.detail)}
            {renderField('isRequired', course.isRequired ? 'Yes' : 'No')}
            {renderField('courseType', course.courseType)}
            {renderField('categoryId', course.categoryId)}
            {renderField('thumbnailId', course.thumbnailId)}
            {renderField('enrollmentCriteriaId', course.enrollmentCriteriaId)}
            {renderField(
              'startTime',
              course.startTime ? DateTimeUtils.formatISODateFromString(course.startTime) : undefined
            )}
            {renderField('endTime', course.endTime ? DateTimeUtils.formatISODateFromString(course.endTime) : undefined)}
            {renderField('disableStatus', course.disableStatus)}
            {renderField('scheduleStatus', course.scheduleStatus)}
            {renderField('displayType', course.displayType)}
            {renderField(
              'meetingLink',
              undefined,
              course.meetingLink ? (
                <Typography variant="body2" component="span">
                  <a href={course.meetingLink} target="_blank" rel="noopener noreferrer">
                    {t('link')}
                  </a>
                </Typography>
              ) : (
                <CustomFieldTypography value="-" />
              )
            )}
            {renderField('teacherId', course.teacherId)}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default function CoursePathDetailForm({ open, coursePathId, onClose }: CoursePathDetailProps) {
  const { t } = useTranslation();

  const { pathUseCase } = useDI();
  const [loading, setLoading] = useState(false);
  const [coursePath, setCoursePath] = useState<CoursePathResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && coursePathId && pathUseCase) {
      setLoading(true);
      pathUseCase
        .getPathDetailInfo(coursePathId)
        .then(setCoursePath)
        .catch(() => {
          setCoursePath(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, coursePathId, pathUseCase]);

  if (!coursePathId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', pr: 1 }}>
        <Typography variant="h6">{t('coursePathDetails')}</Typography>
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
      <DialogContent dividers sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
        {loading || !coursePath ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Header */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar src={coursePath.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
                {coursePath.name?.[0] ?? '?'}
              </Avatar>
              <Typography variant="h5">{coursePath.name ?? t('unnamedPath')}</Typography>
            </Box>

            {/* Grouped Path Details */}
            <PathInfoCard coursePath={coursePath} fullScreen={fullScreen} />
            <ScheduleCard coursePath={coursePath} />
            <StatusCard coursePath={coursePath} />

            <Box sx={{ mb: 2 }}>
              <EnrollmentCard coursePath={coursePath} fullScreen={fullScreen} />
            </Box>
            {/* Courses Section */}
            <Box sx={{ mb: 2 }}>
              <CardHeader title={t('includedCourses')} sx={{ pl: 2, pb: 1, mb: 2 }} />
              {coursePath.courses.length > 0 ? (
                coursePath.courses.map((course) => (
                  <CourseDetailsCard key={course.id} course={course} fullScreen={fullScreen} />
                ))
              ) : (
                <Box sx={{ ml: 2 }}>
                  <CustomFieldTypography value={undefined} fallback={t('noCoursesIncluded')} />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
