'use client';

import React, { useEffect, useState } from 'react';
import { CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { Clock, NumberCircleFive, UsersThree } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { QuestionMultiSelect } from '@/presentation/components/shared/quiz/question/question-multi-select';

interface CreateQuizProps {
  disabled?: boolean;
  onSubmit: (data: CreateQuizRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateQuizDialog({ disabled = false, onSubmit, loading = false, open, onClose }: CreateQuizProps) {
  const { t } = useTranslation();
  const { categoryUsecase, questionUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<CreateQuizRequest>(
    new CreateQuizRequest({
      title: '',
      description: '',
      isRequired: true,
      startTime: new Date(Date.now()),
      endTime: new Date(Date.now()),
      status: StatusEnum.Enable,
      type: QuizTypeEnum.LessonQuiz,
      categoryEnum: CategoryEnum.Quiz,
    })
  );

  const handleChange = <K extends keyof CreateQuizRequest>(key: K, value: CreateQuizRequest[K]) => {
    setForm((prev) => new CreateQuizRequest({ ...prev, [key]: value }));
  };

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

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
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

  useEffect(() => {
    if (!open) {
      setForm(
        new CreateQuizRequest({
          title: '',
          description: '',
          isRequired: false,
          startTime: new Date(Date.now()),
          endTime: new Date(Date.now()),
          status: StatusEnum.Enable,
          type: QuizTypeEnum.LessonQuiz,
          categoryEnum: CategoryEnum.Quiz,
        })
      );
    }
  }, [open]);

  const booleanOptions = [
    { value: 'true', label: 'yes' },
    { value: 'false', label: 'no' },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('createQuiz')}
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
                label={t('title')}
                value={form.title}
                onChange={(val) => {
                  handleChange('title', val);
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('description')}
                value={form.description}
                onChange={(val) => {
                  handleChange('description', val);
                }}
                disabled={disabled}
                multiline
                rows={detailRows}
                sx={{
                  '& .MuiInputBase-root': {
                    height: fullScreen ? '100%' : 'auto',
                    maxHeight: fullScreen ? `${window.innerHeight - 420}px` : 'auto',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startTime')}
                value={form.startTime?.toISOString()}
                onChange={(val) => {
                  handleChange('startTime', new Date(val));
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endTime')}
                value={form.endTime?.toISOString()}
                onChange={(val) => {
                  handleChange('endTime', new Date(val));
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<StatusEnum>
                label={t('status')}
                value={form.status!}
                onChange={(val) => {
                  handleChange('status', val);
                }}
                disabled={disabled}
                options={[
                  { value: StatusEnum.Enable, label: 'enable' },
                  { value: StatusEnum.Disable, label: 'disable' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<QuizTypeEnum>
                label={t('quizType')}
                value={form.type}
                onChange={(val) => {
                  handleChange('type', val);
                }}
                disabled={disabled}
                options={[
                  { value: QuizTypeEnum.LessonQuiz, label: 'lessonQuiz' },
                  { value: QuizTypeEnum.ExamQuiz, label: 'examQuiz' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('time')}
                value={form.time}
                required
                onChange={(value) => {
                  handleChange('time', value);
                }}
                disabled={isSubmitting}
                inputMode="text"
                pattern="^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$"
                patternError="hh:mm:ss"
                icon={<Clock {...iconStyle} />}
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, qrCodeURL: isValid }));
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('maxCapacity')}
                required
                value={form.maxCapacity?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxCapacity', numericValue);
                }}
                disabled={isSubmitting}
                inputMode="numeric"
                icon={<UsersThree {...iconStyle} />}
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, qrCodeURL: isValid }));
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('maxAttempts')}
                required
                value={form.maxAttempts?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxAttempts', numericValue);
                }}
                disabled={isSubmitting}
                inputMode="numeric"
                icon={<NumberCircleFive {...iconStyle} />}
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, qrCodeURL: isValid }));
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={form.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Quiz}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('required')}
                value={String(form.isRequired ?? '')}
                onChange={(value) => {
                  handleChange('isRequired', value === 'true');
                }}
                disabled={isSubmitting}
                options={booleanOptions}
              />
            </Grid>

            <Grid item xs={12}>
              <QuestionMultiSelect
                questionUsecase={questionUsecase}
                value={form.questionIDs ? form.questionIDs.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => {
                  handleChange('questionIDs', value.join(','));
                }}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton label={t('create')} onClick={() => handleSave()} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
