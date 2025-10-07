import { useEffect, useState } from 'react';
import { UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';
import { type UserCourseProgressResponse } from '@/domain/models/user-course/response/user-course-progress-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { UserProgressEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';

interface EditUserCourseProgressDialogProps {
  open: boolean;
  data: UserCourseProgressResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserCourseProgressRequest) => void;
}

export function UpdateUserCourseProgressFormDialog({
  open,
  data: userCourseProgress,
  onClose,
  onSubmit,
}: EditUserCourseProgressDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const { userUsecase, courseUsecase, enrollUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateUserCourseProgressRequest>(new UpdateUserCourseProgressRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userCourseProgress && open) {
      const newFormData = new UpdateUserCourseProgressRequest({
        id: userCourseProgress.id || undefined,
        userID: userCourseProgress.userID || undefined,
        // courseId: userCourseProgress.courseID || '',
        progress: userCourseProgress.progress || undefined,
        startDate: userCourseProgress.startDate || undefined,
        endDate: userCourseProgress.endDate || undefined,
        lastAccess: userCourseProgress.lastAccess || undefined,
        status: userCourseProgress.status || undefined,
        enrollmentCriteriaID: userCourseProgress.enrollment?.enrollmentCriteriaID || undefined,
        actualStartDate: userCourseProgress.actualStartDate || undefined,
        actualEndDate: userCourseProgress.actualEndDate || undefined,
      });
      setFormData(newFormData);
    }
  }, [userCourseProgress, open, userUsecase, courseUsecase, enrollUsecase]);

  const handleChange = <K extends keyof UpdateUserCourseProgressRequest>(
    field: K,
    value: UpdateUserCourseProgressRequest[K]
  ) => {
    setFormData((prev) => new UpdateUserCourseProgressRequest({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      onSubmit(formData);
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userCourseProgress) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="subtitle1" component="div">
          {t('updateUserCourseProgress')}
        </Typography>
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

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body2" mb={2}>
            {t('id')}: {userCourseProgress?.id}
          </Typography>

          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <CourseSelectDialog
                courseUsecase={courseUseCase}
                value={formData.courseID ?? ''}
                onChange={(value: string) => handleChange('courseID', value)}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
              <UserSelectDialog
                userUsecase={userUsecase}
                value={formData.userID ?? ''}
                onChange={(value: string) => handleChange('userID', value)}
                disabled={false}
              />
            </Grid> */}

            {/* <Grid item xs={12}>
              <EnrollmentSingleSelect
                enrollmentUsecase={enrollUsecase}
                value={formData.enrollmentID ?? ''}
                onChange={(value: string) => handleChange('enrollmentID', value)}
                disabled={false}
                categoryEnum={CategoryEnum.Course}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startTime')}
                value={formData.startDate ? DateTimeUtils.formatISODateToString(formData.startDate) : undefined}
                onChange={(value) => {
                  handleChange('startDate', value);
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endTime')}
                value={formData.endDate ? DateTimeUtils.formatISODateToString(formData.endDate) : undefined}
                onChange={(value) => {
                  handleChange('endDate', value);
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('actualStartDate')}
                value={formData.actualStartDate}
                onChange={(value) => handleChange('actualStartDate', value)}
                disabled={false}
                allowClear={true}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('actualEndDate')}
                value={formData.actualEndDate}
                onChange={(value) => handleChange('actualEndDate', value)}
                disabled={false}
                allowClear={true}
              />
            </Grid>

            <Grid item xs={12}>
              {' '}
              <CustomSelectDropDown<string>
                label={t('status')}
                value={formData.status}
                onChange={(val) => {
                  handleChange('status', val);
                }}
                disabled={false}
                options={[
                  { value: UserProgressEnum[UserProgressEnum.NotStarted], label: 'notStarted' },
                  { value: UserProgressEnum[UserProgressEnum.Ongoing], label: 'ongoing' },
                  { value: UserProgressEnum[UserProgressEnum.Done], label: 'done' },
                ]}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            m: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
