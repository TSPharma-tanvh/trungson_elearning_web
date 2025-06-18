'use client';

import React, { useEffect, useState } from 'react';
import { CourseResponse } from '@/domain/models/courses/response/course-response';
import { CoursePathResponse } from '@/domain/models/path/response/course-path-response';
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import CustomFieldTypography from '../../core/text-field/custom-typhography';

interface Props {
  open: boolean;
  coursePathId: string | null;
  onClose: () => void;
}

//Path Information
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

//Schedule Information
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
              value={coursePath.startTime ? DateTimeUtils.formatISODate(coursePath.startTime) : undefined}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={500}>
              End Time
            </Typography>
            <CustomFieldTypography
              value={coursePath.endTime ? DateTimeUtils.formatISODate(coursePath.endTime) : undefined}
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

//Enrollment Criteria
interface EnrollmentCardProps {
  coursePath: CoursePathResponse;
  fullScreen: boolean;
}
function EnrollmentCard({ coursePath, fullScreen }: EnrollmentCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Enrollment Criteria" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Enrollment Criteria ID
            </Typography>
            <CustomFieldTypography value={coursePath.enrollmentCriteriaID} />
          </Grid>
          <Grid item xs={12} sm={fullScreen ? 4 : 6}>
            <Typography variant="subtitle2" fontWeight={500}>
              Max Capacity
            </Typography>
            <CustomFieldTypography value={coursePath.enrollmentCriteria?.maxCapacity} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

//Course Details (Collapsible)
interface CourseDetailsCardProps {
  course: CourseResponse;
  fullScreen: boolean;
}
function CourseDetailsCard({ course, fullScreen }: CourseDetailsCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <CustomFieldTypography value={course.id} />
        </TableCell>
        <TableCell>
          <CustomFieldTypography value={course.name} />
        </TableCell>
        <TableCell>
          <CustomFieldTypography value={course.isRequired ? 'Yes' : 'No'} />
        </TableCell>
        <TableCell>
          <CustomFieldTypography value={course.courseType} />
        </TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} sx={{ py: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
              <Grid container spacing={2}>
                {/* Course Metadata */}
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Description
                  </Typography>
                  <CustomFieldTypography value={course.detail} />
                </Grid>
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Category ID
                  </Typography>
                  <CustomFieldTypography value={course.categoryId} />
                </Grid>
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Thumbnail ID
                  </Typography>
                  <CustomFieldTypography value={course.thumbnailId} />
                </Grid>
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Enrollment Criteria ID
                  </Typography>
                  <CustomFieldTypography value={course.enrollmentCriteriaId} />
                </Grid>
                {/* Schedule */}
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Start Time
                  </Typography>
                  <CustomFieldTypography
                    value={course.startTime ? DateTimeUtils.formatISODate(course.startTime) : undefined}
                  />
                </Grid>
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    End Time
                  </Typography>
                  <CustomFieldTypography
                    value={course.endTime ? DateTimeUtils.formatISODate(course.endTime) : undefined}
                  />
                </Grid>
                {/* Status and Links */}
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Disable Status
                  </Typography>
                  <CustomFieldTypography value={course.disableStatus} />
                </Grid>
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Schedule Status
                  </Typography>
                  <CustomFieldTypography value={course.scheduleStatus} />
                </Grid>
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Display Type
                  </Typography>
                  <CustomFieldTypography value={course.displayType} />
                </Grid>
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Meeting Link
                  </Typography>
                  <CustomFieldTypography>
                    {course.meetingLink ? (
                      <a href={course.meetingLink} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    ) : (
                      '-'
                    )}
                  </CustomFieldTypography>
                </Grid>
                <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Teacher ID
                  </Typography>
                  <CustomFieldTypography value={course.teacherId} />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CoursePathDetailForm({ open, coursePathId, onClose }: Props) {
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
        .catch((error) => {
          console.error('Error fetching course path details:', error);
          setCoursePath(null);
        })
        .finally(() => setLoading(false));
    }
  }, [open, coursePathId, pathUseCase]);

  if (!coursePathId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Course Path Details</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
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
            <EnrollmentCard coursePath={coursePath} fullScreen={fullScreen} />

            {/* Courses Table */}
            <Typography variant="subtitle1" fontWeight={500} mt={3} mb={1}>
              Included Courses
            </Typography>
            {coursePath.courses.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Is Required</TableCell>
                      <TableCell>Course Type</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coursePath.courses.map((course) => (
                      <CourseDetailsCard key={course.id} course={course} fullScreen={fullScreen} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <CustomFieldTypography value={undefined} fallback="No courses included in this path." />
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
