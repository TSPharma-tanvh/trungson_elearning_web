'use client';

import React, { useEffect, useState } from 'react';
import { CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { CategoryEnum, DisplayTypeEnum, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { Clock } from '@phosphor-icons/react';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { QuestionMultiSelectDialog } from '@/presentation/components/shared/quiz/question/question-multi-select';

interface Props {
  disabled?: boolean;
  onSubmit: (data: CreateQuizRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateQuizDialog({ disabled = false, onSubmit, loading = false, open, onClose }: Props) {
  const { categoryUsecase, enrollUsecase, fileUsecase, questionUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidations, setFieldValidations] = useState<{ [key: string]: boolean }>({});

  const [form, setForm] = useState<CreateQuizRequest>(
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

  const handleChange = <K extends keyof CreateQuizRequest>(key: K, value: CreateQuizRequest[K]) => {
    setForm((prev) => new CreateQuizRequest({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v !== false);
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
    return () => window.removeEventListener('resize', updateRows);
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Create Quiz
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
                label="Tên bài kiểm tra"
                value={form.title}
                onChange={(val) => handleChange('title', val)}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label="Chi tiết"
                value={form.description}
                onChange={(val) => handleChange('description', val)}
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
                label="Thời gian bắt đầu"
                value={form.startTime?.toISOString()}
                onChange={(val) => handleChange('startTime', new Date(val))}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian kết thúc"
                value={form.endTime?.toISOString()}
                onChange={(val) => handleChange('endTime', new Date(val))}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<StatusEnum>
                label="Trạng thái"
                value={form.status!}
                onChange={(val) => handleChange('status', val)}
                disabled={disabled}
                options={[
                  { value: StatusEnum.Enable, label: 'Kích hoạt' },
                  { value: StatusEnum.Disable, label: 'Tạm khóa' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<QuizTypeEnum>
                label="Kiểu kiểm tra"
                value={form.type!}
                onChange={(val) => handleChange('type', val)}
                disabled={disabled}
                options={[
                  { value: QuizTypeEnum.LessonQuiz, label: 'Kiểm tra sau khi học' },
                  { value: QuizTypeEnum.ExamQuiz, label: 'Kiểm tra lẻ' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Time"
                value={form.time}
                required={true}
                onChange={(value) => handleChange('time', value)}
                disabled={isSubmitting}
                inputMode="text"
                pattern="^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$"
                patternError="hh:mm:ss"
                icon={<Clock {...iconStyle} />}
                onValidationChange={(isValid) => setFieldValidations((prev) => ({ ...prev, qrCodeURL: isValid }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="maxCapacity"
                required={true}
                value={form.maxCapacity?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxCapacity', numericValue);
                }}
                disabled={isSubmitting}
                inputMode="numeric"
                icon={<Clock {...iconStyle} />}
                onValidationChange={(isValid) => setFieldValidations((prev) => ({ ...prev, qrCodeURL: isValid }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="maxAttempts"
                required={true}
                value={form.maxAttempts?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxAttempts', numericValue);
                }}
                disabled={isSubmitting}
                inputMode="numeric"
                icon={<Clock {...iconStyle} />}
                onValidationChange={(isValid) => setFieldValidations((prev) => ({ ...prev, qrCodeURL: isValid }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={form.categoryID}
                onChange={(value) => handleChange('categoryID', value)}
                categoryEnum={CategoryEnum.Quiz}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <QuestionMultiSelectDialog
                questionUsecase={questionUsecase}
                value={form.questionIDs ? form.questionIDs.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => handleChange('questionIDs', value.join(','))}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton label="Tạo mới" onClick={() => handleSave()} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
