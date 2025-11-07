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

interface ClassMultiSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  classUsecase: ClassUsecase | null;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

const COURSE_TYPES = [LearningModeEnum.Online, LearningModeEnum.Offline] as const;
const SCHEDULE_STATUSES = [
  ScheduleStatusEnum.Schedule,
  ScheduleStatusEnum.Ongoing,
  ScheduleStatusEnum.Cancelled,
] as const;

export function ClassMultiSelectDialog({
  classUsecase,
  value,
  onChange,
  label = 'class',
  disabled = false,
  ...selectProps
}: ClassMultiSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  /* --------------------------- UI state --------------------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearch = useClassSelectDebounce(localSearchText, 300);

  const [classType, setClassType] = useState<LearningModeEnum | undefined>(undefined);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(undefined);

  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, ClassResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(null);

  /* --------------------------- Loader --------------------------- */
  const { classes, loadingClasses, pageNumber, totalPages, listRef, loadClasses } = useClassSelectLoader({
    classUsecase,
    isOpen: dialogOpen,
    classType,
    scheduleStatus,
    searchText: debouncedSearch,
  });

  const isFull = isSmallScreen || isFullscreen;

  /* --------------------------- Effects --------------------------- */
  useEffect(() => setLocalValue(value), [value]);

  // Reset when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setLocalValue(value);
      setLocalSearchText('');
      setClassType(undefined);
      setScheduleStatus(undefined);
    }
  }, [dialogOpen, value]);

  // Load any selected classes that are **not** already cached
  useEffect(() => {
    if (!classUsecase || value.length === 0) return;

    const fetchMissing = async () => {
      const missingIds = value.filter((id) => !selectedClassMap[id]);
      if (missingIds.length === 0) return;

      try {
        const promises = missingIds.map((id) => classUsecase!.getClassById(id));
        const results = await Promise.all(promises);
        const newMap = { ...selectedClassMap };
        let changed = false;
        for (const cls of results) {
          if (cls?.id && !newMap[cls.id]) {
            newMap[cls.id] = cls;
            changed = true;
          }
        }
        if (changed) setSelectedClassMap(newMap);
      } catch (e) {
        CustomSnackBar.showSnackbar(e instanceof Error ? e.message : 'Failed to load selected classes', 'error');
      }
    };
    void fetchMissing();
  }, [classUsecase, value, selectedClassMap]);

  // Merge newly loaded classes into cache
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

  /* --------------------------- Handlers --------------------------- */
  const handleOpen = () => !disabled && setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);
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

  const toggleClass = (id: string) => {
    setLocalValue((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  /* ------------------------------ UI ------------------------------ */
  return (
    <>
      {/* ---------- MULTI‑SELECT (outside dialog) ---------- */}
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="class-multi-label">{t(label)}</InputLabel>
        <Select
          labelId="class-multi-label"
          multiple
          value={value}
          input={
            <OutlinedInput label={t(label)} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected
              .map((id) => selectedClassMap[id]?.className)
              .filter(Boolean)
              .join(', ') || t('noClassSelected')
          }
          open={false}
          {...selectProps}
        />
      </FormControl>

      {/* ------------------- DIALOG ------------------- */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectClass')}</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen((p) => !p)} size="small">
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('searchClass')} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* ---- Class Type ---- */}
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

            {/* ---- Schedule Status ---- */}
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
                selected={localValue.includes(cls.id)}
                onClick={() => toggleClass(cls.id)}
                sx={{ py: 1.5 }}
              >
                <Checkbox checked={localValue.includes(cls.id)} />
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

            {loadingClasses && (
              <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                {t('loading')}
              </Typography>
            )}

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
            <Button onClick={handleSave} variant="contained" disabled={localValue.length === 0}>
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* ------------------- Detail Modal ------------------- */}
      {selectedClass && (
        <ClassDetailForm open={viewOpen} classId={selectedClass.id ?? null} onClose={() => setViewOpen(false)} />
      )}
    </>
  );
}
