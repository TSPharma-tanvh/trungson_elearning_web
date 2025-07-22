'use client';

import React, { useEffect, useState } from 'react';
import { UserCourseProgressResponse } from '@/domain/models/user-course/response/user-course-progress-response';
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
  Stack,
  Typography,
} from '@mui/material';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

interface Props {
  open: boolean;
  userCourseProgressId: string | null;
  onClose: () => void;
}

function UserCourseProgressDetails({
  userCourseProgress,
  fullScreen,
}: {
  userCourseProgress: UserCourseProgressResponse;
  fullScreen: boolean;
}) {
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderCourse = () => {
    const course = userCourseProgress.courses;
    if (!course) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Enrollment Criteria" />
        <CardContent>
          <Box key={course.id} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {renderField('ID', course.id)}
              {renderField('Name', course.name)}
              {renderField('Description', course.detail)}
              {renderField('Target Type', course.isRequired ? 'Required' : 'Optional')}
              {renderField('Start Time', course.startTime ? new Date(course.startTime).toLocaleString() : '')}
              {renderField('End Time', course.endTime ? new Date(course.endTime).toLocaleString() : '')}
              {renderField('Status', course.disableStatus)}
              {renderField('scheduleStatus', course.scheduleStatus)}
              {renderField('Display Type', course.displayType)}
              {renderField('Category ID', course.categoryId)}
              {renderField('Category Name', course.category?.categoryName)}
              {renderField('Thumbnail ID', course.thumbnailId)}
              {renderField('Thumbnail Name', course.thumbnail?.name)}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderUserInformation = () => {
    const user = userCourseProgress.user;
    if (!user) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="User Information" />
        <CardContent>
          <Box key={user.id} sx={{ mb: 2 }}>
            {/* Avatar */}
            {user.employee?.avatar && (
              <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 100, height: 100 }} src={user.employee?.avatar ?? user.thumbnail?.resourceUrl}>
                    {user.firstName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} noWrap>
                      {user.employee?.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" noWrap>
                      {user.userName}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            <Grid container spacing={2}>
              {renderField('ID', user.id)}
              {renderField('Username', user.userName)}
              {renderField('Email', user.email)}
              {renderField('First Name', user.firstName)}
              {renderField('Last Name', user.lastName)}
              {renderField('Phone Number', user.phoneNumber)}
              {renderField('Is Active', user.isActive ? 'Yes' : 'No')}
              {renderField('Employee ID', user.employeeId)}
              {renderField('Thumbnail ID', user.thumbnailId)}
              {renderField('Thumbnail Name', user.thumbnail?.name)}
              {renderField('Roles', user.roles?.join(', '))}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      {/* <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={userCourseProgress.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {userCourseProgress.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{userCourseProgress.name ?? 'Unnamed UserCourseProgress'}</Typography>
      </Box> */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title="UserCourseProgress Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', userCourseProgress.id)}
            {renderField('userID', userCourseProgress.userID)}
            {renderField('courseID', userCourseProgress.courseID)}
            {renderField('progress', userCourseProgress.progress)}
            {renderField('startDate', userCourseProgress.startDate)}
            {renderField('endDate', userCourseProgress.endDate)}
            {renderField('lastAccess', userCourseProgress.lastAccess)}
            {renderField('status', userCourseProgress.status)}
            {renderField('enrollmentID', userCourseProgress.enrollmentID)}
          </Grid>
        </CardContent>
      </Card>
      {renderCourse()}
      {renderUserInformation()}
    </Box>
  );
}

export default function UserCourseProgressDetailForm({ open, userCourseProgressId, onClose }: Props) {
  const { userCourseProgressUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [userCourseProgress, setUserCourseProgress] = useState<UserCourseProgressResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && userCourseProgressId && userCourseProgressUsecase) {
      setLoading(true);
      userCourseProgressUsecase
        .getUserCourseProgressById(userCourseProgressId)
        .then(setUserCourseProgress)
        .catch((error) => {
          console.error('Error fetching userCourseProgress details:', error);
          setUserCourseProgress(null);
        })
        .finally(() => setLoading(false));
    }
  }, [open, userCourseProgressId, userCourseProgressUsecase]);

  if (!userCourseProgressId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">UserCourseProgress Details</Typography>
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
        {loading || !userCourseProgress ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <UserCourseProgressDetails userCourseProgress={userCourseProgress} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
