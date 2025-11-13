'use client';

import React, { useState } from 'react';
import { LearningModeEnum, LessonContentEnum, StatusDisplayNames, StatusEnum } from '@/utils/enum/core-enum';
import { Close, Fullscreen, FullscreenExit } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface LessonSelectFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (filters: any) => void;
  initialFilters: any;
}

export function LessonSelectFilterDialog({ open, onClose, onConfirm, initialFilters }: LessonSelectFilterDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [filters, setFilters] = useState({
    contentType: initialFilters.contentType ?? undefined,
    status: initialFilters.status ?? undefined,
    lessonType: initialFilters.lessonType ?? undefined,
    isRequired: initialFilters.isRequired ?? undefined,
    enablePlay: initialFilters.enablePlay ?? undefined,
    hasVideo: initialFilters.hasVideo ?? undefined,
    hasFileResource: initialFilters.hasFileResource ?? undefined,
    hasCourse: initialFilters.hasCourse ?? undefined,
  });

  const handleChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({
      contentType: undefined,
      status: undefined,
      lessonType: undefined,
      isRequired: undefined,
      enablePlay: undefined,
      hasVideo: undefined,
      hasFileResource: undefined,
      hasCourse: undefined,
    });
  };

  const isFull = isSmallScreen || isFullscreen;

  return (
    <Dialog open={open} onClose={onClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('filter')}</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setIsFullscreen(!isFullscreen);
            }}
            size="small"
          >
            {isFull ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {/* Content Type */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('contentType')}</InputLabel>
            <Select
              value={filters.contentType !== undefined ? String(filters.contentType) : ''}
              onChange={(e) => {
                handleChange('contentType', e.target.value !== '' ? Number(e.target.value) : undefined);
              }}
              label={t('contentType')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              {Object.values(LessonContentEnum)
                .filter((v) => typeof v === 'number')
                .map((val) => (
                  <MenuItem key={val} value={val}>
                    {t(LessonContentEnum[val].toLowerCase())}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Status */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('status')}</InputLabel>
            <Select
              value={filters.status !== undefined ? String(filters.status) : ''}
              onChange={(e) => {
                handleChange('status', e.target.value !== '' ? Number(e.target.value) : undefined);
              }}
              label={t('status')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              {Object.values(StatusEnum)
                .filter((v) => typeof v === 'number')
                .map((val) => (
                  <MenuItem key={val} value={val}>
                    {t(StatusDisplayNames[val])}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Lesson Type */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('lessonType')}</InputLabel>
            <Select
              value={filters.lessonType !== undefined ? String(filters.lessonType) : ''}
              onChange={(e) => {
                handleChange('lessonType', e.target.value !== '' ? Number(e.target.value) : undefined);
              }}
              label={t('lessonType')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              {Object.values(LearningModeEnum)
                .filter((v) => typeof v === 'number')
                .map((val) => (
                  <MenuItem key={val} value={val}>
                    {t(LearningModeEnum[val].toLowerCase())}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Required */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('required')}</InputLabel>
            <Select
              value={filters.isRequired === undefined ? '' : filters.isRequired ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('isRequired', val === '' ? undefined : val === 'true');
              }}
              label={t('required')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
            </Select>
          </FormControl>

          {/* Enable Auto Play */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('enableAutoPlay')}</InputLabel>
            <Select
              value={filters.enablePlay === undefined ? '' : filters.enablePlay ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('enablePlay', val === '' ? undefined : val === 'true');
              }}
              label={t('enableAutoPlay')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
            </Select>
          </FormControl>

          {/* Has Video */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('hasVideo')}</InputLabel>
            <Select
              value={filters.hasVideo === undefined ? '' : filters.hasVideo ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('hasVideo', val === '' ? undefined : val === 'true');
              }}
              label={t('hasVideo')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
            </Select>
          </FormControl>

          {/* Has File Resource */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('hasFileResource')}</InputLabel>
            <Select
              value={filters.hasFileResource === undefined ? '' : filters.hasFileResource ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('hasFileResource', val === '' ? undefined : val === 'true');
              }}
              label={t('hasFileResource')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
            </Select>
          </FormControl>

          {/* Has Course */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('hasCourse')}</InputLabel>
            <Select
              value={filters.hasCourse === undefined ? '' : filters.hasCourse ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('hasCourse', val === '' ? undefined : val === 'true');
              }}
              label={t('hasCourse')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleClear} variant="outlined" fullWidth>
          {t('clear')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm(filters);
            onClose();
          }}
          fullWidth
        >
          {t('applyFilter')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
