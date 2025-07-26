'use client';

import React, { useEffect, useState } from 'react';
import { CreateUserQuizRequest } from '@/domain/models/user-quiz/request/create-user-quiz-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { ApproveStatusEnum, CategoryEnum, StatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { EnrollmentSingleSelect } from '@/presentation/components/shared/enrollment/enrollment-single-select';
import { QuizSingleSelectDialog } from '@/presentation/components/shared/quiz/quiz/quiz-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';

interface Props {
  disabled?: boolean;
  onSubmit: (data: CreateUserQuizRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateUserQuizProgressDialog({ disabled = false, onSubmit, loading = false, open, onClose }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { userUsecase, quizUsecase, enrollUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<CreateUserQuizRequest>(
    new CreateUserQuizRequest({
      userID: '',
      quizID: '',
      assignedAt: new Date(),
      isAutoSubmitted: true,
      progressStatus: UserProgressEnum.NotStarted,
      activeStatus: StatusEnum.Enable,
      enrollStatus: ApproveStatusEnum.Approve,
      approvedAt: new Date(),
    })
  );

  const handleChange = <K extends keyof CreateUserQuizRequest>(key: K, value: CreateUserQuizRequest[K]) => {
    setForm((prev) => new CreateUserQuizRequest({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const updateRows = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const aspectRatio = windowWidth / windowHeight;

      let otherElementsHeight = 300;
      if (windowHeight < 600) {
        otherElementsHeight = 250;
      } else if (windowHeight > 1000) {
        otherElementsHeight = 350;
      }

      const rowHeight = aspectRatio > 1.5 ? 22 : 24;
      const availableHeight = windowHeight - otherElementsHeight;
      const calculatedRows = Math.max(3, Math.floor(availableHeight / rowHeight));

      setDetailRows(fullScreen ? calculatedRows : 3);
    };

    updateRows();
    window.addEventListener('resize', updateRows);
    return () => { window.removeEventListener('resize', updateRows); };
  }, [fullScreen]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v);
      if (!allValid) {
        CustomSnackBar.showSnackbar('Một số trường không hợp lệ', 'error');
        return;
      }

      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error('Error updating path:', error);
      CustomSnackBar.showSnackbar('Failed to update path', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Create UserQuizProgress
        </Typography>
        <Box>
          <IconButton onClick={() => { setFullScreen((prev) => !prev); }}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: fullScreen ? '100%' : 'auto',
          padding: 0,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          p={2}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid
            container
            spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}
            sx={{
              flex: 1,
            }}
          >
            <Grid item xs={12}>
              <QuizSingleSelectDialog
                quizUsecase={quizUsecase}
                value={form.quizID ?? ''}
                onChange={(value: string | null) => { handleChange('quizID', value ?? ''); }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
              <UserMultiSelectDialog
                userUsecase={userUsecase}
                value={form.userIDs ? form.userIDs : []}
                onChange={(value: string[]) => { handleChange('userIDs', value); }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
              <EnrollmentSingleSelect
                enrollmentUsecase={enrollUsecase}
                value={form.enrollmentCriteriaID ?? ''}
                onChange={(value: string) => { handleChange('enrollmentCriteriaID', value); }}
                disabled={false}
                categoryEnum={CategoryEnum.Quiz}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian bắt đầu"
                value={form.customStartTime ? DateTimeUtils.formatISODateToString(form.customStartTime) : undefined}
                onChange={(value) => { handleChange('customStartTime', DateTimeUtils.parseLocalDateTimeString(value)); }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian kết thúc"
                value={form.customEndTime ? DateTimeUtils.formatISODateToString(form.customEndTime) : undefined}
                onChange={(value) => { handleChange('customEndTime', DateTimeUtils.parseLocalDateTimeString(value)); }}
                disabled={disabled}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<string>
                label="Tự động nộp bài"
                value={form.isAutoSubmitted !== undefined ? String(form.isAutoSubmitted) : ''}
                onChange={(val) => handleChange('isAutoSubmitted', val === 'true')}
                disabled={disabled}
                options={[
                  { value: 'true', label: 'Có' },
                  { value: 'false', label: 'Không' },
                ]}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<UserProgressEnum>
                label="Trạng thái"
                value={form.progressStatus ?? ''}
                onChange={(val) => { handleChange('progressStatus', val); }}
                disabled={disabled}
                options={[
                  { value: UserProgressEnum.NotStarted, label: 'Chưa bắt đầu' },
                  { value: UserProgressEnum.Ongoing, label: 'Đang làm' },
                  { value: UserProgressEnum.Done, label: 'Hoàn thành' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<ApproveStatusEnum>
                label="Trạng thái duyệt"
                value={form.enrollStatus ?? ''}
                onChange={(val) => { handleChange('enrollStatus', val); }}
                disabled={disabled}
                options={[
                  { value: ApproveStatusEnum.Approve, label: 'Chấp nhận' },
                  { value: ApproveStatusEnum.Reject, label: 'Từ chối' },
                ]}
              />
            </Grid>

            {form.enrollStatus === ApproveStatusEnum.Reject && (
              <Grid item xs={12}>
                <CustomTextField
                  label="Lý do từ chối"
                  value={form.rejectedReason ?? ''}
                  onChange={(val) => { handleChange('rejectedReason', val); }}
                  disabled={disabled}
                  multiline
                  required={form.enrollStatus === ApproveStatusEnum.Reject}
                  rows={3}
                  onValidationChange={(isValid) =>
                    { setFieldValidations((prev) => ({ ...prev, rejectedReason: isValid })); }
                  }
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomButton label="Tạo mới" onClick={() => handleSave()} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
