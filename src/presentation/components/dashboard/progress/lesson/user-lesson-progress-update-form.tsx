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

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

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
        startDate: userLessonProgress.startDate || undefined,
        endDate: userLessonProgress.endDate || undefined,
        lastAccess: userLessonProgress.lastAccess || undefined,
        status: userLessonProgress.status || undefined,
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userLessonProgress) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update UserLessonProgress
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
            ID: {userLessonProgress?.id}
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
                label="Thời gian bắt đầu"
                value={formData.startDate ? DateTimeUtils.formatISODateToString(formData.startDate) : undefined}
                onChange={(value) => {
                  handleChange('startDate', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian kết thúc"
                value={formData.endDate ? DateTimeUtils.formatISODateToString(formData.endDate) : undefined}
                onChange={(value) => {
                  handleChange('endDate', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
              {' '}
              <CustomSelectDropDown<string>
                label="Trạng thái"
                value={formData.status ?? ''}
                onChange={(val) => {
                  handleChange('status', val);
                }}
                disabled={false}
                options={[
                  { value: UserProgressEnum[UserProgressEnum.NotStarted], label: 'Chưa bắt đầu' },
                  { value: UserProgressEnum[UserProgressEnum.Ongoing], label: 'Đang làm' },
                  { value: UserProgressEnum[UserProgressEnum.Done], label: 'Hoàn thành' },
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
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
