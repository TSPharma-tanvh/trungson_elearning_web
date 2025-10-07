import { useEffect, useState } from 'react';
import { type ClassTeacherResponse } from '@/domain/models/teacher/response/class-teacher-response';
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
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

interface ClassTeacherDetailFormProps {
  open: boolean;
  classId: string | null;
  onClose: () => void;
}

export default function ClassTeacherDetailForm({ open, classId: teacherId, onClose }: ClassTeacherDetailFormProps) {
  const { t } = useTranslation();
  const { classTeacherUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState<ClassTeacherResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && teacherId && classTeacherUsecase) {
      setLoading(true);
      classTeacherUsecase
        .getClassTeacherById(teacherId)
        .then(setTeacher)
        .catch(() => {
          setTeacher(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, teacherId, classTeacherUsecase]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('teacherDetails')}</Typography>
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
        {loading || !teacher ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <TeacherDetails teacher={teacher} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TeacherDetails({ teacher, fullScreen }: { teacher: ClassTeacherResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [classExpandedLessons, setClassExpandedLessons] = useState<Record<string, boolean>>({});
  const [courseExpandedLessons, setCourseExpandedLessons] = useState<Record<string, boolean>>({});

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderCourses = () => {
    if (!teacher.courses || teacher.courses.length === 0) return null;

    const toggleExpanded = (lessonId: string) => {
      setCourseExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('courses')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {teacher.courses.map((course, index) => {
          const lessonId = course.id ?? `${t('courses')} ${index}`;
          const isExpanded = courseExpandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={course.name ?? `Lesson ${index + 1}`}
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
                    {renderField(t('id'), course.id)}
                    {renderField(t('name'), course.name)}
                    {renderField(t('detail'), course.detail)}
                    {renderField(t('required'), course.isRequired ? t('yes') : t('no'))}
                    {renderField(t('status'), course.disableStatus)}
                    {renderField(t('courseType'), course.courseType)}
                    {renderField(t('displayType'), course.displayType)}
                    {renderField(t('meetingLink'), course.meetingLink)}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    );
  };

  // render class
  const renderClasses = () => {
    if (!teacher.classes || teacher.classes.length === 0) return null;

    const toggleExpanded = (lessonId: string) => {
      setClassExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('class')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {teacher.classes.map((classData, index) => {
          const lessonId = classData.id ?? `${t('classes')} ${index}`;
          const isExpanded = classExpandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={classData.className ?? `${t('classes')} ${index + 1}`}
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
                    {renderField('id', classData.id)}
                    {renderField('className', classData.className)}
                    {renderField('classDetail', classData.classDetail)}
                    {renderField('duration', classData.duration)}
                    {renderField('startAt', DateTimeUtils.formatDateTimeToDateString(classData.startAt))}
                    {renderField('endAt', DateTimeUtils.formatDateTimeToDateString(classData.endAt))}
                    {renderField('', classData.qrCode?.resourceUrl)}
                    {renderField('minuteLate', classData.minuteLate)}
                    {renderField(
                      'classType',
                      classData.classType
                        ? t(classData.classType.charAt(0).toLowerCase() + classData.classType.slice(1))
                        : ''
                    )}
                    {renderField('meetingLink', classData.meetingLink)}
                    {renderField(
                      'scheduleStatus',
                      classData.scheduleStatus
                        ? t(classData.scheduleStatus.charAt(0).toLowerCase() + classData.scheduleStatus.slice(1))
                        : ''
                    )}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar
          src={teacher.user?.thumbnail?.resourceUrl ?? teacher.user?.employee?.avatar}
          sx={{ width: 64, height: 64 }}
        >
          {teacher?.user?.firstName?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">
          {teacher.user?.employee?.name} ({teacher.user?.userName})
        </Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('teacherInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('teacherName', teacher.user?.firstName)}
            {renderField('email', teacher.user?.email)}
            {renderField('phone', teacher.user?.phoneNumber)}
            {renderField('active', teacher.user?.isActive ? t('yes') : t('no'))}
          </Grid>
        </CardContent>
      </Card>
      {renderCourses()}
      {renderClasses()}
    </Box>
  );
}
