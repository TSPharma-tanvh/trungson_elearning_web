'use client';

import React, { useEffect, useState } from 'react';
import { CreateAttendanceReportRequest } from '@/domain/models/attendance/request/create-attendance-report-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { ClassSelectDialog } from '@/presentation/components/shared/classes/class/class-select';
import { EnrollmentSingleSelect } from '@/presentation/components/shared/enrollment/enrollment-single-select';

interface CreateAttendanceReportProps {
  disabled?: boolean;
  onSubmit: (data: CreateAttendanceReportRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateAttendanceReportDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateAttendanceReportProps) {
  const { t } = useTranslation();
  const { classUsecase, enrollUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);

  const [form, setForm] = useState<CreateAttendanceReportRequest>(
    new CreateAttendanceReportRequest({
      startAt: new Date(),
    })
  );

  const handleChange = <K extends keyof CreateAttendanceReportRequest>(
    key: K,
    value: CreateAttendanceReportRequest[K]
  ) => {
    setForm((prev) => new CreateAttendanceReportRequest({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!open) {
      setForm(
        new CreateAttendanceReportRequest({
          startAt: new Date(),
        })
      );
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('createAttendanceReport')}</Typography>
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

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown<boolean>
              label={t('isDefaultEnroll')}
              value={form.isDefaultEnroll ?? true}
              onChange={(val) => {
                handleChange('isDefaultEnroll', val);
              }}
              disabled={disabled}
              options={[
                { value: true, label: 'yes' },
                { value: false, label: 'no' },
              ]}
            />
          </Grid>

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

          {form.isDefaultEnroll === false ? (
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
          ) : (
            <div />
          )}

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
