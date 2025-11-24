import { useEffect, useState } from 'react';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { type UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { StatusEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';
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
import { ArrowClockwise, ListNumbers } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const { userUsecase, quizUsecase, enrollUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateUserQuizRequest>(new UpdateUserQuizRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState('');
  const [_isScoreValid, setIsScoreValid] = useState(true);

  useEffect(() => {
    if (userQuizProgress && open) {
      const newFormData = new UpdateUserQuizRequest({
        userID: userQuizProgress.userId !== undefined ? userQuizProgress.userId : '',
        quizID: userQuizProgress.quizId || undefined,
        score: userQuizProgress.score || undefined,
        startTime: userQuizProgress.startTime || undefined,
        endTime: userQuizProgress.endTime || undefined,
        startedAt: userQuizProgress.startedAt !== undefined ? userQuizProgress.startedAt : undefined,
        completedAt: userQuizProgress.completedAt !== undefined ? userQuizProgress.completedAt : undefined,
        progressStatus:
          userQuizProgress.progressStatus !== undefined
            ? UserQuizProgressEnum[userQuizProgress.progressStatus as keyof typeof UserQuizProgressEnum]
            : undefined,
        activeStatus:
          userQuizProgress.activeStatus !== undefined
            ? StatusEnum[userQuizProgress.activeStatus as keyof typeof StatusEnum]
            : undefined,
        attempts: userQuizProgress.attempts || undefined,
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
      const allValid = Object.values(fieldValidations).every((v) => v);
      if (!allValid) {
        CustomSnackBar.showSnackbar('Một số trường không hợp lệ', 'error');
        return;
      }

      const numericValue = score !== '' && !isNaN(Number(score)) ? Number(score) : undefined;

      const payload = new UpdateUserQuizRequest({
        ...formData,
        score: numericValue,
        attempts: formData.attempts,
      });

      onSubmit(payload);
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  if (!userQuizProgress) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateUserQuizProgress')}
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
            {t('id')}: {userQuizProgress?.id}
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
                label={t('startTime')}
                value={formData.startTime ? DateTimeUtils.formatISODateToString(formData.startTime) : undefined}
                onChange={(value) => {
                  handleChange(
                    'startTime',
                    value !== undefined ? DateTimeUtils.formatStringToDateTime(value) : undefined
                  );
                }}
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endTime')}
                value={formData.endTime ? DateTimeUtils.formatISODateToString(formData.endTime) : undefined}
                onChange={(value) => {
                  handleChange(
                    'endTime',
                    value !== undefined ? DateTimeUtils.formatStringToDateTime(value) : undefined
                  );
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startedAt')}
                value={formData.startedAt ? DateTimeUtils.formatISODateToString(formData.startedAt) : undefined}
                onChange={(value) => {
                  handleChange(
                    'startedAt',
                    value !== undefined ? DateTimeUtils.formatStringToDateTime(value) : undefined
                  );
                }}
                disabled={false}
                allowClear
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('completedAt')}
                value={formData.completedAt ? DateTimeUtils.formatISODateToString(formData.completedAt) : undefined}
                onChange={(value) => {
                  handleChange(
                    'completedAt',
                    value !== undefined ? DateTimeUtils.formatStringToDateTime(value) : undefined
                  );
                }}
                disabled={false}
                allowClear
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {' '}
              <CustomSelectDropDown<UserQuizProgressEnum>
                label="status"
                value={formData.progressStatus ?? ''}
                onChange={(val) => {
                  handleChange('progressStatus', val);
                }}
                disabled={false}
                options={[
                  { value: UserQuizProgressEnum.NotStarted, label: 'notStarted' },
                  { value: UserQuizProgressEnum.Doing, label: 'doing' },
                  { value: UserQuizProgressEnum.Pass, label: 'pass' },
                  { value: UserQuizProgressEnum.Fail, label: 'fail' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<StatusEnum>
                label={t('status')}
                value={formData.activeStatus ?? ''}
                onChange={(val) => {
                  handleChange('activeStatus', val);
                }}
                disabled={false}
                options={[
                  { value: StatusEnum.Enable, label: 'enable' },
                  { value: StatusEnum.Disable, label: 'disable' },
                  { value: StatusEnum.Deleted, label: 'deleted' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('attempts')}
                value={formData.attempts?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('attempts', numericValue);
                }}
                disabled={isSubmitting}
                icon={<ArrowClockwise {...iconStyle} />}
                inputMode="numeric"
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, minuteLate: isValid }));
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('answerScore')}
                value={formData.score}
                onChange={(value) => {
                  setScore(value);
                  const isValid = /^(\d+(\.\d*)?|\.\d+)?$/.test(value) || value === '';
                  setIsScoreValid(isValid);
                }}
                disabled={isSubmitting}
                icon={<ListNumbers size={20} weight="fill" color="#616161" />}
                inputMode="decimal"
                onValidationChange={setIsScoreValid}
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
