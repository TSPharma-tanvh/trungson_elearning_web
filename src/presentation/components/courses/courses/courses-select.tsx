'use client';

import { useEffect, useState } from 'react';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { useDebounce } from '@/presentation/hooks/course/use-course-debounce';
import { useCourseLoader } from '@/presentation/hooks/course/use-course-loader';
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

interface CourseSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  courseUsecase: CourseUsecase | null;
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

export function CourseSelectDialog({
  courseUsecase,
  value,
  onChange,
  label = 'Courses',
  disabled = false,
  pathID,
  ...selectProps
}: CourseSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useDebounce(localSearchText, 300);
  const [selectedCourseMap, setSelectedCourseMap] = useState<Record<string, CourseDetailResponse>>({});

  const {
    courses,
    loadingCourses,
    pageNumber,
    totalPages,
    setSearchText,
    courseType,
    displayType,
    scheduleStatus,
    disableStatus,
    setCourseType,
    setDisplayType,
    setScheduleStatus,
    setDisableStatus,
    listRef,
    loadCourses,
  } = useCourseLoader({
    courseUsecase,
    isOpen: dialogOpen,
    pathID,
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
    setCourseType(undefined);
    setDisplayType(undefined);
    setScheduleStatus(undefined);
    setDisableStatus(undefined);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (courseUsecase && !loadingCourses) {
      loadCourses(newPage, true);
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
    if (courseUsecase && value.length > 0) {
      const fetchSelectedCourses = async () => {
        try {
          const request = new GetCourseRequest({ pathID });
          const result = await courseUsecase.getCourseListInfo(request);
          const newMap = { ...selectedCourseMap };
          let updated = false;
          for (const course of result.courses) {
            if (!newMap[course.id]) {
              newMap[course.id] = course;
              updated = true;
            }
          }
          if (updated) {
            setSelectedCourseMap(newMap);
          }
        } catch (error) {
          console.error('Error fetching selected courses:', error);
        }
      };
      fetchSelectedCourses();
    }
  }, [courseUsecase, value, pathID, selectedCourseMap]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedCourseMap };
      let updated = false;
      for (const course of courses) {
        if (course.id && !newMap[course.id]) {
          newMap[course.id] = course;
          updated = true;
        }
      }
      if (updated) {
        setSelectedCourseMap(newMap);
      }
    }
  }, [courses, dialogOpen, selectedCourseMap]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="course-select-label">{label}</InputLabel>
        <Select
          labelId="course-select-label"
          multiple
          value={value}
          input={<OutlinedInput label={label} />}
          onClick={handleOpen}
          renderValue={(selected) =>
            selected.map((id: string) => selectedCourseMap[id]?.name || id).join(', ') || 'No Courses Selected'
          }
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Courses</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen((prev) => !prev)} size="small">
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <TextField
            fullWidth
            placeholder="Search courses..."
            value={localSearchText}
            onChange={(e) => setLocalSearchText(e.target.value)}
            size="small"
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Course Type</InputLabel>
              <Select
                value={courseType !== undefined ? String(courseType) : ''}
                onChange={(e: SelectChangeEvent<string>) =>
                  setCourseType(e.target.value !== '' ? (Number(e.target.value) as LearningModeEnum) : undefined)
                }
                label="Course Type"
              >
                {filterOptions.courseType.map((opt) => (
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
            {courses.map((course) => (
              <MenuItem
                key={course.id}
                value={course.id}
                onClick={() =>
                  setLocalValue((prev) =>
                    prev.includes(course.id) ? prev.filter((id) => id !== course.id) : [...prev, course.id]
                  )
                }
              >
                <Checkbox checked={localValue.includes(course.id)} />
                <ListItemText primary={course.name} />
              </MenuItem>
            ))}
            {loadingCourses && (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            )}
            {!loadingCourses && courses.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No courses found
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
