import { useEffect, useState } from 'react';
import { UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';
import { type UserLessonProgressDetailResponse } from '@/domain/models/user-lesson/response/user-lesson-detail-response';
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

interface EditUserLessonProgressDialogProps {
  open: boolean;
  data: UserLessonProgressDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserLessonRequest) => void;
}

export function UpdateUserLessonProgressFormDialog({
  open,
  data: userLessonProgress,
  onClose,
  onSubmit,
}: EditUserLessonProgressDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const { userUsecase, lessonUsecase, enrollUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateUserLessonRequest>(new UpdateUserLessonRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userLessonProgress && open) {
      const newFormData = new UpdateUserLessonRequest({
        id: userLessonProgress.id || undefined,
        userID: userLessonProgress.userID || undefined,
        lessonID: userLessonProgress.lessonID || undefined,
        progress: userLessonProgress.progress || undefined,
        startDate: DateTimeUtils.formatISODateToString(userLessonProgress.startDate),
        endDate: DateTimeUtils.formatISODateToString(userLessonProgress.endDate),
        status: userLessonProgress.status || undefined,
        actualStartDate: userLessonProgress.actualStartDate || undefined,
        actualEndDate: userLessonProgress.actualEndDate || undefined,
      });
      setFormData(newFormData);
    }
  }, [userLessonProgress, open, userUsecase, lessonUsecase, enrollUsecase]);

  const handleChange = <K extends keyof UpdateUserLessonRequest>(field: K, value: UpdateUserLessonRequest[K]) => {
    setFormData((prev) => new UpdateUserLessonRequest({ ...prev, [field]: value }));
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

  if (!userLessonProgress) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateUserLessonProgress')}
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
            {t('id')}: {userLessonProgress?.id}
          </Typography>

          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <LessonSelectDialog
                lessonUsecase={lessonUsecase}
                value={formData.lessonID ?? ''}
                onChange={(value: string) => handleChange('lessonID', value)}
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
                categoryEnum={CategoryEnum.Lesson}
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
                onChange={(value) => {
                  handleChange('actualStartDate', value);
                }}
                disabled={false}
                allowClear
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('actualEndDate')}
                value={formData.actualEndDate}
                onChange={(value) => {
                  handleChange('actualEndDate', value);
                }}
                disabled={false}
                allowClear
              />
            </Grid>

            <Grid item xs={12}>
              {' '}
              <CustomSelectDropDown<string>
                label={t('status')}
                value={formData.status ?? ''}
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
