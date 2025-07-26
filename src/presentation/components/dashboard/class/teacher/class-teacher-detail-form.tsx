import { error } from 'node:console';

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

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

interface Props {
  open: boolean;
  classId: string | null;
  onClose: () => void;
}

export default function ClassTeacherDetailForm({ open, classId: teacherId, onClose }: Props) {
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
        .catch((error) => {
          console.error('Error fetching teacher details:', error);
          setTeacher(null);
        })
        .finally(() => { setLoading(false); });
    }
  }, [open, teacherId, classTeacherUsecase]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Teacher Details</Typography>
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
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderCourses = () => {
    if (!teacher.courses || teacher.courses.length === 0) return null;

    const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});

    const toggleExpanded = (lessonId: string) => {
      setExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title="Courses" sx={{ pl: 2, pb: 1, mb: 2 }} />
        {teacher.courses.map((course, index) => {
          const lessonId = course.id ?? `lesson-${index}`;
          const isExpanded = expandedLessons[lessonId] || false;

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
                    onClick={() => { toggleExpanded(lessonId); }}
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
                    {renderField('ID', course.id)}
                    {renderField('Name', course.name)}
                    {renderField('Detail', course.detail)}
                    {renderField('Required', course.isRequired ? 'Yes' : 'No')}
                    {renderField('Status', course.disableStatus)}
                    {renderField('Course Type', course.courseType)}
                    {renderField('Display Type', course.displayType)}
                    {renderField('Start Time', DateTimeUtils.formatISODateFromDate(course.startTime))}
                    {renderField('End Time', DateTimeUtils.formatISODateFromDate(course.endTime))}
                    {renderField('Meeting link', course.meetingLink)}
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

    const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});

    const toggleExpanded = (lessonId: string) => {
      setExpandedLessons((prev) => ({
        ...prev,
        [lessonId]: !prev[lessonId],
      }));
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title="Courses" sx={{ pl: 2, pb: 1, mb: 2 }} />
        {teacher.classes.map((classData, index) => {
          const lessonId = classData.id ?? `lesson-${index}`;
          const isExpanded = expandedLessons[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={classData.className ?? `Lesson ${index + 1}`}
                action={
                  <IconButton
                    onClick={() => { toggleExpanded(lessonId); }}
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
                    {renderField('ID', classData.id)}
                    {renderField('Name', classData.className)}
                    {renderField('Detail', classData.classDetail)}
                    {renderField('Duration', classData.duration)}
                    {renderField('Start Time', DateTimeUtils.formatISODateFromDate(classData.startAt))}
                    {renderField('End Time', DateTimeUtils.formatISODateFromDate(classData.endAt))}
                    {renderField('QR Code URL', classData.qrCodeURL)}
                    {renderField('Minute Late', classData.minuteLate)}
                    {renderField('Class Type', classData.classType)}
                    {renderField('Meeting link', classData.meetingLink)}
                    {renderField('Schedule Status', classData.scheduleStatus)}
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
        <Avatar src={teacher?.user?.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {teacher?.user?.firstName?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">
          {teacher?.user?.firstName} {teacher?.user?.lastName}
        </Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Teacher Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Teacher Name', teacher.user?.firstName)}
            {renderField('Email', teacher.user?.email)}
            {renderField('Phone', teacher.user?.phoneNumber)}
            {renderField('Active', teacher.user?.isActive ? 'Yes' : 'No')}
          </Grid>
        </CardContent>
      </Card>
      {renderCourses()}
      {renderClasses()}
    </Box>
  );
}
