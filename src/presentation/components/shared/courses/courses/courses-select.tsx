'use client';

import React, { useEffect, useState } from 'react';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { type CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { useCourseSelectDebounce } from '@/presentation/hooks/course/use-course-select-debounce';
import { useCourseSelectLoader } from '@/presentation/hooks/course/use-course-select-loader';
import { DisplayTypeEnum, LearningModeEnum, StatusDisplayNames, StatusEnum } from '@/utils/enum/core-enum';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
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

import { CustomEmployeeDistinctSelectFilter } from '@/presentation/components/core/drop-down/custom-employee-distinct-select-filter';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import CourseDetailForm from '@/presentation/components/dashboard/courses/courses/course-detail-form';

interface CourseSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  courseUsecase: CourseUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
}

const filterOptions = {
  courseType: [LearningModeEnum.Online, LearningModeEnum.Offline, undefined],
  displayType: [DisplayTypeEnum.Public, DisplayTypeEnum.Private, undefined],
  disableStatus: [StatusEnum.Enable, StatusEnum.Disable, undefined],
  hasPath: [undefined, true, false],
};

export function CourseSelectDialog({
  courseUsecase,
  value,
  onChange,
  label = 'courses',
  disabled = false,
  pathID,
  ...selectProps
}: CourseSelectDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useCourseSelectDebounce(localSearchText, 300);
  const [selectedCourseMap, setSelectedCourseMap] = useState<Record<string, CourseDetailResponse>>({});
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<CourseDetailResponse | null>(null);

  const {
    courses,
    loadingCourses,
    pageNumber,
    totalPages,
    setSearchText,
    setCourseType,
    setDisplayType,
    setDisableStatus,
    listRef,
    loadCourses,
    disableStatus,
    setPositionCode,
    setPositionStateCode,
    setDepartmentTypeCode,
    positionCode,
    positionStateCode,
    departmentTypeCode,
    isFixedCourse,
    setIsFixedCourse,
  } = useCourseSelectLoader({
    courseUsecase,
    isOpen: dialogOpen,
    searchText: debouncedSearchText,
  });

  const isFull = isSmallScreen || isFullscreen;

  // Handlers
  const handleOpen = () => {
    if (!disabled) setDialogOpen(true);
    setPositionCode(undefined);
    setPositionStateCode(undefined);
    setDepartmentTypeCode(undefined);
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
    setDisableStatus(undefined);
    setPositionCode(undefined);
    setPositionStateCode(undefined);
    setDepartmentTypeCode(undefined);
    setIsFixedCourse(undefined);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (courseUsecase && !loadingCourses) {
      void loadCourses(newPage, true);
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
    if (courseUsecase && value) {
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
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      };
      void fetchSelectedCourses();
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
        <InputLabel id="course-select-label">{t(label)}</InputLabel>
        <Select
          labelId="course-select-label"
          value={value}
          input={
            <OutlinedInput label={t(label)} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedCourseMap[selected]?.name || 'No Course Selected'}
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectCourses')}</Typography>
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

          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('searchCourses')} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* Course Type */}
            {/* <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('courseType')}</InputLabel>
              <Select
                value={courseType !== undefined ? String(courseType) : ''}
                onChange={(e: SelectChangeEvent) => {
                  setCourseType(e.target.value !== '' ? (Number(e.target.value) as LearningModeEnum) : undefined);
                }}
                label={t('courseType')}
              >
                {filterOptions.courseType.map((opt) => (
                  <MenuItem key={String(opt ?? 'none')} value={opt !== undefined ? String(opt) : ''}>
                    {opt !== undefined ? t(LearningModeDisplayNames[opt]) : t('all')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <CustomEmployeeDistinctSelectFilter
              label={t('departmentType')}
              value={departmentTypeCode}
              type={DepartmentFilterType.DepartmentType}
              onChange={setDepartmentTypeCode}
            />

            <CustomEmployeeDistinctSelectFilter
              label={t('position')}
              value={positionCode}
              type={DepartmentFilterType.Position}
              onChange={setPositionCode}
            />

            <CustomEmployeeDistinctSelectFilter
              label={t('currentPositionStateName')}
              value={positionStateCode}
              type={DepartmentFilterType.PositionState}
              onChange={setPositionStateCode}
            />

            {/* Display Type */}
            {/* <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('displayType')}</InputLabel>
              <Select
                value={displayType !== undefined ? String(displayType) : ''}
                onChange={(e: SelectChangeEvent) => {
                  setDisplayType(e.target.value !== '' ? (Number(e.target.value) as DisplayTypeEnum) : undefined);
                }}
                label={t('displayType')}
              >
                {filterOptions.displayType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {t(opt !== undefined ? DisplayTypeDisplayNames[opt] : 'all')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            {/* Disable Status */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('disableStatus')}</InputLabel>
              <Select
                value={disableStatus ?? ''}
                onChange={(e) => {
                  setDisableStatus(e.target.value ? (Number(e.target.value) as StatusEnum) : undefined);
                }}
                label={t('disableStatus')}
              >
                {filterOptions.disableStatus.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {t(opt !== undefined ? StatusDisplayNames[opt] : 'all')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Has Path */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('isFixedCourse')}</InputLabel>
              <Select
                value={isFixedCourse === undefined ? '' : isFixedCourse ? 'true' : 'false'}
                onChange={(e: SelectChangeEvent) => {
                  const newValue = e.target.value;
                  if (newValue === '') {
                    setIsFixedCourse(undefined);
                  } else {
                    setIsFixedCourse(newValue === 'true');
                  }
                }}
                label={t('isFixedCourse')}
              >
                {filterOptions.hasPath.map((opt) => (
                  <MenuItem key={String(opt ?? 'none')} value={opt === undefined ? '' : String(opt)}>
                    {opt === undefined ? t('all') : opt ? t('yes') : t('no')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear Filters */}
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              {t('clearFilters')}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {courses.map((course) => (
              <MenuItem
                key={course.id}
                value={course.id}
                selected={localValue === course.id}
                onClick={() => {
                  setLocalValue(course.id);
                }}
              >
                <Checkbox checked={localValue === course.id} />
                <ListItemText primary={course.name} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourse(course);
                    setViewOpen(true);
                  }}
                  aria-label={t('showDetails')}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}
            {loadingCourses ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : null}
            {!loadingCourses && courses.length === 0 && (
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

      {selectedCourse ? (
        <CourseDetailForm
          open={viewOpen}
          courseId={selectedCourse.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
