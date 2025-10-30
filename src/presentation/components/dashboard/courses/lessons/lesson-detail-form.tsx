'use client';

import React, { useEffect, useState } from 'react';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
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
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

import CustomFieldTypography from '../../../core/text-field/custom-typhography';

interface LessonDetailFormProps {
  open: boolean;
  lessonId: string | null;
  onClose: () => void;
}

function LessonDetails({ lesson, fullScreen }: { lesson: LessonDetailResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [quizExpandedLessons, setQuizExpandedLessons] = useState<Record<string, boolean>>({});
  // const [progressExpandedLessons, setProgressExpandedLessons] = useState<Record<string, boolean>>({});
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imageFullscreen, setImageFullscreen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFullScreen, setPreviewFullScreen] = useState(false);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollmentCriteria = () => {
    if (!lesson.enrollmentCriteria) return null;

    const criteria = lesson.enrollmentCriteria;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('enrollment')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('criteriaId', criteria.id)}
            {renderField('criteriaName', criteria.name)}
            {renderField('criteriaDescription', criteria.desc)}
            {renderField('criteriaTargetLevelId', criteria.targetLevelID)}
            {renderField('criteriaMaxCapacity', criteria.maxCapacity)}
            {renderField('criteriaTargetPharmacyId', criteria.targetPharmacyID)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderQuizzes = () => {
    if (!lesson.quizzes || lesson.quizzes.length === 0) return null;

    const toggleExpanded = (lessonId: string) => {
      setQuizExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('quizzes')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {lesson.quizzes.map((quiz, index) => {
          const lessonId = quiz.id ?? `${index}`;
          const isExpanded = quizExpandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={quiz.name ?? `${t('quiz')} ${index + 1}`}
                action={
                  <IconButton
                    onClick={() => {
                      toggleExpanded(lessonId);
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
                    {renderField('quizId', quiz.id)}
                    {renderField('quizName', quiz.name)}
                    {renderField('quizDetail', quiz.detail)}
                    {renderField('quizStatus', quiz.status)}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    );
  };

  // const renderUserProgress = () => {
  //   if (!lesson.userLessonProgress || lesson.userLessonProgress.length === 0) return null;

  //   const toggleExpanded = (lessonId: string) => {
  //     setProgressExpandedLessons((prev) => ({
  //       ...prev,
  //       [lessonId]: !prev[lessonId],
  //     }));
  //   };

  //   return (
  //     <Box sx={{ mb: 2 }}>
  //       <CardHeader title={t('userProgress')} sx={{ pl: 2, pb: 1, mb: 2 }} />
  //       {lesson.userLessonProgress.map((progress, index) => {
  //         const lessonId = progress.id ?? `${index}`;
  //         const isExpanded = progressExpandedLessons[lessonId] || false;

  //         return (
  //           <Card
  //             key={lessonId}
  //             sx={{
  //               mb: 3,
  //               mx: window.innerWidth < 600 ? 1 : 2,
  //             }}
  //           >
  //             <CardHeader
  //               title={progress.id ?? `Quiz ${index + 1}`}
  //               action={
  //                 <IconButton
  //                   onClick={() => {
  //                     toggleExpanded(lessonId);
  //                   }}
  //                   sx={{
  //                     transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
  //                     transition: 'transform 0.2s',
  //                   }}
  //                 >
  //                   <ExpandMoreIcon />
  //                 </IconButton>
  //               }
  //               sx={{ py: 1 }}
  //             />
  //             <Collapse in={isExpanded} timeout="auto" unmountOnExit>
  //               <CardContent>
  //                 <Grid container spacing={2}>
  //                   {renderField('progressId', progress.id)}
  //                   {renderField('progressUserID', progress.userID)}
  //                   {renderField('progressLessonID', progress.lessonID)}
  //                   {renderField(
  //                     'progressStartTime',
  //                     DateTimeUtils.formatISODateStringToString(progress.startDate ?? '')
  //                   )}
  //                   {renderField('progressEndTime', DateTimeUtils.formatISODateStringToString(progress.endDate ?? ''))}
  //                   {renderField('progressLastAccess', progress.lastAccess)}
  //                   {renderField('progressStatus', progress.status)}
  //                 </Grid>
  //               </CardContent>
  //             </Collapse>
  //           </Card>
  //         );
  //       })}
  //     </Box>
  //   );
  // };

  const renderVideoPreview = () => {
    if (!lesson.video?.resourceUrl) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('videoPreview')} />
        <CardContent>
          <CustomVideoPlayer src={lesson.video.resourceUrl} fullscreen />
        </CardContent>
      </Card>
    );
  };

  const renderCategory = () => {
    if (!lesson.category) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('category')} />
        <CardContent>
          <Box key={lesson.category.id}>
            <Grid container spacing={2}>
              {renderField('id', lesson.category.id)}
              {renderField('name', lesson.category.categoryName)}
              {renderField('description', lesson.category.description)}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderCourse = () => {
    if (!lesson.course) return null;

    const course = lesson.course;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('course')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', course.id)}
            {renderField('name', course.name)}
            {renderField('detail', course.detail)}
            {renderField('required', course.isRequired ? t('yes') : t('no'))}

            {renderField(
              'courseType',
              course.courseType ? t(course.courseType.charAt(0).toLowerCase() + course.courseType.slice(1)) : ''
            )}

            {renderField(
              'scheduleStatus',
              course.scheduleStatus
                ? t(course.scheduleStatus.charAt(0).toLowerCase() + course.scheduleStatus.slice(1))
                : ''
            )}

            {renderField(
              'displayType',
              course.displayType ? t(course.displayType.charAt(0).toLowerCase() + course.displayType.slice(1)) : ''
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderFiles = () => {
    if (!lesson.fileLessonRelation?.length) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('attachedFiles')} />
        <CardContent>
          <Grid container spacing={2}>
            {lesson.fileLessonRelation.map((r) => {
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
    <>
      <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box
            onClick={() => {
              setImagePreviewOpen(true);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <Avatar src={lesson.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
              {lesson.name?.[0] ?? '?'}
            </Avatar>
          </Box>
          <Typography variant="h5">{lesson.name ?? ''}</Typography>
        </Box>
        <Card sx={{ mb: 2 }}>
          <CardHeader title={t('lessonInformation')} />
          <CardContent>
            <Grid container spacing={2}>
              {renderField('lessonId', lesson.id)}
              {renderField('lessonCourseID', lesson.courseID)}
              {renderField('lessonName', lesson.name)}
              {renderField('lessonDetail', lesson.detail)}
              {renderField('enableAutoPlay', lesson.enablePlay ? t('yes') : t('no'))}
              {renderField('lessonStatus', t(lesson.status.charAt(0).toLowerCase() + t(lesson.status).slice(1)))}
              {/* {renderField('lessonType', t(lesson.lessonType.charAt(0).toLowerCase() + t(lesson.lessonType).slice(1)))} */}
              {renderField('lessonEnrollmentCriteriaID', lesson.enrollmentCriteriaID)}
              {renderField('lessonCategoryID', lesson.categoryID)}
              {renderField('lessonThumbnailID', lesson.thumbnailID)}
              {renderField('lessonVideoID', lesson.videoID)}
              {renderField('lessonCategoryName', lesson.category?.categoryName)}
              {renderField('lessonThumbnailFileName', lesson.thumbnail?.name)}
              {renderField('lessonVideoFileName', lesson.video?.name)}
            </Grid>
          </CardContent>
        </Card>{' '}
        {renderCourse()}
        {renderVideoPreview()}
        {renderFiles()}
        {renderCategory()}
        {renderQuizzes()}
        {renderEnrollmentCriteria()}
      </Box>
      <ImagePreviewDialog
        open={imagePreviewOpen}
        onClose={() => {
          setImagePreviewOpen(false);
        }}
        imageUrl={lesson.thumbnail?.resourceUrl || ''}
        title={lesson.name || t('thumbnailPreview')}
        fullscreen={imageFullscreen}
        onToggleFullscreen={() => {
          setImageFullscreen((prev) => !prev);
        }}
      />
    </>
  );
}

export default function LessonDetailForm({ open, lessonId, onClose }: LessonDetailFormProps) {
  const { t } = useTranslation();
  const { lessonUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [Lesson, setLesson] = useState<LessonDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && lessonId && lessonUsecase) {
      setLoading(true);
      lessonUsecase
        .getLessonById(lessonId)
        .then(setLesson)
        .catch(() => {
          setLesson(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, lessonId, lessonUsecase]);

  if (!lessonId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('lessonDetails')}</Typography>
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
        {loading || !Lesson ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <LessonDetails lesson={Lesson} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
