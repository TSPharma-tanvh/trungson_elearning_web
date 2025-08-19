'use client';

import React, { useEffect, useState } from 'react';
import { type EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { type EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { useEnrollmentSelectLoader } from '@/presentation/hooks/enrollment/use-enrollment-select-loader';
import { StatusEnum, StatusEnumUtils, type CategoryEnum } from '@/utils/enum/core-enum';
import { InfoOutlined, Tag } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  type SelectChangeEvent,
  type SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { CustomSearchInput } from '../../core/text-field/custom-search-input';
import EnrollmentDetailForm from '../../dashboard/management/enrollment/enrollment-detail-form';

interface EnrollmentFilterProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  enrollmentUsecase: EnrollmentUsecase;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  categoryEnum: CategoryEnum;
  maxWidth?: number;
}

export function EnrollmentSingleFilter({
  enrollmentUsecase,
  value,
  onChange,
  label = 'enrollmentCriteria',
  disabled = false,
  categoryEnum,
  maxWidth = 200,
  ...selectProps
}: EnrollmentFilterProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedEnrollmentMap, setSelectedEnrollmentMap] = useState<Record<string, EnrollmentCriteriaDetailResponse>>(
    {}
  );
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = React.useState<EnrollmentCriteriaDetailResponse | null>(null);
  const {
    enrollments,
    loadingEnrollments,
    pageNumber,
    totalPages,
    setSearchText,
    disableStatus,
    setDisableStatus,
    listRef,
    loadEnrollments,
  } = useEnrollmentSelectLoader({
    enrollmentUsecase,
    isOpen: dialogOpen,
    categoryEnum,
  });

  const isFull = isSmallScreen || isFullscreen;

  useEffect(() => {
    setSearchText(localSearchText);
  }, [localSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const fetch = async () => {
      if (value && !selectedEnrollmentMap[value]) {
        try {
          const detail = await enrollmentUsecase.getEnrollmentById(value);
          setSelectedEnrollmentMap((prev) => ({ ...prev, [value]: detail }));
        } catch (error) {
          return undefined;
        }
      }
    };
    void fetch();
  }, [value, enrollmentUsecase]);

  const handleOpen = () => {
    if (!disabled) setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setLocalValue(value);
  };

  const handleSave = () => {
    onChange(localValue);
    setDialogOpen(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    void loadEnrollments(newPage);
    listRef.current?.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    setLocalSearchText('');
    setDisableStatus(undefined);
  };

  return (
    <>
      <FormControl
        disabled={disabled}
        size="small"
        sx={{
          '& .MuiInputLabel-root': {
            color: 'var(--mui-palette-secondary-main)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--mui-palette-primary-main)',
          },
          '& .MuiInputLabel-shrink': {
            color: 'var(--mui-palette-primary-main)',
          },
          '& .MuiInputLabel-shrink.Mui-focused': {
            color: 'var(--mui-palette-secondary-main)',
          },
          maxWidth,
          width: '100%',
        }}
      >
        <InputLabel id="enrollment-select-label">{t(label)}</InputLabel>
        <Select
          labelId="enrollment-select-label"
          value={value}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={<Tag sx={{ mr: 1, color: 'var(--mui-palette-secondary-main)', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedEnrollmentMap[selected]?.name || t('noCriteriaSelected')}
          open={false}
          sx={{
            '& .MuiSelect-select': {
              backgroundColor: 'var(--mui-palette-common-white)',
              color: 'var(--mui-palette-secondary-main)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-primary-main)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-secondary-main)',
            },
          }}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectEnrollmentCriteria')}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen(!isFullscreen);
                }}
                size="small"
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <CustomSearchInput
            value={localSearchText}
            onChange={(val) => {
              setLocalSearchText(val);
            }}
            placeholder={t('searchEnrollment')}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>{t('disableStatus')}</InputLabel>
              <Select
                value={disableStatus !== undefined ? String(disableStatus) : ''}
                onChange={(e: SelectChangeEvent) => {
                  setDisableStatus(e.target.value !== '' ? (Number(e.target.value) as StatusEnum) : undefined);
                }}
                label={t('disableStatus')}
              >
                {[undefined, StatusEnum.Enable, StatusEnum.Disable].map((opt) => {
                  const rawKey = opt !== undefined ? StatusEnumUtils.getStatusKeyFromValue(opt) : 'all';
                  const key = rawKey ? rawKey.charAt(0).toLowerCase() + rawKey.slice(1) : 'all';

                  return (
                    <MenuItem key={opt ?? 'all'} value={opt !== undefined ? String(opt) : ''}>
                      {t(key)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              {t('clearFilters')}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {enrollments.map((item) => (
              <MenuItem
                key={item.id}
                value={item.id}
                selected={localValue === item.id}
                onClick={() => {
                  setLocalValue(item.id);
                }}
              >
                <Checkbox checked={localValue === item.id} />
                <ListItemText primary={item.name} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEnrollment(item);
                    setViewOpen(true);
                  }}
                  aria-label={t('showDetails')}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}

            {loadingEnrollments ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : null}
            {!loadingEnrollments && enrollments.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('empty')}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
                color="primary"
                size={isSmallScreen ? 'small' : 'medium'}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button onClick={handleSave} variant="contained" disabled={!localValue}>
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedEnrollment ? (
        <EnrollmentDetailForm
          open={viewOpen}
          enrollmentId={selectedEnrollment.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
