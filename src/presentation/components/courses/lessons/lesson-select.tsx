'use client';

import { useEffect, useState } from 'react';
import { GetLessonRequest } from '@/domain/lessons/request/get-lesson-request';
import { LessonDetailResponse } from '@/domain/lessons/response/lesson-detail-response';
import { LessonUsecase } from '@/domain/usecases/lessons/lesson-usecase';
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

interface LessonSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  lessonUsecase: LessonUsecase;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
}

const filterOptions = {
  LessonType: [LearningModeEnum.Online, LearningModeEnum.Offline, undefined],
  displayType: [DisplayTypeEnum.Public, DisplayTypeEnum.Private, undefined],
  scheduleStatus: [ScheduleStatusEnum.Schedule, ScheduleStatusEnum.Ongoing, ScheduleStatusEnum.Cancelled, undefined],
  disableStatus: [StatusEnum.Enable, StatusEnum.Disable, undefined],
};

export function LessonSelectDialog({
  lessonUsecase,
  value,
  onChange,
  label = 'Lessons',
  disabled = false,
  pathID,
  ...selectProps
}: LessonSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useLessonSelectDebounce(localSearchText, 300);
  const [selectedLessonMap, setSelectedLessonMap] = useState<Record<string, LessonDetailResponse>>({});

  const {
    lessons,
    loadingLessons,
    pageNumber,
    totalPages,
    setSearchText,
    lessonType,
    displayType,
    scheduleStatus,
    disableStatus,
    setLessonType,
    setDisplayType,
    setScheduleStatus,
    setDisableStatus,
    listRef,
    loadLessons,
  } = useLessonSelectLoader({
    lessonUsecase,
    isOpen: dialogOpen,
    pathID: '',
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
    setLessonType(undefined);
    setDisplayType(undefined);
    setScheduleStatus(undefined);
    setDisableStatus(undefined);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (LessonUsecase && !loadingLessons) {
      loadLessons(newPage, true);
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
    if (lessonUsecase && value.length > 0) {
      const fetchSelectedLessons = async () => {
        try {
          const request = new GetLessonRequest({});
          const result = await lessonUsecase.getLessonListInfo(request);
          const newMap = { ...selectedLessonMap };
          let updated = false;
          for (const lesson of result.Lessons) {
            if (!newMap[lesson.id]) {
              newMap[lesson.id] = lesson;
              updated = true;
            }
          }
          if (updated) {
            setSelectedLessonMap(newMap);
          }
        } catch (error) {
          console.error('Error fetching selected Lessons:', error);
        }
      };
      fetchSelectedLessons();
    }
  }, [LessonUsecase, value, pathID, selectedLessonMap]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedLessonMap };
      let updated = false;
      for (const lesson of lessons) {
        if (lesson.id && !newMap[lesson.id]) {
          newMap[lesson.id] = lesson;
          updated = true;
        }
      }
      if (updated) {
        setSelectedLessonMap(newMap);
      }
    }
  }, [lessons, dialogOpen, selectedLessonMap]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="Lesson-select-label">{label}</InputLabel>
        <Select
          labelId="Lesson-select-label"
          multiple
          value={value}
          input={
            <OutlinedInput label={label} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected.map((id: string) => selectedLessonMap[id]?.name || id).join(', ') || 'No Lessons Selected'
          }
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Lessons</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen((prev) => !prev)} size="small">
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder="Search Lessons..." />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Lesson Type</InputLabel>
              <Select
                value={lessonType !== undefined ? String(lessonType) : ''}
                onChange={(e: SelectChangeEvent<string>) =>
                  setLessonType(e.target.value !== '' ? (Number(e.target.value) as LearningModeEnum) : undefined)
                }
                label="Lesson Type"
              >
                {filterOptions.LessonType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {opt != null ? LearningModeDisplayNames[opt] : 'All'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Display Type</InputLabel>
              <Select
                value={displayType !== undefined ? String(displayType) : ''}
                onChange={(e: SelectChangeEvent<string>) =>
                  setDisplayType(e.target.value !== '' ? (Number(e.target.value) as DisplayTypeEnum) : undefined)
                }
                label="Display Type"
              >
                {filterOptions.displayType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {opt != null ? DisplayTypeDisplayNames[opt] : 'All'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Schedule Status</InputLabel>
              <Select
                value={scheduleStatus ?? ''}
                onChange={(e) =>
                  setScheduleStatus(e.target.value ? (Number(e.target.value) as ScheduleStatusEnum) : undefined)
                }
                label="Schedule Status"
              >
                {filterOptions.scheduleStatus.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {opt != null ? ScheduleStatusDisplayNames[opt] : 'All'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Disable Status</InputLabel>
              <Select
                value={disableStatus ?? ''}
                onChange={(e) => setDisableStatus(e.target.value ? (Number(e.target.value) as StatusEnum) : undefined)}
                label="Disable Status"
              >
                {filterOptions.disableStatus.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {opt != null ? StatusDisplayNames[opt] : 'All'}
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
            {lessons.map((lesson) => (
              <MenuItem
                key={lesson.id}
                value={lesson.id}
                onClick={() =>
                  setLocalValue((prev) =>
                    prev.includes(lesson.id) ? prev.filter((id) => id !== lesson.id) : [...prev, lesson.id]
                  )
                }
              >
                <Checkbox checked={localValue.includes(lesson.id)} />
                <ListItemText primary={lesson.name} />
              </MenuItem>
            ))}
            {loadingLessons && (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            )}
            {!loadingLessons && lessons.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No Lessons found
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
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
