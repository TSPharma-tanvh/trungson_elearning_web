import { useEffect, useState } from 'react';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { DisplayTypeEnum, StatusEnum, UserProgressEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';
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
import { ArrowClockwise } from '@phosphor-icons/react';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface EditUserQuizProgressDialogProps {
  open: boolean;
  data: UserQuizProgressDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserQuizRequest) => void;
}

export function UpdateUserQuizProgressFormDialog({
  open,
  data: userQuizProgress,
  onClose,
  onSubmit,
}: EditUserQuizProgressDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { userUsecase, quizUsecase, enrollUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateUserQuizRequest>(new UpdateUserQuizRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');
  const [fieldValidations, setFieldValidations] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (userQuizProgress && open) {
      const newFormData = new UpdateUserQuizRequest({
        userIDs: userQuizProgress.userId != null ? [userQuizProgress.userId] : [],
        quizID: userQuizProgress.quizId || undefined,
        score: userQuizProgress.score || undefined,
        startAt: userQuizProgress.startedAt || undefined,
        completedAt: userQuizProgress.completedAt || undefined,
        progressStatus:
          userQuizProgress.progressStatus != null
            ? UserQuizProgressEnum[userQuizProgress.progressStatus as keyof typeof UserQuizProgressEnum]
            : undefined,
        activeStatus:
          userQuizProgress.activeStatus != null
            ? StatusEnum[userQuizProgress.activeStatus as keyof typeof StatusEnum]
            : undefined,
      });
      setFormData(newFormData);
    }
  }, [userQuizProgress, open, userUsecase, quizUsecase, enrollUsecase]);

  const handleChange = <K extends keyof UpdateUserQuizRequest>(field: K, value: UpdateUserQuizRequest[K]) => {
    setFormData((prev) => new UpdateUserQuizRequest({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v !== false);
      if (!allValid) {
        CustomSnackBar.showSnackbar('Một số trường không hợp lệ', 'error');
        return;
      }
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error updating quiz:', error);
      CustomSnackBar.showSnackbar('Failed to update quiz', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  const statusOptions = [
    { value: StatusEnum.Enable, label: 'Enable' },
    { value: StatusEnum.Disable, label: 'Disable' },
    { value: StatusEnum.Deleted, label: 'Deleted' },
  ];

  const displayTypeOptions = [
    { value: DisplayTypeEnum.Public, label: 'Public' },
    { value: DisplayTypeEnum.Private, label: 'Private' },
  ];

  if (!userQuizProgress) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update UserQuizProgress
        </Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
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
            ID: {userQuizProgress?.id}
          </Typography>

          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <QuizSelectDialog
                quizUsecase={quizUsecase}
                value={formData.quizID ?? ''}
                onChange={(value: string) => handleChange('quizID', value)}
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
                categoryEnum={CategoryEnum.Quiz}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian bắt đầu"
                value={formData.startAt ? DateTimeUtils.formatISODateToString(formData.startAt) : undefined}
                onChange={(value) => handleChange('startAt', DateTimeUtils.parseLocalDateTimeString(value))}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian kết thúc"
                value={formData.completedAt ? DateTimeUtils.formatISODateToString(formData.completedAt) : undefined}
                onChange={(value) => handleChange('completedAt', DateTimeUtils.parseLocalDateTimeString(value))}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
              {' '}
              <CustomSelectDropDown<UserQuizProgressEnum>
                label="Trạng thái"
                value={formData.progressStatus ?? ''}
                onChange={(val) => handleChange('progressStatus', val)}
                disabled={false}
                options={[
                  { value: UserQuizProgressEnum.NotStarted, label: 'Chưa bắt đầu' },
                  { value: UserQuizProgressEnum.Doing, label: 'Đang làm' },
                  { value: UserQuizProgressEnum.Pass, label: 'Vượt qua' },
                  { value: UserQuizProgressEnum.Fail, label: 'Không vượt qua' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<StatusEnum>
                label="Trạng thái"
                value={formData.activeStatus ?? ''}
                onChange={(val) => handleChange('activeStatus', val)}
                disabled={false}
                options={[
                  { value: StatusEnum.Enable, label: 'Kích hoạt' },
                  { value: StatusEnum.Disable, label: 'Tạm khóa' },
                  { value: StatusEnum.Deleted, label: 'Xoá' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="attempts"
                value={formData.attempts?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('attempts', numericValue);
                }}
                disabled={isSubmitting}
                icon={<ArrowClockwise {...iconStyle} />}
                inputMode="numeric"
                onValidationChange={(isValid) => setFieldValidations((prev) => ({ ...prev, minuteLate: isValid }))}
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
