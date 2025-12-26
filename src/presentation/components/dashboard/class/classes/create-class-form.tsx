'use client';

import React, { useEffect, useState } from 'react';
import { CreateClassRequest } from '@/domain/models/class/request/create-class-request';
import { LearningModeEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

import { MapPickerDialog } from './map-picker-dialog';

interface CreateClassProps {
  disabled?: boolean;
  onSubmit: (data: CreateClassRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateClassDialog({ disabled = false, onSubmit, loading = false, open, onClose }: CreateClassProps) {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [openMap, setOpenMap] = useState(false);

  const [form, setForm] = useState<CreateClassRequest>(
    new CreateClassRequest({
      className: '',
      classDetail: '',
      duration: '00:30:00',
      // startAt: new Date(),
      // endAt: new Date(new Date().setDate(new Date().getDate() + 1)),
      // minuteLate: 5,
      classType: 0,
      scheduleStatus: 0,
      isCreateQrCode: true,
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
    return () => {
      window.removeEventListener('resize', updateRows);
    };
  }, [fullScreen]);

  const classTypeOptions = [
    { value: LearningModeEnum.Online, label: 'online' },
    { value: LearningModeEnum.Offline, label: 'offline' },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="subtitle1">{t('createClass')}</Typography>
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
          <Grid item xs={12} sm={12} mt={1}>
            <CustomTextField
              label={t('name')}
              value={form.className}
              onChange={(val) => {
                handleChange('className', val);
              }}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label={t('detail')}
              value={form.classDetail || ''}
              onChange={(val) => {
                handleChange('classDetail', val);
              }}
              disabled={disabled}
              multiline
              rows={detailRows}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <CustomDateTimePicker
              label={t('startAt')}
              value={form.startAt?.toISOString()}
              onChange={(val) => {
                handleChange('startAt', new Date(val));
              }}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomDateTimePicker
              label={t('endAt')}
              value={form.endAt?.toISOString()}
              onChange={(val) => {
                handleChange('endAt', new Date(val));
              }}
              disabled={disabled}
            />
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label={`${t('duration')} (HH:mm:ss)`}
              value={form.duration}
              onChange={(val) => {
                handleChange('duration', val);
              }}
              disabled={disabled}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <CustomTextField
              label={t('minuteLate')}
              type="number"
              value={form.minuteLate}
              onChange={(val) => {
                handleChange('minuteLate', Number(val));
              }}
              disabled={disabled}
            />
          </Grid> */}

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown
              label={t('classType')}
              value={form.classType ?? ''}
              onChange={(value) => {
                handleChange('classType', value);
              }}
              options={classTypeOptions}
            />
          </Grid>

          {(form.classType as LearningModeEnum) === LearningModeEnum.Online && (
            <Grid item xs={12}>
              <CustomTextField
                label={t('meetingLink')}
                value={form.meetingLink}
                onChange={(val) => {
                  handleChange('meetingLink', val);
                }}
                disabled={false}
                sx={{ '& .MuiInputBase-root': { height: fullScreen ? '100%' : 'auto' } }}
              />
            </Grid>
          )}

          {(form.classType as LearningModeEnum) === LearningModeEnum.Offline && (
            <Grid item xs={12}>
              <CustomButton
                variant="outlined"
                label={
                  form.latitude && form.longitude
                    ? form.locationAddress !== undefined
                      ? `${form.locationAddress}`
                      : `${form.latitude.toFixed(5)}, ${form.longitude.toFixed(5)}`
                    : t('selectLocation')
                }
                onClick={() => setOpenMap(true)}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isCreateQrCode === true}
                  onChange={(e) => {
                    handleChange('isCreateQrCode', e.target.checked);
                  }}
                  disabled={false}
                />
              }
              label={t('isCreateQrCode')}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              label={t('createClass')}
              onClick={() => {
                onSubmit(form);
              }}
              loading={loading}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <MapPickerDialog
        open={openMap}
        onClose={() => setOpenMap(false)}
        onSelect={({ lat, lng, address }) => {
          handleChange('latitude', lat);
          handleChange('longitude', lng);
          handleChange('locationAddress', address);
        }}
        initialPosition={form.latitude && form.longitude ? { lat: form.latitude, lng: form.longitude } : null}
      />
    </Dialog>
  );
}
