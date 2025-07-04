'use client';

import React, { useEffect, useState } from 'react';
import { CreateClassRequest } from '@/domain/models/class/request/create-class-request';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface Props {
  disabled?: boolean;
  onSubmit: (data: CreateClassRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateClassDialog({ disabled = false, onSubmit, loading = false, open, onClose }: Props) {
  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [form, setForm] = useState<CreateClassRequest>(
    new CreateClassRequest({
      className: '',
      classDetail: '',
      duration: '00:00:00',
      startAt: new Date(),
      endAt: new Date(),
      minuteLate: 10,
      classType: 0,
      scheduleStatus: 0,
    })
  );

  const handleChange = <K extends keyof CreateClassRequest>(key: K, value: CreateClassRequest[K]) => {
    setForm((prev) => new CreateClassRequest({ ...prev, [key]: value }));
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
        <Typography variant="h6">Tạo lớp học</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: fullScreen ? '100%' : 'auto', p: 2 }}>
        <Grid container spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}>
          <Grid item xs={12} sm={12} mt={1}>
            <CustomTextField
              label="Tên lớp"
              value={form.className}
              onChange={(val) => handleChange('className', val)}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label="Chi tiết"
              value={form.classDetail || ''}
              onChange={(val) => handleChange('classDetail', val)}
              disabled={disabled}
              multiline
              rows={detailRows}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomDateTimePicker
              label="Thời gian bắt đầu"
              value={form.startAt?.toISOString()}
              onChange={(val) => handleChange('startAt', new Date(val))}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomDateTimePicker
              label="Thời gian kết thúc"
              value={form.endAt?.toISOString()}
              onChange={(val) => handleChange('endAt', new Date(val))}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Thời lượng (HH:mm:ss)"
              value={form.duration}
              onChange={(val) => handleChange('duration', val)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Số phút trễ cho phép"
              type="number"
              value={form.minuteLate}
              onChange={(val) => handleChange('minuteLate', Number(val))}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomButton label="Tạo lớp" onClick={() => onSubmit(form)} loading={loading} disabled={disabled} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
