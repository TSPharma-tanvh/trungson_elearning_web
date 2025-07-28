'use client';

import React, { useEffect, useState } from 'react';
import { CreateUserLessonRequest } from '@/domain/models/user-lesson/request/create-user-lesson-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { UserProgressEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { LessonSingleSelectDialog } from '@/presentation/components/shared/courses/lessons/lesson-select';
import { UserSelectDialog } from '@/presentation/components/user/user-select';

interface CreateUserLessonProgressProps {
  disabled?: boolean;
  onSubmit: (data: CreateUserLessonRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateUserLessonProgressDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateUserLessonProgressProps) {
  const { userUsecase, lessonUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [_detailRows, setDetailRows] = useState(3);

  const [form, setForm] = useState<CreateUserLessonRequest>(
    new CreateUserLessonRequest({
      userID: '',
      lessonID: '',
      progress: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: UserProgressEnum[UserProgressEnum.NotStarted],
    })
  );

  const handleChange = <K extends keyof CreateUserLessonRequest>(key: K, value: CreateUserLessonRequest[K]) => {
    setForm((prev) => new CreateUserLessonRequest({ ...prev, [key]: value }));
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
        <Typography variant="h6" component="div">
          Create UserLessonProgress
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
            {/* <Grid item xs={12}>
              <CustomTextField
                label="Tên khóa học"
                value={form.name}
                onChange={(val) => handleChange('name', val)}
                disabled={disabled}
              />
            </Grid> */}

            <Grid item xs={12}>
              <LessonSingleSelectDialog
                lessonUsecase={lessonUsecase}
                value={form.lessonID ?? ''}
                onChange={(value: string) => {
                  handleChange('lessonID', value);
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
              <UserSelectDialog
                userUsecase={userUsecase}
                value={form.userID ? form.userID : ''}
                onChange={(value: string) => {
                  handleChange('userID', value);
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian bắt đầu"
                value={form.startDate ? DateTimeUtils.formatISODateToString(form.startDate) : undefined}
                onChange={(value) => {
                  handleChange('startDate', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian kết thúc"
                value={form.endDate ? DateTimeUtils.formatISODateToString(form.endDate) : undefined}
                onChange={(value) => {
                  handleChange('endDate', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<string>
                label="Trạng thái"
                value={form.status ?? ''}
                onChange={(val) => {
                  handleChange('status', val);
                }}
                disabled={disabled}
                options={[
                  { value: UserProgressEnum[UserProgressEnum.NotStarted], label: 'Chưa bắt đầu' },
                  { value: UserProgressEnum[UserProgressEnum.Ongoing], label: 'Đang làm' },
                  { value: UserProgressEnum[UserProgressEnum.Done], label: 'Hoàn thành' },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomButton
                label="Tạo mới"
                onClick={() => {
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
