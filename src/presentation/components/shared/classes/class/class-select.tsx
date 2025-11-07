'use client';

import React, { useEffect, useState } from 'react';
import { GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { type ClassResponse } from '@/domain/models/class/response/class-response';
import { type ClassUsecase } from '@/domain/usecases/class/class-usecase';
import { useClassSelectDebounce } from '@/presentation/hooks/class/use-class-select-debounce';
import { useClassSelectLoader } from '@/presentation/hooks/class/use-class-select-loader';
import {
  DisplayTypeEnum,
  LearningModeDisplayNames,
  LearningModeEnum,
  ScheduleStatusEnum,
  StatusEnum,
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

interface ClassSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  classUsecase: ClassUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
}

const filterOptions = {
  courseType: [LearningModeEnum.Online, LearningModeEnum.Offline, undefined],
  displayType: [DisplayTypeEnum.Public, DisplayTypeEnum.Private, undefined],
  scheduleStatus: [ScheduleStatusEnum.Schedule, ScheduleStatusEnum.Ongoing, ScheduleStatusEnum.Cancelled, undefined],
  disableStatus: [StatusEnum.Enable, StatusEnum.Disable, undefined],
};

export function ClassSelectDialog({
  classUsecase,
  value,
  onChange,
  label = 'class',
  disabled = false,
  pathID,
  ...selectProps
}: ClassSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useClassSelectDebounce(localSearchText, 300);

  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, ClassResponse>>({});
  const [classType, setClassType] = useState<LearningModeEnum | undefined>(undefined);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(undefined);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(null);

  const { classes, loadingClasses, pageNumber, totalPages, listRef, loadClasses } = useClassSelectLoader({
    classUsecase,
    isOpen: dialogOpen,
    classType,
    scheduleStatus,
    searchText: debouncedSearchText,
  });

  const isFull = isSmallScreen || isFullscreen;

  // Reset khi mở dialog
  useEffect(() => {
    if (dialogOpen) {
      setLocalValue(value);
      setLocalSearchText('');
      setClassType(undefined);
      setScheduleStatus(undefined);
    }
  }, [dialogOpen, value]);

  // Tải chi tiết lớp đã chọn
  useEffect(() => {
    if (!classUsecase || !value) return;

    const fetchSelectedClass = async () => {
      try {
        const request = new GetClassRequest({ searchText: undefined, pageNumber: 1, pageSize: 1 });
        const result = await classUsecase.getClassListInfo(request);
        const found = result.class.find((c) => c.id === value);
        if (found) {
          setSelectedClassMap((prev) => ({ ...prev, [value]: found }));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load selected class.';
        CustomSnackBar.showSnackbar(message, 'error');
      }
    };

    if (!selectedClassMap[value]) {
      void fetchSelectedClass();
    }
  }, [value, classUsecase, selectedClassMap]);

  // Cập nhật selectedClassMap từ danh sách classes
  useEffect(() => {
    if (classes.length > 0) {
      const newMap = { ...selectedClassMap };
      let updated = false;
      for (const cls of classes) {
        if (cls.id && !newMap[cls.id]) {
          newMap[cls.id] = cls;
          updated = true;
        }
      }
      if (updated) setSelectedClassMap(newMap);
    }
  }, [classes]);

  const handleOpen = () => {
    if (!disabled) setDialogOpen(true);
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

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    void loadClasses(newPage, false);
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="class-select-label">{t(label)}</InputLabel>
        <Select
          labelId="class-select-label"
          value={value || ''}
          input={
            <OutlinedInput label={t(label)} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedClassMap[selected]?.className || ''}
          open={false}
          {...selectProps}
        >
          <MenuItem value="" disabled>
            {t('selectClass')}
          </MenuItem>
        </Select>
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectClass')}</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen(!isFullscreen)} size="small">
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
                  const val = e.target.value;
                  setClassType(val === '' ? undefined : (Number(val) as LearningModeEnum));
                }}
                label={t('classType')}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                {filterOptions.courseType
                  .filter((opt): opt is LearningModeEnum => opt !== undefined)
                  .map((opt) => (
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
                  const val = e.target.value;
                  setScheduleStatus(val === '' ? undefined : (Number(val) as ScheduleStatusEnum));
                }}
                label={t('scheduleStatus')}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                {Object.entries(ScheduleStatusEnum)
                  .filter(([_, v]) => !isNaN(Number(v)))
                  .map(([key, val]) => (
                    <MenuItem key={val} value={String(val)}>
                      {t(key)}
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
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {classes.map((cls) => (
              <MenuItem
                key={cls.id}
                value={cls.id}
                selected={localValue === cls.id}
                onClick={() => setLocalValue(cls.id ?? '')}
                sx={{ py: 1.5 }}
              >
                <Checkbox checked={localValue === cls.id} />
                <ListItemText
                  primary={cls.className}
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    mr: 1,
                  }}
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
            <Button onClick={handleSave} variant="contained" disabled={!localValue}>
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedClass && (
        <ClassDetailForm open={viewOpen} classId={selectedClass.id ?? null} onClose={() => setViewOpen(false)} />
      )}
    </>
  );
}
