'use client';

import React, { useEffect, useState } from 'react';
import { type ClassResponse } from '@/domain/models/class/response/class-response';
import { type ClassUsecase } from '@/domain/usecases/class/class-usecase';
import { useClassSelectDebounce } from '@/presentation/hooks/class/use-class-select-debounce';
import { useClassSelectLoader } from '@/presentation/hooks/class/use-class-select-loader';
import {
  LearningModeDisplayNames,
  LearningModeEnum,
  ScheduleStatusDisplayNames,
  ScheduleStatusEnum,
} from '@/utils/enum/core-enum';
import { Book, InfoOutlined } from '@mui/icons-material';
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

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import ClassDetailForm from '@/presentation/components/dashboard/class/classes/class-detail-form';

interface ClassSingleFilterProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  classUsecase: ClassUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

const COURSE_TYPES = [LearningModeEnum.Online, LearningModeEnum.Offline] as const;
const SCHEDULE_STATUSES = [
  ScheduleStatusEnum.Schedule,
  ScheduleStatusEnum.Ongoing,
  ScheduleStatusEnum.Cancelled,
] as const;

export function ClassSingleFilter({
  classUsecase,
  value,
  onChange,
  label = 'class',
  disabled = false,
  ...selectProps
}: ClassSingleFilterProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearch = useClassSelectDebounce(localSearchText, 300);

  const [classType, setClassType] = useState<LearningModeEnum | undefined>(undefined);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(undefined);

  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, ClassResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(null);

  const { classes, loadingClasses, pageNumber, totalPages, listRef, loadClasses } = useClassSelectLoader({
    classUsecase,
    isOpen: dialogOpen,
    classType,
    scheduleStatus,
    searchText: debouncedSearch,
  });

  const isFull = isSmallScreen || isFullscreen;

  // Sync external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Reset filters when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setLocalValue(value);
      setLocalSearchText('');
      setClassType(undefined);
      setScheduleStatus(undefined);
    }
  }, [dialogOpen, value]);

  // Load the selected class
  useEffect(() => {
    if (!classUsecase || !value || selectedClassMap[value]) return;

    const fetch = async () => {
      try {
        const cls = await classUsecase.getClassById(value);
        if (cls?.id) {
          setSelectedClassMap((m) => ({ ...m, [cls.id]: cls }));
        }
      } catch (e) {
        CustomSnackBar.showSnackbar(e instanceof Error ? e.message : 'Failed to load selected class', 'error');
      }
    };
    void fetch();
  }, [classUsecase, value, selectedClassMap]);

  // Merge newly loaded classes into the cache
  useEffect(() => {
    if (!dialogOpen) return;
    const newMap = { ...selectedClassMap };
    let changed = false;
    for (const cls of classes) {
      if (cls.id && !newMap[cls.id]) {
        newMap[cls.id] = cls;
        changed = true;
      }
    }
    if (changed) setSelectedClassMap(newMap);
  }, [classes, dialogOpen]);

  const handleOpen = () => {
    !disabled && setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
  const handleSave = () => {
    onChange(localValue);
    setDialogOpen(false);
  };
  const handleClearFilters = () => {
    setLocalSearchText('');
    setClassType(undefined);
    setScheduleStatus(undefined);
  };
  const handlePageChange = (_: any, page: number) => {
    void loadClasses(page, false);
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <FormControl
        disabled={disabled}
        size="small"
        sx={{
          maxWidth: 300,
          width: '100%',
          '& .MuiInputLabel-root': { color: 'var(--mui-palette-secondary-main)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'var(--mui-palette-primary-main)' },
        }}
      >
        <InputLabel id="class-single-label">{t(label)}</InputLabel>
        <Select
          labelId="class-single-label"
          value={value || ''}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={<Book sx={{ mr: 1, color: 'var(--mui-palette-secondary-main)', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(id) => selectedClassMap[id]?.className || ''}
          open={false}
          sx={{
            '& .MuiSelect-select': {
              backgroundColor: 'var(--mui-palette-common-white)',
              color: 'var(--mui-palette-secondary-main)',
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-primary-main)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-secondary-main)' },
          }}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectClass')}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen((p) => !p);
                }}
                size="small"
              >
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('searchClass')} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('classType')}</InputLabel>
              <Select
                value={classType !== undefined ? String(classType) : ''}
                onChange={(e: SelectChangeEvent) => {
                  const v = e.target.value;
                  setClassType(v === '' ? undefined : (Number(v) as LearningModeEnum));
                }}
                label={t('classType')}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                {COURSE_TYPES.map((opt) => (
                  <MenuItem key={opt} value={String(opt)}>
                    {t(LearningModeDisplayNames[opt])}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('scheduleStatus')}</InputLabel>
              <Select
                value={scheduleStatus !== undefined ? String(scheduleStatus) : ''}
                onChange={(e: SelectChangeEvent) => {
                  const v = e.target.value;
                  setScheduleStatus(v === '' ? undefined : (Number(v) as ScheduleStatusEnum));
                }}
                label={t('scheduleStatus')}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                {SCHEDULE_STATUSES.map((opt) => (
                  <MenuItem key={opt} value={String(opt)}>
                    {t(ScheduleStatusDisplayNames[opt])}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button size="small" onClick={handleClearFilters} variant="outlined">
              {t('clearFilters')}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', p: 0 }}>
            {classes.map((cls) => (
              <MenuItem
                key={cls.id}
                selected={localValue === cls.id}
                onClick={() => {
                  setLocalValue(cls.id ?? '');
                }}
                sx={{ py: 1.5 }}
              >
                <Checkbox checked={localValue === cls.id} />
                <ListItemText
                  primary={cls.className}
                  sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1, mr: 1 }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(cls);
                    setViewOpen(true);
                  }}
                  aria-label={t('showDetails')}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}

            {loadingClasses ? (
              <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                {t('loading')}
              </Typography>
            ) : null}

            {!loadingClasses && classes.length === 0 && (
              <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                {t('empty')}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 2 }}>
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

          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button onClick={handleSave} variant="contained" disabled={!localValue}>
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedClass ? (
        <ClassDetailForm
          open={viewOpen}
          classId={selectedClass.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
