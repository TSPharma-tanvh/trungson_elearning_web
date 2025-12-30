'use client';

import React, { useEffect, useState } from 'react';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { InfoOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Button,
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
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

import QuizDetailForm from '../../quiz/quiz/quiz-detail-form';
import LessonDetailForm from '../lessons/lesson-detail-form';

interface CourseDetailProps {
  open: boolean;
  courseId: string | null;
  onClose: () => void;
}

function CourseDetails({ course, fullScreen }: { course: CourseDetailResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [courseExpandedLessons, setCourseExpandedLessons] = useState<Record<string, boolean>>({});
  const [courseExpandedQuizzes, setCourseExpandedQuizzes] = useState<Record<string, boolean>>({});

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFullScreen, setPreviewFullScreen] = useState(false);

  //lesson id
  const [openLessonDetailId, setOpenLessonDetailId] = useState<string | null>(null);
  const [openQuizDetailId, setOpenQuizDetailId] = useState<string | null>(null);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 3 : 4}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderCoursePath = () => {
    const coursePath = course.coursePath;
    if (!coursePath) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('coursePathInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', coursePath.id)}
            {renderField('name', coursePath.name)}
            {renderField('detail', coursePath.detail)}
            {renderField('isRequired', coursePath.isRequired ? t('yes') : t('no'))}
            {renderField(
              'status',
              coursePath.status ? t(coursePath.status?.charAt(0).toLowerCase() + t(coursePath.status).slice(1)) : ''
            )}
            {renderField(
              'displayType',
              coursePath.displayType
                ? t(coursePath.displayType?.charAt(0).toLowerCase() + t(coursePath.displayType).slice(1))
                : ''
            )}
            {renderField('categoryId', coursePath.categoryID)}
            {renderField('thumbnailId', coursePath.thumbnailID)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderCategory = () => {
    if (!course.category) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('category')} />
        <CardContent>
          <Box key={course.category.id}>
            <Grid container spacing={2}>
              {renderField('id', course.category.id)}
              {renderField('name', course.category.categoryName)}
              {renderField('description', course.category.description)}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderEnrollmentCriteria = () => {
    if (!course.courseEnrollments || course.courseEnrollments.length === 0) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('criteria')} />
        <CardContent>
          {course.courseEnrollments.map((relation, index) => {
            const criteria = relation.enrollmentCriteria;
            if (!criteria) return null;

            return (
              <Box key={relation.id ?? index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {t('criteria')} #{index + 1}
                </Typography>
                <Grid container spacing={2}>
                  {renderField('relationId', relation.id)}
                  {renderField('criteriaId', criteria.id)}
                  {renderField('name', criteria.name)}
                  {renderField('description', criteria.desc)}
                  {renderField(
                    'targetType',
                    criteria.targetType
                      ? t(criteria.targetType?.charAt(0).toLowerCase() + t(criteria.targetType).slice(1))
                      : ''
                  )}
                  {renderField('targetID', criteria.targetID)}
                  {renderField('targetLevelID', criteria.targetLevelID)}
                  {renderField('maxCapacity', criteria.maxCapacity)}
                  {renderField('targetPharmacyID', criteria.targetPharmacyID)}
                </Grid>
              </Box>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const renderCollections = () => {
    const collections = course.collections;
    if (!collections || collections.length === 0) return null;

    const toggleLessonExpand = (id: string) => {
      setCourseExpandedLessons((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    const toggleQuizExpand = (id: string) => {
      setCourseExpandedQuizzes((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    const handleViewLessonDetail = (lessonId: string) => {
      setOpenLessonDetailId(lessonId);
    };

    const handleViewQuizDetail = (lessonId: string) => {
      setOpenQuizDetailId(lessonId);
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('parts')} sx={{ pl: 2, pb: 1, mb: 2 }} />

        {collections.map((collection, colIndex) => {
          const colId = collection.id ?? `collection-${colIndex}`;
          const colExpanded = courseExpandedLessons[colId] || false;

          return (
            <Card key={colId} sx={{ mb: 3, mx: window.innerWidth < 600 ? 1 : 2 }}>
              <CardHeader
                title={`${collection.order}. ${collection.name}`}
                subheader={
                  course.isFixedCourse
                    ? collection.fixedCourseDayDuration
                      ? `${t('duration')}: ${collection.fixedCourseDayDuration} ${t('days')}`
                      : ''
                    : collection.startDate && collection.endDate
                      ? `${t('from')}: ${DateTimeUtils.formatISODateStringToString(collection.startDate)}  ${t('to')}: ${DateTimeUtils.formatISODateStringToString(collection.endDate)}`
                      : ''
                }
                action={
                  <IconButton
                    onClick={() => {
                      toggleLessonExpand(colId);
                    }}
                    sx={{
                      transform: colExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                }
                sx={{ py: 1 }}
              />

              <Collapse in={colExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <SectionTitle icon={<InfoOutlined fontSize="small" />} title={t('lessons')} />

                  {collection.lessons?.length ? (
                    collection.lessons.map((lesson, idx) => {
                      const lessonId = lesson.id ?? `lesson-${idx}`;
                      const lessonExpanded = courseExpandedLessons[lessonId] || false;

                      return (
                        <Card
                          key={lessonId}
                          sx={{
                            mb: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            boxShadow: 'none',
                          }}
                        >
                          <CardHeader
                            title={lesson.name ?? `Lesson ${idx + 1}`}
                            action={
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  onClick={() => {
                                    handleViewLessonDetail(lesson.id ?? '');
                                  }}
                                >
                                  <InfoOutlined />
                                </IconButton>

                                <IconButton
                                  onClick={() => {
                                    toggleLessonExpand(lessonId);
                                  }}
                                  sx={{
                                    transform: lessonExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                  }}
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              </Stack>
                            }
                            sx={{ py: 1 }}
                          />

                          {/* lesson content */}
                          <Collapse in={lessonExpanded} timeout="auto" unmountOnExit>
                            <CardContent>
                              <Grid container spacing={2}>
                                {renderField('id', lesson.id)}
                                {renderField('detail', lesson.detail)}
                                {renderField('order', lesson.order)}
                                {renderField('enableAutoPlay', lesson.enablePlay ? t('yes') : t('no'))}
                                {renderField('status', lesson.status)}
                                {renderField('categoryID', lesson.categoryID)}
                                {renderField('thumbnailID', lesson.thumbnailID)}
                                {renderField('videoID', lesson.videoID)}
                              </Grid>
                            </CardContent>
                          </Collapse>
                        </Card>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('noLessons')}
                    </Typography>
                  )}
                </CardContent>
              </Collapse>

              <Collapse in={colExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <SectionTitle icon={<InfoOutlined fontSize="small" />} title={t('quizzes')} />

                  {collection.quizzes?.length ? (
                    collection.quizzes.map((quiz, idx) => {
                      const quizId = quiz.id ?? `lesson-${idx}`;
                      const quizExpanded = courseExpandedQuizzes[quizId] || false;

                      return (
                        <Card
                          key={quizId}
                          sx={{
                            mb: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            boxShadow: 'none',
                          }}
                        >
                          <CardHeader
                            title={quiz.title ?? `Lesson ${idx + 1}`}
                            action={
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  onClick={() => {
                                    handleViewQuizDetail(quiz.id ?? '');
                                  }}
                                >
                                  <InfoOutlined />
                                </IconButton>

                                <IconButton
                                  onClick={() => {
                                    toggleQuizExpand(quizId);
                                  }}
                                  sx={{
                                    transform: quizExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                  }}
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              </Stack>
                            }
                            sx={{ py: 1 }}
                          />

                          {/* lesson content */}
                          <Collapse in={quizExpanded} timeout="auto" unmountOnExit>
                            <CardContent>
                              <Grid container spacing={2}>
                                {renderField('id', quiz.id)}
                                {renderField('detail', quiz.description)}
                              </Grid>
                            </CardContent>
                          </Collapse>
                        </Card>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('noQuizzes')}
                    </Typography>
                  )}
                </CardContent>
              </Collapse>
            </Card>
          );
        })}

        {/* lesson detail form */}
        <LessonDetailForm
          open={Boolean(openLessonDetailId)}
          lessonId={openLessonDetailId ?? ''}
          onClose={() => {
            setOpenLessonDetailId(null);
          }}
        />

        <QuizDetailForm
          open={Boolean(openQuizDetailId)}
          quizId={openQuizDetailId}
          onClose={() => {
            setOpenQuizDetailId(null);
          }}
        />
      </Box>
    );
  };

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <Box display="flex" alignItems="center" gap={1} mb={1} mt={2}>
      {icon}
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
    </Box>
  );

  const renderTeacher = () => {
    if (!course.classTeacher) return null;

    const teacher = course.classTeacher;
    const user = teacher.user;
    const employee = user?.employee;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('teacherInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {/* Avatar + Name */}
            <Grid item xs={12} display="flex" alignItems="center" gap={2}>
              <Avatar src={user?.thumbnail?.resourceUrl ?? user?.employee?.avatar} sx={{ width: 64, height: 64 }}>
                {user?.employee?.name ?? '?'}
              </Avatar>
              <Box>
                <Typography variant="h6">{user?.employee?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.userName}
                </Typography>
              </Box>
            </Grid>

            {/* Teacher Info Fields */}
            {renderField('teacherId', teacher.id)}
            {renderField(
              'status',
              teacher.status !== undefined
                ? t(teacher.status?.charAt(0).toLowerCase() + t(teacher.status).slice(1))
                : ''
            )}
            {renderField('description', teacher.description)}

            {/* User Details */}
            {renderField('userName', user?.userName)}
            {renderField('phoneNumber', user?.phoneNumber)}
            {renderField('employeeId', user?.employeeId)}

            {/* Employee Details */}
            {/* {renderField('title', employee?.title)}
            {renderField('department', employee?.currentDepartmentName)}
            {renderField('position', employee?.currentPositionName)} */}
            {renderField('gender', employee?.gender)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderFiles = () => {
    if (!course.fileCourseRelation?.length) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('fileResource')} />
        <CardContent>
          <Grid container spacing={2}>
            {course.fileCourseRelation.map((r) => {
              const res = r.fileResources;
              if (!res) return null;

              const isImage = res.type?.startsWith('image');
              const isVideo = res.type?.startsWith('video');
              const isOther = !isImage && !isVideo;

              return (
                <Grid item xs={12} sm={fullScreen ? 4 : 6} key={res.id}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%',
                      borderRadius: 1,
                      overflow: 'hidden',
                      mb: 1,
                    }}
                  >
                    {isImage ? (
                      <Box
                        component="img"
                        src={res.resourceUrl}
                        alt={res.name}
                        onClick={() => {
                          setPreviewUrl(res.resourceUrl ?? '');
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                      />
                    ) : null}

                    {isVideo ? (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <CustomVideoPlayer src={res.resourceUrl ?? ''} fullscreen={fullScreen} />
                      </Box>
                    ) : null}

                    {isOther ? (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          href={res.resourceUrl ?? '#'}
                          download={res.name}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          {t('download')} {res.name}
                        </Button>
                      </Box>
                    ) : null}
                  </Box>

                  <Typography variant="body2" noWrap>
                    {res.name}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>

          {/* Preview image modal */}
          {previewUrl ? (
            <ImagePreviewDialog
              open={Boolean(previewUrl)}
              onClose={() => {
                setPreviewUrl(null);
              }}
              imageUrl={previewUrl}
              title={t('imagePreview')}
              fullscreen={previewFullScreen}
              onToggleFullscreen={() => {
                setPreviewFullScreen((prev) => !prev);
              }}
            />
          ) : null}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={course.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {course.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{course.name ?? t('unnamedCourse')}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('courseInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', course.id)}
            {renderField('name', course.name)}
            {renderField('detail', course.detail)}
            {renderField('isRequired', course.isRequired ? t('yes') : t('no'))}
            {renderField(
              'courseType',
              course.courseType ? t(course.courseType.charAt(0).toLowerCase() + t(course.courseType).slice(1)) : ''
            )}
            {renderField(
              'displayType',
              course.displayType ? t(course.displayType.charAt(0).toLowerCase() + t(course.displayType).slice(1)) : ''
            )}
            {renderField(
              'disableStatus',
              course.disableStatus
                ? t(course.disableStatus.charAt(0).toLowerCase() + t(course.disableStatus).slice(1))
                : ''
            )}
            {/* {renderField(
              'scheduleStatus',
              course.scheduleStatus
                ? t(course.scheduleStatus.charAt(0).toLowerCase() + t(course.scheduleStatus).slice(1))
                : ''
            )} */}
            {/* {renderField('teacherId', course.teacherId)} */}
            {/* {renderField('meetingLink', course.meetingLink)} */}
            {/* {renderField('enrollmentCriteriaId', course.enrollmentCriteria.id)} */}
            {/* {renderField('categoryId', course.categoryId)} */}
            {renderField('thumbnailId', course.thumbnailId)}
            {renderField('courseDurationType', course.isFixedCourse ? t('duration') : t('time'))}
            {renderField('isRequired', course.isRequired ? t('yes') : t('no'))}
            {renderField('positionName', course.positionName)}
            {renderField('positionStateName', course.positionStateName)}
            {renderField('departmentTypeName', course.departmentTypeName)}
          </Grid>
        </CardContent>
      </Card>
      {renderCoursePath()}
      {renderTeacher()}
      {renderCollections()}
      {renderFiles()}
      {renderCategory()}
      {renderEnrollmentCriteria()}
    </Box>
  );
}

export default function CourseDetailForm({ open, courseId, onClose }: CourseDetailProps) {
  const { t } = useTranslation();
  const { courseUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && courseId && courseUsecase) {
      setLoading(true);
      courseUsecase
        .getCourseById(courseId)
        .then(setCourse)
        .catch(() => {
          setCourse(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, courseId, courseUsecase]);

  if (!courseId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('courseDetails')}</Typography>
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
        {loading || !course ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <CourseDetails course={course} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
