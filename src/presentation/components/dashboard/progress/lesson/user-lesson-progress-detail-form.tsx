'use client';

import React, { useEffect, useState } from 'react';
import { type UserLessonProgressDetailResponse } from '@/domain/models/user-lesson/response/user-lesson-detail-response';
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
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';

interface Props {
  open: boolean;
  userLessonProgressId: string | null;
  onClose: () => void;
}

function UserLessonProgressDetails({
  userLessonProgress,
  fullScreen,
}: {
  userLessonProgress: UserLessonProgressDetailResponse;
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

  const renderLesson = () => {
    const lesson = userLessonProgress.lessons;
    if (!lesson) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Lesson Detail" />
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar src={lesson.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
              {lesson.name?.[0] ?? '?'}
            </Avatar>
            <Typography variant="h5">{lesson.name ?? 'Unnamed Lesson'}</Typography>
          </Box>
          <Box key={lesson.id} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {renderField('ID', lesson.id)}
              {renderField('Name', lesson.name)}
              {renderField('Description', lesson.detail)}
              {renderField('enablePlay', lesson.enablePlay ? 'Required' : 'Optional')}
              {renderField('Status', lesson.status)}
              {renderField('Lesson Type', lesson.lessonType)}
              {renderField('Category ID', lesson.categoryID)}
              {renderField('Category Name', lesson.category?.categoryName)}
              {renderField('Thumbnail ID', lesson.thumbnailID)}
              {renderField('Thumbnail Name', lesson.thumbnail?.name)}
            </Grid>
            <Box mt={4}>
              {lesson?.video?.resourceUrl != null && (
                <CustomVideoPlayer src={lesson.video.resourceUrl} fullscreen={fullScreen} />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderUserInformation = () => {
    const user = userLessonProgress.user;
    if (!user) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="User Information" />
        <CardContent>
          <Box key={user.id} sx={{ mb: 2 }}>
            {/* Avatar */}
            {user.employee?.avatar ? <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
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
              </Box> : null}

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
        <Avatar src={userLessonProgress.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {userLessonProgress.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{userLessonProgress.name ?? 'Unnamed UserLessonProgress'}</Typography>
      </Box> */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title="UserLessonProgress Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', userLessonProgress.id)}
            {renderField('userID', userLessonProgress.userID)}
            {renderField('lessonID', userLessonProgress.lessonID)}
            {renderField('progress', userLessonProgress.progress)}
            {renderField('startDate', DateTimeUtils.formatISODateToString(userLessonProgress.startDate))}
            {renderField('endDate', DateTimeUtils.formatISODateToString(userLessonProgress.endDate))}
            {renderField('lastAccess', DateTimeUtils.formatISODateToString(userLessonProgress.lastAccess))}
            {renderField('status', userLessonProgress.status)}
          </Grid>
        </CardContent>
      </Card>{' '}
      {renderUserInformation()}
      {renderLesson()}
    </Box>
  );
}

export default function UserLessonProgressDetailForm({ open, userLessonProgressId, onClose }: Props) {
  const { userLessonProgressUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [userLessonProgress, setUserLessonProgress] = useState<UserLessonProgressDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && userLessonProgressId && userLessonProgressUsecase) {
      setLoading(true);
      userLessonProgressUsecase
        .getUserLessonProgressById(userLessonProgressId)
        .then(setUserLessonProgress)
        .catch((error) => {
          console.error('Error fetching userLessonProgress details:', error);
          setUserLessonProgress(null);
        })
        .finally(() => { setLoading(false); });
    }
  }, [open, userLessonProgressId, userLessonProgressUsecase]);

  if (!userLessonProgressId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">UserLessonProgress Details</Typography>
        <Box>
          <IconButton onClick={() => { setFullScreen((prev) => !prev); }}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !userLessonProgress ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <UserLessonProgressDetails userLessonProgress={userLessonProgress} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
