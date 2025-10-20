'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { type CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { useCourseSelectDebounce } from '@/presentation/hooks/course/use-course-select-debounce';
import { useCourseSelectLoader } from '@/presentation/hooks/course/use-course-select-loader';
import {
  DisplayTypeDisplayNames,
  DisplayTypeEnum,
  LearningModeDisplayNames,
  LearningModeEnum,
  ScheduleStatusEnum,
  StatusDisplayNames,
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
import CourseDetailForm from '@/presentation/components/dashboard/courses/courses/course-detail-form';

interface CourseMultiSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
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
  hasPath: [undefined, true, false],
};

export function CourseMultiSelectDialog({
  courseUsecase,
  value,
  onChange,
  label = 'courses',
  disabled = false,
  pathID,
  ...selectProps
}: CourseMultiSelectDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useCourseSelectDebounce(localSearchText, 300);
  const [selectedCourseMap, setSelectedCourseMap] = useState<Record<string, CourseDetailResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailResponse | null>(null);
  const {
    courses,
    loadingCourses,
    pageNumber,
    totalPages,
    setSearchText,
    courseType,
    displayType,
    disableStatus,
    hasPath,
    setCourseType,
    setDisplayType,
    setDisableStatus,
    setHasPath,
    listRef,
    loadCourses,
  } = useCourseSelectLoader({
    courseUsecase,
    isOpen: dialogOpen,
    pathID,
    searchText: debouncedSearchText,
  });

  const isFull = isSmallScreen || isFullscreen;

  const fetchSelectedCourses = useCallback(async () => {
    if (!courseUsecase || value.length === 0) return;
    const idsToFetch = value.filter((id) => !selectedCourseMap[id]);
    await Promise.all(
      idsToFetch.map(async (id) => {
        try {
          const course = await courseUsecase.getCourseById(id);
          setSelectedCourseMap((prev) => ({ ...prev, [id]: course }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      })
    );
  }, [courseUsecase, value, selectedCourseMap]);

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
    setDisableStatus(undefined);
    setHasPath(undefined);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    void loadCourses(newPage, true);
    listRef.current?.scrollTo(0, 0);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    void fetchSelectedCourses();
  }, [fetchSelectedCourses]);

  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="course-select-label">{t(label)}</InputLabel>
        <Select
          labelId="course-select-label"
          multiple
          value={value}
          input={
            <OutlinedInput label={t(label)} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected.map((id) => selectedCourseMap[id]?.name || id).join(', ') || 'No Courses Selected'
          }
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
                  setIsFullscreen(!isFullscreen);
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
          <CustomSearchInput
            value={localSearchText}
            onChange={(val) => {
              setLocalSearchText(val);
              setSearchText(val);
            }}
            placeholder={t('searchCourses')}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('courseType')}</InputLabel>
              <Select
                value={courseType !== undefined ? String(courseType) : ''}
                onChange={(e: SelectChangeEvent) => {
                  setCourseType(e.target.value !== '' ? (Number(e.target.value) as LearningModeEnum) : undefined);
                }}
                label={t('courseType')}
              >
                {filterOptions.courseType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {t(opt !== undefined ? LearningModeDisplayNames[opt] : 'all')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
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
            </FormControl>

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
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('hasPath')}</InputLabel>
              <Select
                value={hasPath !== undefined ? String(hasPath) : ''}
                onChange={(e: SelectChangeEvent) => {
                  setHasPath(e.target.value === '' ? undefined : e.target.value === 'true');
                }}
                label={t('hasPath')}
              >
                {filterOptions.hasPath.map((opt) => {
                  const key = opt === undefined ? 'none' : String(opt);
                  const labelKey = opt === undefined ? 'all' : opt ? 'hasPath' : 'no';
                  return (
                    <MenuItem key={key} value={opt !== undefined ? String(opt) : ''}>
                      {t(labelKey)}
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
            {courses.map((course) => (
              <MenuItem
                key={course.id}
                value={course.id}
                onClick={() => {
                  setLocalValue((prev) =>
                    prev.includes(course.id) ? prev.filter((id) => id !== course.id) : [...prev, course.id]
                  );
                }}
              >
                <Checkbox checked={localValue.includes(course.id)} />
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
            <Button onClick={handleSave} variant="contained">
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
