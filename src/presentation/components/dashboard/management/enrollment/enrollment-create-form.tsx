'use client';

import React, { useEffect, useState } from 'react';
import { CreateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/create-enrollment-criteria-request';
import { CategoryEnum, StatusEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { UsersFour } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface EnrollmentCreateProps {
  disabled?: boolean;
  onSubmit: (data: CreateEnrollmentCriteriaRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateEnrollmentDialog({ onSubmit, loading = false, open, onClose }: EnrollmentCreateProps) {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<CreateEnrollmentCriteriaRequest>(
    new CreateEnrollmentCriteriaRequest({
      name: '',
      desc: '',
      enrollmentStatus: StatusEnum.Enable,
      enrollmentCriteriaType: CategoryEnum.Path,
    })
  );

  const handleChange = <K extends keyof CreateEnrollmentCriteriaRequest>(
    key: K,
    value: CreateEnrollmentCriteriaRequest[K]
  ) => {
    setForm((prev) => new CreateEnrollmentCriteriaRequest({ ...prev, [key]: value }));
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

      onSubmit(form);
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
          {t('createEnrollment')}
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
              <CustomTextField
                label={t('name')}
                value={form.name}
                onChange={(val) => {
                  handleChange('name', val);
                }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('detail')}
                value={form.desc}
                onChange={(val) => {
                  handleChange('desc', val);
                }}
                disabled={isSubmitting}
                multiline
                rows={detailRows}
                sx={{
                  '& .MuiInputBase-root': {
                    height: fullScreen ? '100%' : 'auto',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<StatusEnum>
                label={t('status')}
                value={form.enrollmentStatus}
                onChange={(val) => {
                  handleChange('enrollmentStatus', val);
                }}
                disabled={isSubmitting}
                options={[
                  { value: StatusEnum.Enable, label: 'enable' },
                  { value: StatusEnum.Disable, label: 'disable' },
                  { value: StatusEnum.Deleted, label: 'delete' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<CategoryEnum>
                label={t('type')}
                value={form.enrollmentCriteriaType ?? CategoryEnum.Path}
                onChange={(val) => {
                  handleChange('enrollmentCriteriaType', val);
                }}
                disabled={isSubmitting}
                options={[
                  { value: CategoryEnum.Path, label: 'path' },
                  { value: CategoryEnum.Course, label: 'course' },
                  { value: CategoryEnum.Lesson, label: 'lesson' },
                  { value: CategoryEnum.Class, label: 'class' },
                  { value: CategoryEnum.Quiz, label: 'quiz' },
                  { value: CategoryEnum.Question, label: 'question' },
                  { value: CategoryEnum.Answer, label: 'answer' },
                  { value: CategoryEnum.Criteria, label: 'criteria' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isDefault')}
                value={form.isDefault ?? false}
                onChange={(val) => handleChange('isDefault', val)}
                disabled={isSubmitting}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('maxCapacity')}
                value={form.maxCapacity?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxCapacity', numericValue ?? 0);
                }}
                disabled={isSubmitting}
                icon={<UsersFour />}
                inputMode="numeric"
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, minuteLate: isValid }));
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomButton
                label={t('create')}
                onClick={async () => {
                  await handleSave();
                }}
                loading={loading}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
