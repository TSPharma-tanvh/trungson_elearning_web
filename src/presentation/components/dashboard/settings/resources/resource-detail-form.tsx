'use client';

import React, { useEffect, useState } from 'react';
import { FileResourcesResponseForAdmin } from '@/domain/models/file/response/file-resources-for-admin-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Close as CloseIcon, ExpandMore, Fullscreen, FullscreenExit, InfoOutlined } from '@mui/icons-material';
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

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

import ClassDetailForm from '../../class/classes/class-detail-form';
import CourseDetailForm from '../../courses/courses/course-detail-form';
import LessonDetailForm from '../../courses/lessons/lesson-detail-form';
import QuizDetailForm from '../../quiz/quiz/quiz-detail-form';

interface ResourceDetailFormProps {
  open: boolean;
  resourceId: string | null;
  onClose: () => void;
}

function ResourceDetails({ resource, fullScreen }: { resource: FileResourcesResponseForAdmin; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFullScreen, setPreviewFullScreen] = useState(false);

  //detail id
  const [openCourseDetailId, setOpenCourseDetailId] = useState<string | null>(null);
  const [openLessonDetailId, setOpenLessonDetailId] = useState<string | null>(null);
  const [openQuizDetailId, setOpenQuizDetailId] = useState<string | null>(null);
  const [openClassDetailId, setOpenClassDetailId] = useState<string | null>(null);

  const toggle = (key: string) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const basicInfo = (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={resource.resourceUrl} sx={{ width: 80, height: 80 }}>
              {resource.name?.[0] ?? '?'}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {resource.name ?? t('unnamedResource')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('resourceType')}: {resource.type}
              </Typography>
            </Box>
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          {renderField('id', resource.id)}
          {renderField('sizeKB', resource.size ? `${(resource.size / 1024).toFixed(2)} KB` : undefined)}
          {renderField('status', resource.status)}
          {renderField('isThumbnail', resource.isThumbnail ? t('yes') : t('no'))}
          {renderField('categoryID', resource.categoryID)}
          {renderField('categoryName', resource.category?.categoryName)}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderSingleFile = () => {
    if (!resource) return null;

    const res = resource;
    const isImage = res.type?.startsWith('image');
    const isVideo = res.type?.startsWith('video');
    const isOther = !isImage && !isVideo;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('attachedFile')} />
        <CardContent>
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
            {isImage && (
              <Box
                component="img"
                src={res.resourceUrl}
                alt={res.name}
                onClick={() => setPreviewUrl(res.resourceUrl ?? '')}
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
            )}

            {isVideo && (
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
            )}

            {isOther && (
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
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  {t('download')} {res.name}
                </Button>
              </Box>
            )}
          </Box>

          <Typography variant="body2" noWrap>
            {res.name}
          </Typography>

          {previewUrl && (
            <ImagePreviewDialog
              open={!!previewUrl}
              onClose={() => setPreviewUrl(null)}
              imageUrl={previewUrl}
              title={t('imagePreview')}
              fullscreen={previewFullScreen}
              onToggleFullscreen={() => setPreviewFullScreen((prev) => !prev)}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  // const relationCounts = (
  //   <Card sx={{ mb: 2 }}>
  //     <CardHeader title={t('relationCounts')} />
  //     <CardContent>
  //       <Grid container spacing={2}>
  //         {renderField('fileClassQRRelation', resource.fileClassQRRelation.length)}
  //         {renderField('fileClassRelation', resource.fileClassRelation.length)}
  //         {renderField('fileCourseRelation', resource.fileCourseRelation.length)}
  //         {renderField('fileLessonRelation', resource.fileLessonRelation.length)}
  //         {renderField('fileQuestionRelation', resource.fileQuestionRelation.length)}
  //         {renderField('fileQuizRelation', resource.fileQuizRelation.length)}
  //       </Grid>
  //     </CardContent>
  //   </Card>
  // );

  // const renderSimpleRelationCard = (
  //   title: string,
  //   items: any[],
  //   renderItem: (item: any) => React.ReactNode,
  //   keyPrefix: string
  // ) => {
  //   if (!items.length) return null;
  //   const cardKey = `${keyPrefix}-card`;
  //   const isOpen = expanded[cardKey] ?? false;

  //   return (
  //     <Card sx={{ mb: 2 }}>
  //       <CardHeader
  //         title={`${title} (${items.length})`}
  //         action={
  //           <IconButton
  //             onClick={() => toggle(cardKey)}
  //             sx={{
  //               transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  //               transition: 'transform .2s',
  //             }}
  //           >
  //             <ExpandMore />
  //           </IconButton>
  //         }
  //       />
  //       <Collapse in={isOpen} timeout="auto" unmountOnExit>
  //         <CardContent>
  //           {items.map((it, idx) => (
  //             <Box key={`${keyPrefix}-${idx}`} sx={{ mb: 2, pl: 2, borderLeft: 2, borderColor: 'divider' }}>
  //               {renderItem(it)}
  //             </Box>
  //           ))}
  //         </CardContent>
  //       </Collapse>
  //     </Card>
  //   );
  // };

  // const relationDetails = (
  //   <>
  //     {renderSimpleRelationCard(
  //       t('fileLessonRelation'),
  //       resource.fileLessonRelation,
  //       (it) => (
  //         <Grid container spacing={1}>
  //           {renderField('relationId', it.id)}
  //           {renderField('lessonId', it.lessonId)}
  //           {renderField('lessonName', it.lesson?.name)}
  //         </Grid>
  //       ),
  //       'lesson'
  //     )}

  //     {renderSimpleRelationCard(
  //       t('fileClassRelation'),
  //       resource.fileClassRelation,
  //       (it) => (
  //         <Grid container spacing={1}>
  //           {renderField('relationId', it.id)}
  //           {renderField('classId', it.classId)}
  //           {renderField('className', it.class?.name)}
  //         </Grid>
  //       ),
  //       'class'
  //     )}

  //     {renderSimpleRelationCard(
  //       t('fileClassQRRelation'),
  //       resource.fileClassQRRelation,
  //       (it) => (
  //         <Grid container spacing={1}>
  //           {renderField('relationId', it.id)}
  //           {renderField('qrId', it.qrId)}
  //         </Grid>
  //       ),
  //       'qr'
  //     )}

  //     {renderSimpleRelationCard(
  //       t('fileQuestionRelation'),
  //       resource.fileQuestionRelation,
  //       (it) => (
  //         <Grid container spacing={1}>
  //           {renderField('relationId', it.id)}
  //           {renderField('questionId', it.questionId)}
  //         </Grid>
  //       ),
  //       'question'
  //     )}

  //     {renderSimpleRelationCard(
  //       t('fileQuizRelation'),
  //       resource.fileQuizRelation,
  //       (it) => (
  //         <Grid container spacing={1}>
  //           {renderField('relationId', it.id)}
  //           {renderField('quizId', it.quizId)}
  //           {renderField('quizTitle', it.quiz?.title)}
  //         </Grid>
  //       ),
  //       'quiz'
  //     )}
  //   </>
  // );

  const renderCourses = () => {
    if (!resource.fileCourseRelation || resource.fileCourseRelation.length === 0) return null;

    const [courseExpanded, setCourseExpanded] = useState<Record<string, boolean>>({});

    const toggleExpanded = (courseId: string) => {
      setCourseExpanded((prev) => ({
        ...prev,
        [courseId]: !prev[courseId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('courses')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {resource.fileCourseRelation.map((relation) => {
          const course = relation.course;
          if (!course) return null;

          const courseId = course.id ?? relation.id;
          const isExpanded = courseExpanded[courseId] || false;

          return (
            <Card
              key={courseId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '1rem' }}>{course.name?.[0] ?? '?'}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {course.name ?? t('unnamedCourse')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('courseId')}: {course.id}
                      </Typography>
                    </Box>
                  </Box>
                }
                action={
                  <Box>
                    <IconButton
                      onClick={() => {
                        setOpenCourseDetailId(course.id ?? '');
                      }}
                    >
                      <InfoOutlined />
                    </IconButton>
                    <IconButton
                      onClick={() => toggleExpanded(courseId)}
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Box>
                }
                sx={{ py: 1.5, pb: 1 }}
              />
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0 }}>
                  <Grid container spacing={2}>
                    {renderField('detail', course.detail)}
                    {renderField('isRequired', course.isRequired ? t('yes') : t('no'))}
                  </Grid>
                </CardContent>
              </Collapse>

              <CourseDetailForm
                open={openCourseDetailId === course.id}
                courseId={course.id ?? ''}
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

  const renderLessons = () => {
    if (!resource.fileLessonRelation || resource.fileLessonRelation.length === 0) return null;

    const [lessonExpanded, setLessonExpanded] = useState<Record<string, boolean>>({});

    const toggleExpanded = (LessonId: string) => {
      setLessonExpanded((prev) => ({
        ...prev,
        [LessonId]: !prev[LessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('Lessons')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {resource.fileLessonRelation.map((relation) => {
          const lesson = relation.lesson;
          if (!lesson) return null;

          const lessonId = lesson.id ?? relation.lessonId;
          const isExpanded = lessonExpanded[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '1rem' }}>{lesson.name?.[0] ?? '?'}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {lesson.name ?? t('unnamedLesson')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('LessonId')}: {lesson.id}
                      </Typography>
                    </Box>
                  </Box>
                }
                action={
                  <Box>
                    <IconButton
                      onClick={() => {
                        setOpenLessonDetailId(lesson.id ?? '');
                      }}
                    >
                      <InfoOutlined />
                    </IconButton>
                    <IconButton
                      onClick={() => toggleExpanded(lessonId)}
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Box>
                }
                sx={{ py: 1.5, pb: 1 }}
              />
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0 }}>
                  <Grid container spacing={2}>
                    {renderField('detail', lesson.detail)}
                    {renderField('isRequired', lesson.isRequired ? t('yes') : t('no'))}
                  </Grid>
                </CardContent>
              </Collapse>

              <LessonDetailForm
                open={openLessonDetailId === lesson.id}
                lessonId={lesson.id ?? ''}
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

  const renderQuizzes = () => {
    if (!resource.fileQuizRelation || resource.fileQuizRelation.length === 0) return null;

    const [quizExpanded, setQuizExpanded] = useState<Record<string, boolean>>({});

    const toggleExpanded = (courseId: string) => {
      setQuizExpanded((prev) => ({
        ...prev,
        [courseId]: !prev[courseId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('Quizzes')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {resource.fileQuizRelation.map((relation) => {
          const quiz = relation.quiz;
          if (!quiz) return null;

          const quizId = quiz.id ?? relation.quizId ?? '';
          const isExpanded = quizExpanded[quizId] || false;

          return (
            <Card
              key={quizId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '1rem' }}>{quiz.title?.[0] ?? '?'}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {quiz.title ?? t('unnamedCourse')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('courseId')}: {quiz.id}
                      </Typography>
                    </Box>
                  </Box>
                }
                action={
                  <Box>
                    <IconButton
                      onClick={() => {
                        setOpenCourseDetailId(quiz.id ?? '');
                      }}
                    >
                      <InfoOutlined />
                    </IconButton>
                    <IconButton
                      onClick={() => toggleExpanded(quizId)}
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Box>
                }
                sx={{ py: 1.5, pb: 1 }}
              />
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0 }}>
                  <Grid container spacing={2}>
                    {renderField('detail', quiz.description)}
                    {renderField('isRequired', quiz.isRequired ? t('yes') : t('no'))}
                  </Grid>
                </CardContent>
              </Collapse>

              <QuizDetailForm
                open={openQuizDetailId === quiz.id}
                quizId={quiz.id ?? ''}
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

  const renderClasses = () => {
    if (!resource.fileClassRelation || resource.fileClassRelation.length === 0) return null;

    const [classExpanded, setClassExpanded] = useState<Record<string, boolean>>({});

    const toggleExpanded = (ClassId: string) => {
      setClassExpanded((prev) => ({
        ...prev,
        [ClassId]: !prev[ClassId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('Classes')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {resource.fileClassRelation.map((relation) => {
          const classes = relation.class;
          if (!classes) return null;

          const classId = classes.id ?? relation.id;
          const isExpanded = classExpanded[classId] || false;

          return (
            <Card
              key={classId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '1rem' }}>{classes.className?.[0] ?? '?'}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {classes.className ?? t('unnamedClass')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('ClassId')}: {classes.id}
                      </Typography>
                    </Box>
                  </Box>
                }
                action={
                  <Box>
                    <IconButton
                      onClick={() => {
                        setOpenClassDetailId(classes.id ?? '');
                      }}
                    >
                      <InfoOutlined />
                    </IconButton>
                    <IconButton
                      onClick={() => toggleExpanded(classId)}
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Box>
                }
                sx={{ py: 1.5, pb: 1 }}
              />
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0 }}>
                  <Grid container spacing={2}>
                    {renderField('detail', classes.classDetail)}
                    {renderField('isRequired', classes.isRequired ? t('yes') : t('no'))}
                  </Grid>
                </CardContent>
              </Collapse>

              <ClassDetailForm
                open={openClassDetailId === classes.id}
                classId={classes.id ?? ''}
                onClose={() => {
                  setOpenClassDetailId(null);
                }}
              />
            </Card>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ p: fullScreen ? 2 : 1 }}>
      {basicInfo}
      {renderSingleFile()}
      {/* {relationCounts}
      {relationDetails} */}
      {renderCourses()}
      {renderLessons()}
      {renderQuizzes()}
      {renderClasses()}
    </Box>
  );
}

export default function ResourceDetailForm({ open, resourceId, onClose }: ResourceDetailFormProps) {
  const { t } = useTranslation();
  const { fileUsecase } = useDI();

  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState<FileResourcesResponseForAdmin | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && resourceId && fileUsecase) {
      setLoading(true);
      fileUsecase
        .getFileResourceById(resourceId)
        .then((raw) => setResource(FileResourcesResponseForAdmin.fromJson(raw)))
        .catch(() => setResource(null))
        .finally(() => setLoading(false));
    } else {
      setResource(null);
    }
  }, [open, resourceId, fileUsecase]);

  if (!resourceId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('resourceDetails')}</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((p) => !p)}>
            {fullScreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !resource ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <ResourceDetails resource={resource} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
