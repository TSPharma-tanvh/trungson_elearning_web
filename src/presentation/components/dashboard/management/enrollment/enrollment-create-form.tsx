'use client';

import React, { useEffect, useState } from 'react';
import { CreateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/create-enrollment-criteria-request';
import { CategoryEnum, DisplayTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface Props {
  disabled?: boolean;
  onSubmit: (data: CreateEnrollmentCriteriaRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateEnrollmentDialog({ disabled = false, onSubmit, loading = false, open, onClose }: Props) {
  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);

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
    return () => window.removeEventListener('resize', updateRows);
  }, [fullScreen]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Create Enrollment
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
                label="Tên khóa học"
                value={form.name}
                onChange={(val) => handleChange('name', val)}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label="Chi tiết"
                value={form.desc}
                onChange={(val) => handleChange('desc', val)}
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
              <CustomSelectDropDown<StatusEnum>
                label="Trạng thái"
                value={form.enrollmentStatus!}
                onChange={(val) => handleChange('enrollmentStatus', val)}
                disabled={disabled}
                options={[
                  { value: StatusEnum.Enable, label: 'Kích hoạt' },
                  { value: StatusEnum.Disable, label: 'Tạm khóa' },
                  { value: StatusEnum.Deleted, label: 'Xoá' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<CategoryEnum>
                label="Enrollment Criteria Type"
                value={form.enrollmentCriteriaType ?? CategoryEnum.Path}
                onChange={(val) => handleChange('enrollmentCriteriaType', val)}
                disabled={disabled}
                options={[
                  { value: CategoryEnum.Path, label: 'Lộ trình' },
                  { value: CategoryEnum.Course, label: 'Khóa học' },
                  { value: CategoryEnum.Lesson, label: 'Bài học' },
                  { value: CategoryEnum.Class, label: 'Lớp học' },
                  { value: CategoryEnum.Quiz, label: 'Bài kiểm tra' },
                  { value: CategoryEnum.Question, label: 'Câu hỏi' },
                  { value: CategoryEnum.Answer, label: 'Câu trả lời' },
                  { value: CategoryEnum.Criteria, label: 'Tiêu chí' },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton label="Tạo mới" onClick={() => onSubmit(form)} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
