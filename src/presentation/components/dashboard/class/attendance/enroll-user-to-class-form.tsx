'use client';

import React, { useState } from 'react';
import { EnrollUserListToClassRequest } from '@/domain/models/attendance/request/enroll-user-to-class-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import {
  ApproveStatusEnum,
  CategoryEnum,
  CheckinTimeEnum,
  ProgressEnrollmentTypeEnum,
  StatusEnum,
} from '@/utils/enum/core-enum';
import { UploadFile } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { ClassSelectDialog } from '@/presentation/components/shared/classes/class/class-select';
import { EnrollmentSingleSelect } from '@/presentation/components/shared/enrollment/enrollment-single-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';

interface CreateAttendanceRecordsProps {
  disabled?: boolean;
  onSubmit: (data: EnrollUserListToClassRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateAttendanceRecordsDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateAttendanceRecordsProps) {
  const { t } = useTranslation();
  const { userUsecase, enrollUsecase, classUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [form, setForm] = useState<EnrollUserListToClassRequest>(
    new EnrollUserListToClassRequest({
      startAt: new Date(),
      endAt: new Date(new Date().setDate(new Date().getDate() + 1)),
      minuteLate: 5,
      minuteSoon: 5,
      statusCheckIn: CheckinTimeEnum[CheckinTimeEnum.Absent],
      enrollStatus: ApproveStatusEnum.Approve,
      activeStatus: StatusEnum.Enable,
      enrollType: ProgressEnrollmentTypeEnum.AllUsers,
    })
  );

  const handleChange = <K extends keyof EnrollUserListToClassRequest>(
    key: K,
    value: EnrollUserListToClassRequest[K]
  ) => {
    setForm((prev) => new EnrollUserListToClassRequest({ ...prev, [key]: value }));
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('enrollUser')}</Typography>
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
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: fullScreen ? '100%' : 'auto', p: 2 }}>
        <Grid container spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}>
          <Grid item xs={12} marginTop={1}>
            <ClassSelectDialog
              classUsecase={classUsecase}
              value={form.classID ?? ''}
              onChange={(value: string) => {
                handleChange('classID', value);
              }}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12}>
            <EnrollmentSingleSelect
              enrollmentUsecase={enrollUsecase}
              value={form.enrollmentCriteriaID ?? ''}
              onChange={(value: string) => {
                handleChange('enrollmentCriteriaID', value);
              }}
              disabled={false}
              categoryEnum={CategoryEnum.Class}
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
                  <UploadFile sx={{ mr: 1 }} />
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
              label={t('startAt')}
              value={form.startAt?.toISOString()}
              onChange={(val) => {
                handleChange('startAt', new Date(val ?? new Date()));
              }}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomDateTimePicker
              label={t('endAt')}
              value={form.endAt?.toISOString()}
              onChange={(val) => {
                handleChange('endAt', new Date(val ?? new Date()));
              }}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              label={t('minuteLate')}
              type="number"
              value={form.minuteLate}
              onChange={(val) => {
                handleChange('minuteLate', Number(val));
              }}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              label={t('minuteSoon')}
              type="number"
              value={form.minuteSoon}
              onChange={(val) => {
                handleChange('minuteSoon', Number(val));
              }}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown<string>
              label={t('statusCheckIn')}
              value={form.statusCheckIn ?? ''}
              onChange={(val) => {
                handleChange('statusCheckIn', val ?? '');
              }}
              disabled={disabled}
              options={[
                { value: CheckinTimeEnum[CheckinTimeEnum.Absent], label: 'absent' },
                { value: CheckinTimeEnum[CheckinTimeEnum.OnTime], label: 'onTime' },
                { value: CheckinTimeEnum[CheckinTimeEnum.Late], label: 'late' },
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

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown<StatusEnum>
              label={t('activeStatus')}
              value={form.activeStatus!}
              onChange={(val) => {
                handleChange('activeStatus', val);
              }}
              disabled={disabled}
              options={[
                { value: StatusEnum.Enable, label: 'enable' },
                { value: StatusEnum.Disable, label: 'disable' },
                { value: StatusEnum.Deleted, label: 'deleted' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              label={t('enroll')}
              onClick={() => {
                onSubmit(form);
              }}
              loading={loading}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
