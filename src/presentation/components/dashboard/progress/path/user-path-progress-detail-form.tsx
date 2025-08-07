'use client';

import React, { useEffect, useState } from 'react';
import { type UserPathProgressDetailResponse } from '@/domain/models/user-path/response/user-path-progress-detail-response';
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

import CourseDetailForm from '../../courses/courses/course-detail-form';
import LessonDetailForm from '../../courses/lessons/lesson-detail-form';
import CoursePathDetailForm from '../../courses/path/course-path-detail-form';
import { ViewUserDialog } from '../../management/users/view-user-detail-dialog';
import QuizDetailForm from '../../quiz/quiz/quiz-detail-form';

interface UserPathProgressProps {
  open: boolean;
  userPathProgressId: string | null;
  onClose: () => void;
}

function UserPathProgressDetails({
  userPathProgress,
  fullScreen,
}: {
  userPathProgress: UserPathProgressDetailResponse;
  fullScreen: boolean;
}) {
  const { t } = useTranslation();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const [openCourseDetailId, setOpenCourseDetailId] = useState<string | null>(null);
  const [openLessonDetailId, setOpenLessonDetailId] = useState<string | null>(null);
  const [openQuizDetailId, setOpenQuizDetailId] = useState<string | null>(null);
  const [openUserDetail, setOpenUserDetail] = useState(false);
  const [openPathDetail, setOpenPathDetail] = useState(false);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderPath = () => {
    const coursePath = userPathProgress.coursePath;
    if (!coursePath) return null;

    const handleViewPathDetail = () => {
      setOpenPathDetail(true);
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={t('coursePath')}
          action={
            <IconButton onClick={handleViewPathDetail}>
              <InfoOutlined />
            </IconButton>
          }
        />
        <CardContent>
          <Box key={coursePath.id} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {renderField('id', coursePath.id)}
              {renderField('name', coursePath.name)}
              {renderField('description', coursePath.detail)}
              {renderField('isRequired', coursePath.isRequired ? t('yes') : t('no'))}
              {renderField(
                'startTime',
                coursePath.startTime ? DateTimeUtils.formatISODateFromString(coursePath.startTime) : ''
              )}
              {renderField(
                'endTime',
                coursePath.endTime ? DateTimeUtils.formatISODateFromString(coursePath.endTime) : ''
              )}
              {renderField(
                'status',
                coursePath.status ? t(coursePath.status.charAt(0).toLowerCase() + t(coursePath.status.slice(1))) : ''
              )}
              {renderField(
                'displayType',
                coursePath.displayType
                  ? t(coursePath.displayType.charAt(0).toLowerCase() + t(coursePath.displayType.slice(1)))
                  : ''
              )}
              {renderField('categoryId', coursePath.categoryID)}
              {renderField('categoryName', coursePath.category?.categoryName)}
              {renderField('thumbnailId', coursePath.thumbnailID)}
              {renderField('thumbnailName', coursePath.thumbnail?.name)}
            </Grid>
          </Box>
        </CardContent>
        <CoursePathDetailForm
          open={openPathDetail}
          coursePathId={coursePath?.id ?? null}
          onClose={() => {
            setOpenPathDetail(false);
          }}
        />{' '}
      </Card>
    );
  };

  const renderCoursesProgress = () => {
    const coursePath = userPathProgress.userCourseProgressResponse;
    if (!coursePath || coursePath.length === 0) return null;

    const toggleExpanded = (courseId: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [courseId]: !prev[courseId],
      }));
    };

    const handleViewCourseDetail = (lessonId: string) => {
      setOpenCourseDetailId(lessonId);
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('userCourseProgress')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {coursePath.map((courseEnroll, index) => {
          const lessonId = courseEnroll.id ?? `${t('lessons')}-${index}`;
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
                title={courseEnroll?.courses?.name ?? `${t('courses')} ${index + 1}`}
                titleTypographyProps={{
                  sx: {
                    fontSize: 18,
                    // color: courseEnroll.isCorrect ? theme.palette.primary.light : theme.palette.error.main,
                  },
                }}
                action={
                  <Box>
                    <IconButton onClick={() => handleViewCourseDetail(courseEnroll?.courseID ?? '')}>
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
                    {renderField('id', courseEnroll.id)}
                    {renderField('detail', courseEnroll.courses?.detail)}
                    {renderField('correct', courseEnroll.courses?.isRequired ? t('yes') : t('no'))}
                    {renderField(
                      'disableStatus',
                      courseEnroll.courses?.disableStatus
                        ? t(
                            courseEnroll.courses?.disableStatus.charAt(0).toLowerCase() +
                              t(courseEnroll.courses?.disableStatus.slice(1))
                          )
                        : ''
                    )}
                    {renderField(
                      'courseType',
                      courseEnroll.courses?.courseType
                        ? t(
                            courseEnroll.courses?.courseType.charAt(0).toLowerCase() +
                              t(courseEnroll.courses?.courseType.slice(1))
                          )
                        : ''
                    )}
                    {renderField('displayType', courseEnroll.courses?.displayType)}
                    {renderField('startDate', courseEnroll.startDate)}
                    {renderField('endDate', courseEnroll.endDate)}
                    {renderField('lastAccess', courseEnroll.lastAccess)}
                    {renderField(
                      'status',
                      courseEnroll.status
                        ? t(courseEnroll.status.charAt(0).toLowerCase() + t(courseEnroll.status.slice(1)))
                        : ''
                    )}
                  </Grid>
                </CardContent>
              </Collapse>

              <CourseDetailForm
                open={openCourseDetailId === courseEnroll.courseID}
                courseId={courseEnroll.courseID ?? null}
                onClose={() => {
                  setOpenCourseDetailId(null);
                }}
              />
            </Card>
          );
        })}
      </Box>
    );
  };

  const renderLessonsProgress = () => {
    const lessons = userPathProgress.userLessonProgressResponse;
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
                    <IconButton onClick={() => handleViewLessonDetail(lessonEnroll?.lessonID ?? '')}>
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
                    {renderField('startDate', DateTimeUtils.formatISODateFromDate(lessonEnroll.startDate))}
                    {renderField('endDate', DateTimeUtils.formatISODateFromDate(lessonEnroll.endDate))}
                    {renderField('lastAccess', DateTimeUtils.formatISODateFromDate(lessonEnroll.lastAccess))}
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
                lessonId={lessonEnroll?.lessonID ?? ''}
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
    const lessons = userPathProgress.userQuizProgressResponse;
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
                    <IconButton onClick={() => handleViewQuizDetail(quizEnroll.quizID ?? '')}>
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
                    {renderField('startDate', DateTimeUtils.formatISODateFromDate(quizEnroll.startedAt))}
                    {renderField('endDate', DateTimeUtils.formatISODateFromDate(quizEnroll.completedAt))}
                    {renderField('lastAccess', DateTimeUtils.formatISODateFromDate(quizEnroll.lastAccess))}
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
                quizId={quizEnroll.quizID ?? null}
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

  const renderUserInformation = () => {
    const user = userPathProgress.user;
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
              {renderField('ID', user.id)}
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

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      {/* <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={userPathProgress.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {userPathProgress.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{userPathProgress.name ?? 'Unnamed UserPathProgress'}</Typography>
      </Box> */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('userPathProgressInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', userPathProgress.id)}
            {renderField('userID', userPathProgress.userID)}
            {renderField('pathID', userPathProgress.pathID)}
            {renderField('progress', userPathProgress.progress)}
            {renderField('startDate', userPathProgress.startDate)}
            {renderField('endDate', userPathProgress.endDate)}
            {renderField('lastAccess', userPathProgress.lastAccess)}
            {renderField(
              'status',
              userPathProgress.status
                ? t(userPathProgress.status.charAt(0).toLowerCase() + t(userPathProgress.status.slice(1)))
                : ''
            )}
            {renderField('enrollmentID', userPathProgress.enrollmentID)}
          </Grid>
        </CardContent>
      </Card>
      {renderPath()}
      {renderUserInformation()}
      {renderCoursesProgress()}
      {renderLessonsProgress()}
      {renderQuizProgress()}
    </Box>
  );
}

export default function UserPathProgressDetailForm({ open, userPathProgressId, onClose }: UserPathProgressProps) {
  const { t } = useTranslation();
  const { userPathProgressUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [userPathProgress, setUserPathProgress] = useState<UserPathProgressDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && userPathProgressId && userPathProgressUsecase) {
      setLoading(true);
      userPathProgressUsecase
        .getUserPathProgressById(userPathProgressId)
        .then(setUserPathProgress)
        .catch(() => {
          setUserPathProgress(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userPathProgressId, userPathProgressUsecase]);

  if (!userPathProgressId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('userPathProgressDetails')}</Typography>
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
        {loading || !userPathProgress ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <UserPathProgressDetails userPathProgress={userPathProgress} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
