'use client';

import React, { useEffect, useState } from 'react';
import { type UserLessonProgressDetailResponse } from '@/domain/models/user-lesson/response/user-lesson-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { ExpandMore, InfoOutlined } from '@mui/icons-material';
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
  Collapse,
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
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';

import { ViewUserDialog } from '../../management/users/view-user-detail-dialog';
import QuizDetailForm from '../../quiz/quiz/quiz-detail-form';

interface UserLessonProgressDetailProps {
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
  const { t } = useTranslation();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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

  const renderLesson = () => {
    const lesson = userLessonProgress.lessons;
    if (!lesson) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('lessonDetails')} />
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar src={lesson.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
              {lesson.name?.[0] ?? '?'}
            </Avatar>
            <Typography variant="h5">{lesson.name ?? 'Unnamed Lesson'}</Typography>
          </Box>
          <Box key={lesson.id} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {renderField('id', lesson.id)}
              {renderField('name', lesson.name)}
              {renderField('description', lesson.detail)}
              {renderField('enableAutoPlay', lesson.enablePlay ? t('yes') : t('no'))}
              {renderField('status', lesson.status)}
              {renderField('lessonType', lesson.lessonType)}
              {renderField('categoryId', lesson.categoryID)}
              {renderField('categoryName', lesson.category?.categoryName)}
              {renderField('thumbnailId', lesson.thumbnailID)}
              {renderField('thumbnailName', lesson.thumbnail?.name)}
            </Grid>
            <Box mt={4}>
              {lesson?.video?.resourceUrl !== undefined && (
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
              {renderField('isActive', user.isActive ? t('yes') : t('no'))}
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

  const renderQuizProgress = () => {
    const lessons = userLessonProgress.userQuizProgressResponse;
    if (!lessons || lessons.length === 0) return null;

    const toggleExpanded = (courseId: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [courseId]: !prev[courseId],
      }));
    };

    const handleViewQuizDetail = (quizId: string) => {
      setOpenQuizDetailId(quizId);
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('userQuizProgress')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {lessons.map((quizEnroll, index) => {
          const lessonId = quizEnroll.id ?? `${t('quizzes')}-${index}`;
          const isExpanded = expandedItems[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={quizEnroll?.quiz?.title ?? `${t('lessons')} ${index + 1}`}
                titleTypographyProps={{
                  sx: {
                    fontSize: 18,
                    // color: courseEnroll.isCorrect ? theme.palette.primary.light : theme.palette.error.main,
                  },
                }}
                action={
                  <Box>
                    <IconButton
                      onClick={() => {
                        handleViewQuizDetail(quizEnroll.quizID ?? '');
                      }}
                    >
                      <InfoOutlined />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        toggleExpanded(lessonId);
                      }}
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Box>
                }
                sx={{ py: 1 }}
              />
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Grid container spacing={2}>
                    {renderField('id', quizEnroll.id)}
                    {renderField('detail', quizEnroll.quiz?.description)}
                    {renderField('isRequired', quizEnroll.quiz?.isRequired ? t('yes') : t('no'))}
                    {renderField(
                      'disableStatus',
                      quizEnroll.quiz?.status
                        ? t(quizEnroll.quiz?.status.charAt(0).toLowerCase() + t(quizEnroll.quiz?.status.slice(1)))
                        : ''
                    )}
                    {renderField(
                      'courseType',
                      quizEnroll.quiz?.type?.toString()
                        ? t(
                            quizEnroll.quiz?.type.toString().charAt(0).toLowerCase() +
                              t(quizEnroll.quiz?.type.toString().slice(1))
                          )
                        : ''
                    )}
                    {renderField('startDate', DateTimeUtils.formatDateTimeToDateString(quizEnroll.startedAt))}
                    {renderField('endDate', DateTimeUtils.formatDateTimeToDateString(quizEnroll.completedAt))}
                    {renderField('lastAccess', DateTimeUtils.formatDateTimeToDateString(quizEnroll.lastAccess))}
                    {renderField(
                      'status',
                      quizEnroll.progressStatus.toString()
                        ? t(
                            quizEnroll.progressStatus.toString().charAt(0).toLowerCase() +
                              t(quizEnroll.progressStatus.toString().slice(1))
                          )
                        : ''
                    )}
                  </Grid>
                </CardContent>
              </Collapse>

              <QuizDetailForm
                open={openQuizDetailId === quizEnroll.quizID}
                quizId={quizEnroll.quiz?.id ?? null}
                onClose={() => {
                  setOpenQuizDetailId(null);
                }}
              />
            </Card>
          );
        })}
      </Box>
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
        <CardHeader title={t('userLessonProgressInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', userLessonProgress.id)}
            {renderField('userID', userLessonProgress.userID)}
            {renderField('lessonId', userLessonProgress.lessonID)}
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
      {renderQuizProgress()}
    </Box>
  );
}

export default function UserLessonProgressDetailForm({
  open,
  userLessonProgressId,
  onClose,
}: UserLessonProgressDetailProps) {
  const { t } = useTranslation();

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
        .catch(() => {
          setUserLessonProgress(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userLessonProgressId, userLessonProgressUsecase]);

  if (!userLessonProgressId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('userLessonProgressDetails')}</Typography>
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
