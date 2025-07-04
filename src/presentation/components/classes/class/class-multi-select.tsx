'use client';

import React, { useEffect, useState } from 'react';
import { GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { ClassResponse } from '@/domain/models/class/response/class-response';
import { ClassUsecase } from '@/domain/usecases/class/class-usecase';
import { useClassSelectDebounce } from '@/presentation/hooks/class/use-class-select-debounce';
import { useClassSelectLoader } from '@/presentation/hooks/class/use-class-select-loader';
import {
  DisplayTypeDisplayNames,
  DisplayTypeEnum,
  LearningModeDisplayNames,
  LearningModeEnum,
  ScheduleStatusDisplayNames,
  ScheduleStatusEnum,
  StatusDisplayNames,
  StatusEnum,
} from '@/utils/enum/core-enum';
import { Book, BookOutlined } from '@mui/icons-material';
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
  SelectChangeEvent,
  SelectProps,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { CustomSearchInput } from '../../core/text-field/custom-search-input';
import ClassDetailForm from '../../dashboard/class/classes/class-detail-form';

interface ClassMultiSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  classUsecase: ClassUsecase | null;
  value: string[];
  onChange: (value: string[]) => void;
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

export function ClassMultiSelectDialog({
  classUsecase,
  value,
  onChange,
  label = 'Classes',
  disabled = false,
  pathID,
  ...selectProps
}: ClassMultiSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useClassSelectDebounce(localSearchText, 300);
  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, ClassResponse>>({});
  const [classType, setClassType] = useState<LearningModeEnum | undefined>(undefined);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(undefined);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<ClassResponse | null>(null);

  const {
    classes,
    loadingClasses,
    pageNumber,
    totalPages,
    setSearchText,
    setClassType: setLoaderClassType,
    setScheduleStatus: setLoaderScheduleStatus,
    listRef,
    loadClasses,
  } = useClassSelectLoader({
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
    setClassType(undefined);
    setScheduleStatus(undefined);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (classUsecase && !loadingClasses) {
      loadClasses(newPage, true);
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
    if (classUsecase && value) {
      const fetchSelectedClasses = async () => {
        try {
          const request = new GetClassRequest({ searchText: undefined, pageNumber: 1, pageSize: 10 });
          const result = await classUsecase.getClassListInfo(request);
          const newMap = { ...selectedClassMap };
          let updated = false;
          // result.class is the correct property, not result.courses
          for (const cls of result.class) {
            if (!newMap[cls.id]) {
              newMap[cls.id] = cls;
              updated = true;
            }
          }
          if (updated) {
            setSelectedClassMap(newMap);
          }
        } catch (error) {
          console.error('Error fetching selected classes:', error);
        }
      };
      fetchSelectedClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classUsecase, value, pathID]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedClassMap };
      let updated = false;
      for (const cls of classes) {
        if (cls.id && !newMap[cls.id]) {
          newMap[cls.id] = cls;
          updated = true;
        }
      }
      if (updated) {
        setSelectedClassMap(newMap);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes, dialogOpen]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="class-multi-select-label">{label}</InputLabel>
        <Select
          labelId="class-multi-select-label"
          multiple
          value={value}
          input={
            <OutlinedInput label={label} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected
              .map((id) => selectedClassMap[id]?.className)
              .filter(Boolean)
              .join(', ') || 'No Class Selected'
          }
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Class</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen((prev) => !prev)} size="small">
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder="Search classes..." />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Class Type</InputLabel>
              <Select
                value={classType !== undefined ? String(classType) : ''}
                onChange={(e: SelectChangeEvent<string>) =>
                  setClassType(e.target.value !== '' ? (Number(e.target.value) as LearningModeEnum) : undefined)
                }
                label="Class Type"
              >
                {filterOptions.courseType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {opt != null ? LearningModeDisplayNames[opt] : 'All'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              Clear Filters
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {classes.map((cls) => (
              <MenuItem
                key={cls.id}
                value={cls.id}
                selected={localValue.includes(cls.id)}
                onClick={() => {
                  setLocalValue((prev) =>
                    prev.includes(cls.id) ? prev.filter((id) => id !== cls.id) : [...prev, cls.id]
                  );
                }}
              >
                <Checkbox checked={localValue.includes(cls.id)} />
                <ListItemText primary={cls.className} />
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(cls);
                    setViewOpen(true);
                  }}
                >
                  Show Detail
                </Button>
              </MenuItem>
            ))}
            {loadingClasses && (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            )}
            {!loadingClasses && classes.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No classes found
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={localValue.length === 0}>
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedClass && (
        <ClassDetailForm open={viewOpen} classId={selectedClass?.id ?? null} onClose={() => setViewOpen(false)} />
      )}
    </>
  );
}
