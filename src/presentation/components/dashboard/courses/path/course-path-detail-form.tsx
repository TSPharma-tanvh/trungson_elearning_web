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
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Path Information" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              ID
            </Typography>
            <CustomFieldTypography value={coursePath.id} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Name
            </Typography>
            <CustomFieldTypography value={coursePath.name} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Description
            </Typography>
            <CustomFieldTypography value={coursePath.detail} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Category Name
            </Typography>
            <CustomFieldTypography value={coursePath.category?.categoryName} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Category ID
            </Typography>
            <CustomFieldTypography value={coursePath.categoryID} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Thumbnail ID
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
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Schedule" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Start Time
            </Typography>
            <CustomFieldTypography
              value={coursePath.startTime ? DateTimeUtils.formatISODateFromString(coursePath.startTime) : undefined}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              End Time
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
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Status and Requirements" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Status
            </Typography>
            <CustomFieldTypography value={coursePath.status} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Is Required
            </Typography>
            <CustomFieldTypography value={coursePath.isRequired ? 'Yes' : 'No'} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Display Type
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
        {label}
      </Typography>
      {children ?? <CustomFieldTypography value={value} />}
    </Grid>
  );

  if (enrollments.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <CardHeader title="Enrollment Criteria" sx={{ pl: 2, pb: 1, mb: 2 }} />
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
              title={enroll.name ?? `Enrollment #${index + 1}`}
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
                  {renderField('ID', enroll.id)}
                  {renderField('Max Capacity', enroll.maxCapacity)}
                  {renderField('Target Type', enroll.targetType)}
                  {renderField('Target ID', enroll.targetID)}
                  {renderField('Target Level ID', enroll.targetLevelID)}
                  {renderField('Target Pharmacy ID', enroll.targetPharmacyID)}
                  {renderField('Description', enroll.desc)}
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
  const [expanded, setExpanded] = useState(false);

  const renderField = (
    label: string,
    value?: string | number | boolean | null | undefined,
    children?: React.ReactNode
  ) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
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
            {renderField('ID', course.id)}
            {renderField('Description', course.detail)}
            {renderField('Is Required', course.isRequired ? 'Yes' : 'No')}
            {renderField('Course Type', course.courseType)}
            {renderField('Category ID', course.categoryId)}
            {renderField('Thumbnail ID', course.thumbnailId)}
            {renderField('Enrollment Criteria ID', course.enrollmentCriteriaId)}
            {renderField(
              'Start Time',
              course.startTime ? DateTimeUtils.formatISODateFromString(course.startTime) : undefined
            )}
            {renderField(
              'End Time',
              course.endTime ? DateTimeUtils.formatISODateFromString(course.endTime) : undefined
            )}
            {renderField('Disable Status', course.disableStatus)}
            {renderField('Schedule Status', course.scheduleStatus)}
            {renderField('Display Type', course.displayType)}
            {renderField(
              'Meeting Link',
              undefined,
              course.meetingLink ? (
                <Typography variant="body2" component="span">
                  <a href={course.meetingLink} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </Typography>
              ) : (
                <CustomFieldTypography value="-" />
              )
            )}
            {renderField('Teacher ID', course.teacherId)}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default function CoursePathDetailForm({ open, coursePathId, onClose }: CoursePathDetailProps) {
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
        <Typography variant="h6">Course Path Details</Typography>
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
              <Typography variant="h5">{coursePath.name ?? 'Unnamed Path'}</Typography>
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
              <CardHeader title="Included Courses" sx={{ pl: 2, pb: 1, mb: 2 }} />
              {coursePath.courses.length > 0 ? (
                coursePath.courses.map((course) => (
                  <CourseDetailsCard key={course.id} course={course} fullScreen={fullScreen} />
                ))
              ) : (
                <CustomFieldTypography value={undefined} fallback="No courses included in this path." />
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
