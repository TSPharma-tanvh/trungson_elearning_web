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
  useTheme,
  type SelectChangeEvent,
  type SelectProps,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSearchInput } from '../../core/text-field/custom-search-input';
import EnrollmentDetailForm from '../../dashboard/management/enrollment/enrollment-detail-form';

interface EnrollmentSelectProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  enrollmentUsecase: EnrollmentUsecase;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
  categoryEnum: CategoryEnum;
}
export function EnrollmentMultiSelect({
  enrollmentUsecase,
  value,
  onChange,
  label = 'enrollmentCriteria',
  disabled = false,
  categoryEnum,
}: EnrollmentSelectProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
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
    const fetch = async () => {
      const newMap = { ...selectedEnrollmentMap };
      let updated = false;

      for (const id of value) {
        if (!newMap[id]) {
          try {
            const detail = await enrollmentUsecase.getEnrollmentById(id);
            newMap[id] = detail;
            updated = true;
          } catch (error) {
            return undefined;
          }
        }
      }

      if (updated) setSelectedEnrollmentMap(newMap);
    };

    if (value.length > 0) void fetch();
  }, [value, enrollmentUsecase]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleOpen = () => {
    if (!disabled) {
      setDialogOpen(true);
    }
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
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="enrollment-select-label">{t(label)}</InputLabel>
        <Select
          multiple
          labelId="enrollment-select-label"
          value={value}
          input={
            <OutlinedInput label={t(label)} startAdornment={<Tag sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected.map((id: string) => selectedEnrollmentMap[id]?.name || id).join(', ') || t('noCriteriaSelected')
          }
          open={false}
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
              setSearchText(val);
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

        <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
          {enrollments.map((item) => {
            const checked = localValue.includes(item.id);
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                onClick={() => {
                  setLocalValue((prev) => (checked ? prev.filter((id) => id !== item.id) : [...prev, item.id]));
                }}
              >
                <Checkbox checked={checked} />
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
            );
          })}

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
            <Button onClick={handleSave} variant="contained">
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
