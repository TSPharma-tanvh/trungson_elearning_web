'use client';

import React, { useEffect, useState } from 'react';
import { type UserCourseProgressResponse } from '@/domain/models/user-course/response/user-course-progress-response';
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

import LessonDetailForm from '../../courses/lessons/lesson-detail-form';
import { ViewUserDialog } from '../../management/users/view-user-detail-dialog';
import QuizDetailForm from '../../quiz/quiz/quiz-detail-form';

interface UserCourseProgressProps {
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
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [openLessonDetailId, setOpenLessonDetailId] = useState<string | null>(null);
  const [openQuizDetailId, setOpenQuizDetailId] = useState<string | null>(null);
  const [openUserDetail, setOpenUserDetail] = useState(false);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderCourse = () => {
    const course = userCourseProgress.courses;
    if (!course) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('course')} />
        <CardContent>
          <Box key={course.id} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {renderField('id', course.id)}
              {renderField('name', course.name)}
              {renderField('description', course.detail)}
              {renderField('isRequired', course.isRequired ? t('yes') : t('no'))}
              {/* {renderField('startTime', course.startTime ? new Date(course.startTime).toLocaleString() : '')}
              {renderField('endTime', course.endTime ? new Date(course.endTime).toLocaleString() : '')} */}
              {renderField(
                'status',
                course.disableStatus
                  ? t(course.disableStatus.charAt(0).toLowerCase() + t(course.disableStatus).slice(1))
                  : ''
              )}
              {renderField(
                'scheduleStatus',
                course.scheduleStatus
                  ? t(course.scheduleStatus.charAt(0).toLowerCase() + t(course.scheduleStatus).slice(1))
                  : ''
              )}
              {renderField(
                'displayType',
                course.displayType ? t(course.displayType.charAt(0).toLowerCase() + t(course.displayType).slice(1)) : ''
              )}
              {renderField('categoryId', course.categoryId)}
              {renderField('categoryName', course.category?.categoryName)}
              {renderField('thumbnailId', course.thumbnailId)}
              {renderField('thumbnailName', course.thumbnail?.name)}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderUserInformation = () => {
    const user = userCourseProgress.user;
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

  const renderLessonsProgress = () => {
    const lessons = userCourseProgress.userLessonProgressResponse;
    if (!lessons || lessons.length === 0) return null;

    const toggleExpanded = (courseId: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [courseId]: !prev[courseId],
      }));
    };

    const handleViewLessonDetail = (lessonId: string) => {
      setOpenLessonDetailId(lessonId);
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('userLessonProgress')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {lessons.map((lessonEnroll, index) => {
          const lessonId = lessonEnroll.id ?? `${t('lessons')}-${index}`;
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
                title={lessonEnroll?.lessons?.name ?? `${t('lessons')} ${index + 1}`}
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
                        handleViewLessonDetail(lessonEnroll?.lessonID ?? '');
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
                    {renderField('id', lessonEnroll.id)}
                    {renderField('detail', lessonEnroll.lessons?.detail)}
                    {renderField('correct', lessonEnroll.lessons?.enablePlay ? t('yes') : t('no'))}
                    {renderField(
                      'disableStatus',
                      lessonEnroll.lessons?.status
                        ? t(
                            lessonEnroll.lessons?.status.charAt(0).toLowerCase() +
                              t(lessonEnroll.lessons?.status.slice(1))
                          )
                        : ''
                    )}
                    {renderField(
                      'courseType',
                      lessonEnroll.lessons?.lessonType
                        ? t(
                            lessonEnroll.lessons?.lessonType.charAt(0).toLowerCase() +
                              t(lessonEnroll.lessons?.lessonType.slice(1))
                          )
                        : ''
                    )}
                    {renderField('startDate', DateTimeUtils.formatDateTimeToDateString(lessonEnroll.startDate))}
                    {renderField('endDate', DateTimeUtils.formatDateTimeToDateString(lessonEnroll.endDate))}
                    {renderField(
                      'lastAccess',
                      DateTimeUtils.formatISODateStringToString(lessonEnroll.lastAccess ?? '')
                    )}
                    {renderField(
                      'status',
                      lessonEnroll.status
                        ? t(lessonEnroll.status.charAt(0).toLowerCase() + t(lessonEnroll.status.slice(1)))
                        : ''
                    )}
                  </Grid>
                </CardContent>
              </Collapse>

              <LessonDetailForm
                open={openLessonDetailId === lessonEnroll?.lessonID}
                lessonId={lessonEnroll?.lessons?.id ?? ''}
                onClose={() => {
                  setOpenLessonDetailId(null);
                }}
              />
            </Card>
          );
        })}
      </Box>
    );
  };

  const renderQuizProgress = () => {
    const quizzes = userCourseProgress.userQuizProgressResponse;
    if (!quizzes || quizzes.length === 0) return null;

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
        {quizzes.map((quizEnroll, index) => {
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
        <Avatar src={userCourseProgress.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {userCourseProgress.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{userCourseProgress.name ?? 'Unnamed UserCourseProgress'}</Typography>
      </Box> */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('userCourseProgressInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', userCourseProgress.id)}
            {renderField('userID', userCourseProgress.userID)}
            {renderField('courseID', userCourseProgress.courseID)}
            {renderField('progress', userCourseProgress.progress)}
            {renderField('startDate', userCourseProgress.startDate)}
            {renderField('endDate', userCourseProgress.endDate)}
            {renderField('lastAccess', userCourseProgress.lastAccess)}
            {renderField(
              'status',
              userCourseProgress.status
                ? t(userCourseProgress.status.charAt(0).toLowerCase() + t(userCourseProgress.status).slice(1))
                : ''
            )}
            {renderField('enrollmentID', userCourseProgress.enrollmentID)}
          </Grid>
        </CardContent>
      </Card>
      {renderCourse()}
      {renderUserInformation()}
      {renderLessonsProgress()}
      {renderQuizProgress()}
    </Box>
  );
}

export default function UserCourseProgressDetailForm({ open, userCourseProgressId, onClose }: UserCourseProgressProps) {
  const { t } = useTranslation();
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
        .catch(() => {
          setUserCourseProgress(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userCourseProgressId, userCourseProgressUsecase]);

  if (!userCourseProgressId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('userCourseProgressDetails')}</Typography>
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
