'use client';

import React, { useEffect, useState } from 'react';
import { type UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { Info, InfoOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

import { ViewUserDialog } from '../../management/users/view-user-detail-dialog';
import QuizDetailForm from '../../quiz/quiz/quiz-detail-form';

interface Props {
  open: boolean;
  userQuizProgressId: string | null;
  onClose: () => void;
}

function UserQuizProgressDetails({
  userQuizProgress,
  fullScreen,
}: {
  userQuizProgress: UserQuizProgressDetailResponse;
  fullScreen: boolean;
}) {
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 3 : 4}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderQuiz = () => {
    const quiz = userQuizProgress.quiz;
    if (!quiz) return null;

    const [openQuizDetail, setOpenQuizDetail] = useState(false);

    const handleViewQuizDetail = () => {
      setOpenQuizDetail(true);
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title="Quiz Detail"
          action={
            <IconButton onClick={handleViewQuizDetail}>
              <InfoOutlined />
            </IconButton>
          }
        />

        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar src={quiz.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
              {quiz.title ?? '?'}
            </Avatar>
            <Typography variant="h5">{quiz.title ?? 'Unnamed Quiz'}</Typography>
          </Box>
          <Box key={quiz.id} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {renderField('ID', quiz.id)}
              {renderField('Name', quiz.title)}
              {renderField('Description', quiz.description)}
              {/* {renderField('enablePlay', quiz.enablePlay ? 'Required' : 'Optional')} */}
              {renderField('Status', quiz.status)}
              {/* {renderField('Quiz Type', quiz.quizType)} */}
              {renderField('Category ID', quiz.categoryID)}
              {renderField('Category Name', quiz.category?.categoryName)}
              {renderField('Thumbnail ID', quiz.thumbnailID)}
              {renderField('Thumbnail Name', quiz.thumbnail?.name)}
            </Grid>
            {/* <Box mt={4}>
              {quiz?.video?.resourceUrl != null && (
                <CustomVideoPlayer src={quiz.video.resourceUrl} fullscreen={fullScreen} />
              )}
            </Box> */}
          </Box>
        </CardContent>

        <QuizDetailForm open={openQuizDetail} quizId={quiz?.id ?? null} onClose={() => { setOpenQuizDetail(false); }} />
      </Card>
    );
  };

  const renderUserInformation = () => {
    const user = userQuizProgress.user;
    if (!user) return null;

    const [openUserDetail, setOpenUserDetail] = useState(false);

    const handleViewQuizDetail = () => {
      setOpenUserDetail(true);
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title="User Information"
          action={
            <IconButton onClick={handleViewQuizDetail}>
              <InfoOutlined />
            </IconButton>
          }
        />
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

        <ViewUserDialog open={openUserDetail} userId={user?.id ?? null} onClose={() => { setOpenUserDetail(false); }} />
      </Card>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      {/* <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={userQuizProgress.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {userQuizProgress.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{userQuizProgress.name ?? 'Unnamed UserQuizProgress'}</Typography>
      </Box> */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title="UserQuizProgress Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', userQuizProgress.id)}
            {renderField('User ID', userQuizProgress.userId)}
            {renderField('Quiz ID', userQuizProgress.quizId)}
            {renderField('Progress Status', userQuizProgress.progressStatus)}
            {renderField('Active Status', userQuizProgress.activeStatus)}
            {renderField('Assigned At', DateTimeUtils.formatISODateToString(userQuizProgress.assignedAt))}
            {renderField('Custom Start Time', DateTimeUtils.formatISODateToString(userQuizProgress.customStartTime))}
            {renderField('Custom End Time', DateTimeUtils.formatISODateToString(userQuizProgress.customEndTime))}
            {renderField('Duration', userQuizProgress.duration)}
            {renderField('Score', userQuizProgress.score?.toString())}
            {renderField('Attempts', userQuizProgress.attempts?.toString())}
            {renderField('Started At', DateTimeUtils.formatISODateToString(userQuizProgress.startedAt))}
            {renderField('Completed At', DateTimeUtils.formatISODateToString(userQuizProgress.completedAt))}
            {renderField('Last Access', DateTimeUtils.formatISODateToString(userQuizProgress.lastAccess))}
            {renderField('Session ID', userQuizProgress.sessionId)}
            {renderField('IP Address', userQuizProgress.ipAddress)}
            {renderField('User Agent', userQuizProgress.userAgent)}
            {renderField('Device Info', userQuizProgress.deviceInfo)}
            {renderField('Device ID', userQuizProgress.deviceId)}
            {renderField('Device Name', userQuizProgress.deviceName)}
            {renderField('OS', userQuizProgress.os)}
            {renderField('Location', userQuizProgress.location)}
            {renderField('Enrollment ID', userQuizProgress.enrollmentId)}
            {renderField('Quiz Title', userQuizProgress.quiz?.title)}
          </Grid>
        </CardContent>
      </Card>{' '}
      {renderUserInformation()}
      {renderQuiz()}
    </Box>
  );
}

export default function UserQuizProgressDetailForm({ open, userQuizProgressId, onClose }: Props) {
  const { userQuizProgressUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [userQuizProgress, setUserQuizProgress] = useState<UserQuizProgressDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && userQuizProgressId && userQuizProgressUsecase) {
      setLoading(true);
      userQuizProgressUsecase
        .getUserQuizProgressById(userQuizProgressId)
        .then(setUserQuizProgress)
        .catch((error) => {
          console.error('Error fetching userQuizProgress details:', error);
          setUserQuizProgress(null);
        })
        .finally(() => { setLoading(false); });
    }
  }, [open, userQuizProgressId, userQuizProgressUsecase]);

  if (!userQuizProgressId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">UserQuizProgress Details</Typography>
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
        {loading || !userQuizProgress ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <UserQuizProgressDetails userQuizProgress={userQuizProgress} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
