'use client';

import React, { useState } from 'react';
import { QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
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

import { CustomEmployeeDistinctSelectFilter } from '@/presentation/components/core/drop-down/custom-employee-distinct-select-filter';

interface QuizSelectFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (filters: any) => void;
  initialFilters: any;
}

export function QuizSelectFilterDialog({ open, onClose, onConfirm, initialFilters }: QuizSelectFilterDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [filters, setFilters] = useState({
    isRequired: initialFilters.isRequired ?? undefined,
    status: initialFilters.status ?? undefined,
    type: initialFilters.type ?? undefined,
    canStartOver: initialFilters.canStartOver ?? undefined,
    hasLesson: initialFilters.hasLesson ?? undefined,
    isFixedQuiz: initialFilters.isFixedQuiz ?? undefined,
    positionCode: initialFilters.positionCode ?? undefined,
    positionStateCode: initialFilters.positionStateCode ?? undefined,
    departmentTypeCode: initialFilters.departmentTypeCode ?? undefined,
  });

  const handleChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({
      isRequired: undefined,
      status: undefined,
      type: undefined,
      canStartOver: undefined,
      hasLesson: undefined,
      isFixedQuiz: undefined,
      positionCode: undefined,
      positionStateCode: undefined,
      departmentTypeCode: undefined,
    });
  };

  const isFull = isSmallScreen || isFullscreen;

  return (
    <Dialog open={open} onClose={onClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('filter')}</Typography>
        <Box>
          <IconButton onClick={() => setIsFullscreen(!isFullscreen)} size="small">
            {isFull ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {/* Is Required */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('isRequired')}</InputLabel>
            <Select
              value={filters.isRequired === undefined ? '' : filters.isRequired ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('isRequired', val === '' ? undefined : val === 'true');
              }}
              label={t('isRequired')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
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
                    {t(`${StatusEnum[val]}`) || StatusEnum[val]}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Has Lesson */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('hasLesson')}</InputLabel>
            <Select
              value={filters.hasLesson === undefined ? '' : filters.hasLesson ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('hasLesson', val === '' ? undefined : val === 'true');
              }}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
            </Select>
          </FormControl>

          {/* Is Fixed Quiz */}
          <FormControl size="small" fullWidth>
            <InputLabel>{t('isFixedQuiz')}</InputLabel>
            <Select
              value={filters.isFixedQuiz === undefined ? '' : filters.isFixedQuiz ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('isFixedQuiz', val === '' ? undefined : val === 'true');
              }}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

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
