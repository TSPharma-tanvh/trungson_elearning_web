'use client';

import React, { useEffect, useState } from 'react';
import { type UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { InfoOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
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
import { useTranslation } from 'react-i18next';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

import { ViewUserDialog } from '../../management/users/view-user-detail-dialog';
import QuizDetailForm from '../../quiz/quiz/quiz-detail-form';

interface UserQuizProgressDetailsProps {
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
  const { t } = useTranslation();
  const [openQuizDetailId, setOpenQuizDetailId] = useState<string | null>(null);
  const [openUserDetail, setOpenUserDetail] = useState(false);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 3 : 4}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderQuiz = () => {
    const quiz = userQuizProgress.quiz;
    if (!quiz) return null;

    const handleViewQuizDetail = (quizId: string) => {
      setOpenQuizDetailId(quizId);
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={t('quizDetails')}
          action={
            <IconButton onClick={() => { handleViewQuizDetail(quiz.id ?? ''); }}>
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
              {renderField('id', quiz.id)}
              {renderField('name', quiz.title)}
              {renderField('description', quiz.description)}
              {/* {renderField('enablePlay', quiz.enablePlay ? 'Required' : 'Optional')} */}
              {renderField('status', quiz.status)}
              {/* {renderField('Quiz Type', quiz.quizType)} */}
              {renderField('categoryId', quiz.categoryID)}
              {renderField('categoryName', quiz.category?.categoryName)}
              {renderField('thumbnailId', quiz.thumbnailID)}
            </Grid>
            {/* <Box mt={4}>
              {quiz?.video?.resourceUrl !== undefined && (
                <CustomVideoPlayer src={quiz.video.resourceUrl} fullscreen={fullScreen} />
              )}
            </Box> */}
          </Box>
        </CardContent>

        <QuizDetailForm
          open={openQuizDetailId === quiz.id}
          quizId={quiz?.id ?? null}
          onClose={() => {
            setOpenQuizDetailId(null);
          }}
        />
      </Card>
    );
  };

  const renderUserInformation = () => {
    const user = userQuizProgress.user;
    if (!user) return null;

    const handleViewUserDetail = () => {
      setOpenUserDetail(true);
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={t('userInformation')}
          action={
            <IconButton onClick={handleViewUserDetail}>
              <InfoOutlined />
            </IconButton>
          }
        />
        <CardContent>
          <Box key={user.id} sx={{ mb: 2 }}>
            {/* Avatar */}
            {user.employee?.avatar ? (
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
            ) : null}

            <Grid container spacing={2}>
              {renderField('id', user.id)}
              {renderField('username', user.userName)}
              {renderField('email', user.email)}
              {renderField('firstName', user.firstName)}
              {renderField('lastName', user.lastName)}
              {renderField('phoneNumber', user.phoneNumber)}
              {renderField('isActive', user.isActive ? 'Yes' : 'No')}
              {renderField('employeeId', user.employeeId)}
              {renderField('thumbnailId', user.thumbnailId)}
              {renderField('thumbnailName', user.thumbnail?.name)}
              {renderField('roles', user.roles?.join(', '))}
            </Grid>
          </Box>
        </CardContent>

        <ViewUserDialog
          open={openUserDetail}
          userId={user?.id ?? null}
          onClose={() => {
            setOpenUserDetail(false);
          }}
        />
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
        <CardHeader title={t('userQuizProgressInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', userQuizProgress.id)}
            {renderField('userId', userQuizProgress.userId)}
            {renderField('quizId', userQuizProgress.quizId)}
            {renderField('progressStatus', userQuizProgress.progressStatus)}
            {renderField('activeStatus', userQuizProgress.activeStatus)}
            {renderField('assignedAt', DateTimeUtils.formatISODateToString(userQuizProgress.assignedAt))}
            {renderField('startTime', DateTimeUtils.formatISODateToString(userQuizProgress.startTime))}
            {renderField('endTime', DateTimeUtils.formatISODateToString(userQuizProgress.endTime))}
            {renderField('duration', userQuizProgress.duration)}
            {renderField('score', userQuizProgress.score?.toString())}
            {renderField('attempts', userQuizProgress.attempts?.toString())}
            {renderField('startedAt', DateTimeUtils.formatISODateToString(userQuizProgress.startedAt))}
            {renderField('completedAt', DateTimeUtils.formatISODateToString(userQuizProgress.completedAt))}
            {renderField('lastAccess', DateTimeUtils.formatISODateToString(userQuizProgress.lastAccess))}
            {renderField('sessionId', userQuizProgress.sessionId)}
            {renderField('ipAddress', userQuizProgress.ipAddress)}
            {renderField('userAgent', userQuizProgress.userAgent)}
            {renderField('deviceInfo', userQuizProgress.deviceInfo)}
            {renderField('deviceId', userQuizProgress.deviceId)}
            {renderField('deviceName', userQuizProgress.deviceName)}
            {renderField('os', userQuizProgress.os)}
            {renderField('location', userQuizProgress.location)}
            {renderField('enrollmentId', userQuizProgress.enrollmentId)}
            {renderField('quizTitle', userQuizProgress.quiz?.title)}
          </Grid>
        </CardContent>
      </Card>{' '}
      {renderUserInformation()}
      {renderQuiz()}
    </Box>
  );
}

export default function UserQuizProgressDetailForm({
  open,
  userQuizProgressId,
  onClose,
}: UserQuizProgressDetailsProps) {
  const { t } = useTranslation();
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
        .catch(() => {
          setUserQuizProgress(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userQuizProgressId, userQuizProgressUsecase]);

  if (!userQuizProgressId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('userQuizProgressDetails')}</Typography>
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
