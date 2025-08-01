'use client';

import React, { useEffect, useState } from 'react';
import { CreateClassTeacherRequest } from '@/domain/models/teacher/request/create-class-teacher-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { ActiveEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { ClassMultiSelectDialog } from '@/presentation/components/shared/classes/class/class-multi-select';
import { CourseMultiSelectDialog } from '@/presentation/components/shared/courses/courses/courses-multi-select';
import { UserSelectDialog } from '@/presentation/components/user/user-select';

interface CreateTeacherFormProps {
  disabled?: boolean;
  onSubmit: (data: CreateClassTeacherRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateClassTeacherDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateTeacherFormProps) {
  const { t } = useTranslation();
  const { userUsecase, courseUsecase, classUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [isSubmitting, _setIsSubmitting] = useState(false);

  const getNewForm = () =>
    new CreateClassTeacherRequest({
      userID: '',
      status: ActiveEnum[ActiveEnum.Active],
      courseID: undefined,
      classID: undefined,
    });
  const [form, setForm] = useState<CreateClassTeacherRequest>(getNewForm());

  const handleChange = <K extends keyof CreateClassTeacherRequest>(key: K, value: CreateClassTeacherRequest[K]) => {
    setForm((prev) => new CreateClassTeacherRequest({ ...prev, [key]: value }));
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

  // const handleSave = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     void onSubmit(form);
  //     onClose();
  //   } catch (error: unknown) {
  //     const message = error instanceof Error ? error.message : 'An error has occurred.';
  //     CustomSnackBar.showSnackbar(message, 'error');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  useEffect(() => {
    setForm(getNewForm());
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('createTeacher')}</Typography>
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
          <Grid item xs={12} mt={1}>
            <UserSelectDialog
              userUsecase={userUsecase}
              value={form.userID ?? ''}
              onChange={(val) => {
                handleChange('userID', val);
              }}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label={t('description')}
              value={form.description || ''}
              onChange={(val) => {
                handleChange('description', val);
              }}
              disabled={disabled}
              multiline
              rows={detailRows}
            />
          </Grid>

          <Grid item xs={12}>
            <CourseMultiSelectDialog
              courseUsecase={courseUsecase}
              value={form.courseID ? form.courseID.split(',').filter((id) => id) : []}
              onChange={(value: string[]) => {
                handleChange('courseID', value.join(','));
              }}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12}>
            <ClassMultiSelectDialog
              classUsecase={classUsecase}
              value={form.classID ? form.classID.split(',').filter((id) => id) : []}
              onChange={(val) => {
                handleChange('classID', val.join(','));
              }}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomSelectDropDown<string>
              label={t('status')}
              value={form.status}
              onChange={(val) => {
                handleChange('status', val);
              }}
              disabled={disabled}
              options={[
                { value: ActiveEnum[ActiveEnum.Active], label: 'active' },
                { value: ActiveEnum[ActiveEnum.Inactive], label: 'inactive' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              label={t('create')}
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
