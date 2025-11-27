'use client';

import React, { useEffect, useState } from 'react';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { type ClassTeacherResponse } from '@/domain/models/teacher/response/class-teacher-response';
import { type ClassTeacherUsecase } from '@/domain/usecases/class/class-teacher-usecase';
import { useClassTeacherSelectLoader } from '@/presentation/hooks/teacher/use-class-teacher-loader';
import { useClassTeacherSelectDebounce } from '@/presentation/hooks/teacher/use-teacher-select-debounce';
import { type LearningModeEnum, type ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { InfoOutlined, School } from '@mui/icons-material';
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
  type SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import ClassTeacherDetailForm from '@/presentation/components/dashboard/class/teacher/class-teacher-detail-form';

interface ClassTeacherSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  classUsecase: ClassTeacherUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
}

export function ClassTeacherSelectDialog({
  classUsecase,
  value,
  onChange,
  label = 'teacher',
  disabled = false,
  pathID,
  ...selectProps
}: ClassTeacherSelectDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useClassTeacherSelectDebounce(localSearchText, 300);
  const [selectedClassTeacherMap, setSelectedClassTeacherMap] = useState<Record<string, ClassTeacherResponse>>({});
  const [classType, setClassTeacherType] = useState<LearningModeEnum | undefined>(undefined);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(undefined);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedClassTeacher, setSelectedClassTeacher] = useState<ClassTeacherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    classes,
    loadingClassTeachers: loadingClassTeacheres,
    pageNumber,
    totalPages,
    setSearchText,
    listRef,
    loadClassTeachers: loadClassTeacheres,
  } = useClassTeacherSelectLoader({
    classUsecase,
    isOpen: dialogOpen,
    classType,
    scheduleStatus,
    searchText: debouncedSearchText,
  });

  const isFull = isSmallScreen || isFullscreen;

  // Handlers
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

  const handleClearFilters = () => {
    setLocalSearchText('');
    setClassTeacherType(undefined);
    setScheduleStatus(undefined);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (classUsecase && !loadingClassTeacheres) {
      void loadClassTeacheres(newPage, true);
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
    }
  };

  // Effects
  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (classUsecase && value && !selectedClassTeacherMap[value]) {
      const fetchSelectedClassTeachers = async () => {
        setLoading(true);
        try {
          const request = new GetClassTeacherRequest();
          const result = await classUsecase.getClassTeacherListInfo(request);
          const newMap = { ...selectedClassTeacherMap };
          let updated = false;
          for (const cls of result.teachers) {
            if (!newMap[cls.id]) {
              newMap[cls.id] = cls;
              updated = true;
            }
          }
          if (updated) {
            setSelectedClassTeacherMap(newMap);
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        } finally {
          setLoading(false);
        }
      };
      void fetchSelectedClassTeachers();
    } else {
      setLoading(false);
    }
  }, [classUsecase, value, selectedClassTeacherMap, pathID]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedClassTeacherMap };
      let updated = false;
      for (const cls of classes) {
        if (cls.id && !newMap[cls.id]) {
          newMap[cls.id] = cls;
          updated = true;
        }
      }
      if (updated) {
        setSelectedClassTeacherMap(newMap);
      }
    }
  }, [classes, dialogOpen]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="class-select-label">{t(label)}</InputLabel>
        <Select
          labelId="class-select-label"
          value={loading ? '' : value || ''}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={<School sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={() =>
            loading
              ? t('loading')
              : selectedClassTeacherMap[value]?.user
                ? `${selectedClassTeacherMap[value].user.employee?.name ?? ''} (${
                    selectedClassTeacherMap[value].user.userName ?? ''
                  })`
                : 'Select Teacher'
          }
          open={false}
          {...selectProps}
        >
          {Object.values(selectedClassTeacherMap).map((cls) => (
            <MenuItem key={cls.id} value={cls.id}>
              {`${cls.user?.employee?.name ?? ''} (${cls.user?.userName ?? ''})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectTeacher')}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen((prev) => !prev);
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'nowrap',
              width: '100%',
            }}
          >
            <CustomSearchInput
              value={localSearchText}
              onChange={setLocalSearchText}
              placeholder={t('searchTeacher')}
              sx={{ flexGrow: 1, minWidth: 0 }}
            />
            <Button size="small" onClick={handleClearFilters} variant="outlined" sx={{ whiteSpace: 'nowrap' }}>
              {t('clearFilter')}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {loadingClassTeacheres ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : classes.length === 0 ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('empty')}
              </Typography>
            ) : (
              classes.map((cls) => (
                <MenuItem
                  key={cls.id}
                  value={cls.id}
                  selected={localValue === cls.id}
                  onClick={() => {
                    setLocalValue(cls.id);
                  }}
                >
                  <Checkbox checked={localValue === cls.id} />
                  <ListItemText
                    primary={`${cls.user?.employee?.name ?? ''} (${cls.user?.userName ?? ''})`}
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
                      setSelectedClassTeacher(cls);
                      setViewOpen(true);
                    }}
                    aria-label={t('showDetails')}
                  >
                    <InfoOutlined fontSize="small" />{' '}
                  </IconButton>
                </MenuItem>
              ))
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

      {selectedClassTeacher ? (
        <ClassTeacherDetailForm
          open={viewOpen}
          classId={selectedClassTeacher?.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
