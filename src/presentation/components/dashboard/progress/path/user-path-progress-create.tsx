'use client';

import React, { useEffect, useState } from 'react';
import { EnrollUserListToPathRequest } from '@/domain/models/user-path/request/enroll-user-list-to-path-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { ApproveStatusEnum, CategoryEnum, ProgressEnrollmentTypeEnum, UserProgressEnum } from '@/utils/enum/core-enum';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { PathSelectDialog } from '@/presentation/components/shared/courses/path/path-select';
import { EnrollmentSingleSelect } from '@/presentation/components/shared/enrollment/enrollment-single-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';

interface CreateUserPathProgressProps {
  disabled?: boolean;
  onSubmit: (data: EnrollUserListToPathRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateUserPathProgressDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateUserPathProgressProps) {
  const { t } = useTranslation();
  const { userUsecase, pathUseCase, enrollUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [_detailRows, setDetailRows] = useState(3);
  const [fileError, setFileError] = useState<string | null>(null);

  const [form, setForm] = useState<EnrollUserListToPathRequest>(
    new EnrollUserListToPathRequest({
      userID: '',
      pathID: '',
      progress: 0,
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      enrollType: ProgressEnrollmentTypeEnum.AllUsers,
      status: UserProgressEnum.NotStarted,
      enrollStatus: ApproveStatusEnum.Approve,
    })
  );

  const handleChange = <K extends keyof EnrollUserListToPathRequest>(key: K, value: EnrollUserListToPathRequest[K]) => {
    setForm((prev) => new EnrollUserListToPathRequest({ ...prev, [key]: value }));
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="subtitle1" component="div">
          {t('createUserPathProgress')}
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
              <PathSelectDialog
                pathUsecase={pathUseCase}
                value={form.pathID ?? ''}
                onChange={(value: string) => {
                  handleChange('pathID', value);
                }}
                disabled={disabled}
              />
            </Grid>

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

            <Grid item xs={12}>
              <CustomSelectDropDown<ProgressEnrollmentTypeEnum>
                label={t('enrollType')}
                value={form.enrollType ?? ''}
                onChange={(val) => {
                  handleChange('enrollType', val);
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
            ) : form.enrollType === ProgressEnrollmentTypeEnum.FromFile ? (
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
                  {form.userFile && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearFile();
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <input type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} />
                </Button>
                {fileError && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fileError}
                  </Typography>
                )}
              </Grid>
            ) : null}

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startTime')}
                value={form.startDate ? DateTimeUtils.formatISODateToString(form.startDate) : undefined}
                onChange={(value) => {
                  handleChange('startDate', DateTimeUtils.formatStringToDateTime(value ?? '') ?? new Date());
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endTime')}
                value={form.endDate ? DateTimeUtils.formatISODateToString(form.endDate) : undefined}
                onChange={(value) => {
                  handleChange('endDate', DateTimeUtils.formatStringToDateTime(value ?? '') ?? new Date());
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<UserProgressEnum>
                label={t('status')}
                value={form.status}
                onChange={(val) => {
                  handleChange('status', val);
                }}
                disabled={disabled}
                options={[
                  { value: UserProgressEnum.NotStarted, label: 'notStarted' },
                  { value: UserProgressEnum.Ongoing, label: 'ongoing' },
                  { value: UserProgressEnum.Done, label: 'done' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<ApproveStatusEnum>
                label={t('enrollStatus')}
                value={form.enrollStatus!}
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

            <Grid item xs={12}>
              <CustomButton
                label={t('create')}
                onClick={() => {
                  if (form.enrollType === ProgressEnrollmentTypeEnum.FromFile && !form.userFile) {
                    setFileError(t('fileRequired'));
                    return;
                  }
                  onSubmit(form);
                }}
                loading={loading}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
