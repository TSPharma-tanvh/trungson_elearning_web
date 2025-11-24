'use client';

import React, { useEffect, useState } from 'react';
import { CreateUserQuizRequest } from '@/domain/models/user-quiz/request/create-user-quiz-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import {
  ApproveStatusEnum,
  CategoryEnum,
  ProgressEnrollmentTypeEnum,
  StatusEnum,
  UserQuizProgressEnum,
} from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { EnrollmentSingleSelect } from '@/presentation/components/shared/enrollment/enrollment-single-select';
import { QuizSingleSelect } from '@/presentation/components/shared/quiz/quiz/quiz-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';

interface CreateQuizUserProgressProps {
  disabled?: boolean;
  onSubmit: (data: CreateUserQuizRequest) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateUserQuizProgressDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateQuizUserProgressProps) {
  const { t } = useTranslation();
  const { userUsecase, quizUsecase, enrollUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [_detailRows, setDetailRows] = useState(3);
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});
  const [fileError, setFileError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateUserQuizRequest>(
    new CreateUserQuizRequest({
      userID: '',
      quizID: '',
      enrollType: ProgressEnrollmentTypeEnum.AllUsers,
      progressStatus: UserQuizProgressEnum.NotStarted,
      activeStatus: StatusEnum.Enable,
      enrollStatus: ApproveStatusEnum.Approve,
      approvedAt: new Date(),
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      isAutoEnroll: true,
      isUpdateOldProgress: false,
    })
  );

  const handleChange = <K extends keyof CreateUserQuizRequest>(key: K, value: CreateUserQuizRequest[K]) => {
    setForm((prev) => new CreateUserQuizRequest({ ...prev, [key]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const allowedExtensions = ['.xlsx', '.xls'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

      if (!allowedExtensions.includes(fileExtension)) {
        setFileError(t('invalidFileFormat', { formats: '.xlsx, .xls' }));
        handleChange('userFile', undefined);
        return;
      }
      if (file.size > maxFileSize) {
        setFileError(t('fileTooLarge', { maxSize: '5MB' }));
        handleChange('userFile', undefined);
        return;
      }
      setFileError(null);
      handleChange('userFile', file);
    } else {
      setFileError(null);
      handleChange('userFile', undefined);
    }
  };

  const handleClearFile = () => {
    setFileError(null);
    handleChange('userFile', undefined);
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
    return () => {
      window.removeEventListener('resize', updateRows);
    };
  }, [fullScreen]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v);
      if (!allValid) {
        CustomSnackBar.showSnackbar(t('someFieldsAreInvalid'), 'error');
        return;
      }

      await onSubmit(form);
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('createUserQuizProgress')}
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
              <QuizSingleSelect
                quizUsecase={quizUsecase}
                value={form.quizID ?? ''}
                onChange={(value: string | null) => {
                  handleChange('quizID', value ?? '');
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isAutoEnroll')}
                value={form.isAutoEnroll ?? true}
                onChange={(val) => {
                  handleChange('isAutoEnroll', val);
                }}
                disabled={disabled}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isUpdateOldProgress')}
                value={form.isUpdateOldProgress ?? false}
                onChange={(val) => {
                  handleChange('isUpdateOldProgress', val);
                }}
                disabled={disabled}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            {form.isAutoEnroll ? (
              <div />
            ) : (
              <Grid item xs={12}>
                <EnrollmentSingleSelect
                  enrollmentUsecase={enrollUsecase}
                  value={form.enrollmentCriteriaID ?? ''}
                  onChange={(value: string) => {
                    handleChange('enrollmentCriteriaID', value);
                  }}
                  disabled={disabled}
                  categoryEnum={CategoryEnum.Path}
                  label="pathEnrollmentCriteria"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomSelectDropDown<ProgressEnrollmentTypeEnum>
                label={t('enrollType')}
                value={form.enrollType ?? ''}
                onChange={(val) => {
                  handleChange('enrollType', Number(val) as ProgressEnrollmentTypeEnum);
                }}
                disabled={disabled}
                options={[
                  { value: ProgressEnrollmentTypeEnum.AllUsers, label: 'allUsers' },
                  { value: ProgressEnrollmentTypeEnum.SelectedUsers, label: 'selectedUsers' },
                  { value: ProgressEnrollmentTypeEnum.FromFile, label: 'fromFile' },
                ]}
              />
            </Grid>

            {form.enrollType === ProgressEnrollmentTypeEnum.SelectedUsers ? (
              <Grid item xs={12}>
                <UserMultiSelectDialog
                  userUsecase={userUsecase}
                  value={form.userIDs ? form.userIDs : []}
                  onChange={(value: string[]) => {
                    handleChange('userIDs', value);
                  }}
                  disabled={disabled}
                />
              </Grid>
            ) : (
              <div />
            )}

            {form.enrollType === ProgressEnrollmentTypeEnum.FromFile ? (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={disabled}
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    borderColor: fileError ? 'error.main' : 'primary.main',
                    color: fileError ? 'error.main' : 'primary.main',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: fileError ? 'error.dark' : 'primary.dark',
                      backgroundColor: fileError ? 'error.light' : 'primary.light',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <UploadFileIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">{form.userFile ? form.userFile.name : t('uploadFile')}</Typography>
                  </Box>
                  {form.userFile ? (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearFile();
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  ) : null}
                  <input type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} />
                </Button>
                {fileError ? (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fileError}
                  </Typography>
                ) : null}
              </Grid>
            ) : (
              <div />
            )}

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startTime')}
                value={form.startTime ? DateTimeUtils.formatISODateToString(form.startTime) : undefined}
                onChange={(value) => {
                  handleChange('startTime', DateTimeUtils.formatStringToDateTime(value ?? '') ?? new Date());
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endTime')}
                value={form.endTime ? DateTimeUtils.formatISODateToString(form.endTime) : undefined}
                onChange={(value) => {
                  handleChange('endTime', DateTimeUtils.formatStringToDateTime(value ?? '') ?? new Date());
                }}
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
              <CustomSelectDropDown<UserQuizProgressEnum>
                label={t('status')}
                value={form.progressStatus}
                onChange={(val) => {
                  handleChange('progressStatus', val);
                }}
                disabled={disabled}
                options={[
                  { value: UserQuizProgressEnum.NotStarted, label: 'notStarted' },
                  { value: UserQuizProgressEnum.Doing, label: 'doing' },
                  { value: UserQuizProgressEnum.Pass, label: 'pass' },
                  { value: UserQuizProgressEnum.Fail, label: 'fail' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<ApproveStatusEnum>
                label={t('enrollStatus')}
                value={form.enrollStatus ?? ''}
                onChange={(val) => {
                  handleChange('enrollStatus', val);
                }}
                disabled={disabled}
                options={[
                  { value: ApproveStatusEnum.Approve, label: 'approve' },
                  { value: ApproveStatusEnum.Reject, label: 'reject' },
                ]}
              />
            </Grid>

            {form.enrollStatus === ApproveStatusEnum.Reject && (
              <Grid item xs={12}>
                <CustomTextField
                  label="rejectedReason"
                  value={form.rejectedReason ?? ''}
                  onChange={(val) => {
                    handleChange('rejectedReason', val);
                  }}
                  disabled={disabled}
                  multiline
                  required={form.enrollStatus === ApproveStatusEnum.Reject}
                  rows={3}
                  onValidationChange={(isValid) => {
                    setFieldValidations((prev) => ({ ...prev, rejectedReason: isValid }));
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomButton label={t('create')} onClick={() => handleSave()} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
