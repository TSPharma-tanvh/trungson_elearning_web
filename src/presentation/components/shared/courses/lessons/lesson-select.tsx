'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { type LessonUsecase } from '@/domain/usecases/lessons/lesson-usecase';
import { useLessonSelectDebounce } from '@/presentation/hooks/enrollment/use-lesson-select-debounce';
import { useLessonSelectLoader } from '@/presentation/hooks/lesson/use-lesson-select-loader';
import {
  DisplayTypeEnum,
  LearningModeDisplayNames,
  LearningModeEnum,
  LessonContentEnum,
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
import camelCase from 'lodash/camelCase';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import LessonDetailForm from '@/presentation/components/dashboard/courses/lessons/lesson-detail-form';

interface LessonSingleSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  lessonUsecase: LessonUsecase;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
}

const filterOptions = {
  lessonType: [LearningModeEnum.Online, LearningModeEnum.Offline, undefined],
  displayType: [DisplayTypeEnum.Public, DisplayTypeEnum.Private, undefined],
  scheduleStatus: [ScheduleStatusEnum.Schedule, ScheduleStatusEnum.Ongoing, ScheduleStatusEnum.Cancelled, undefined],
  disableStatus: [StatusEnum.Enable, StatusEnum.Disable, undefined],
  contentType: [LessonContentEnum.PDF, LessonContentEnum.Video, undefined],
  status: [StatusEnum.Enable, StatusEnum.Disable, undefined],
  hasPath: [undefined, true, false],
};

export function LessonSingleSelectDialog({
  lessonUsecase,
  value,
  onChange,
  label = 'lessons',
  disabled = false,
  ...selectProps
}: LessonSingleSelectDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useLessonSelectDebounce(localSearchText, 300);
  const [selectedLessonMap, setSelectedLessonMap] = useState<Record<string, LessonDetailResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetailResponse | null>(null);
  const [lessonType, setLessonType] = useState<LearningModeEnum | undefined>(undefined);
  const [disableStatus, setDisableStatus] = useState<StatusEnum | undefined>(undefined);
  const [contentType, setContentType] = useState<LessonContentEnum | undefined>(undefined);
  const [status, setStatus] = useState<StatusEnum | undefined>(undefined);
  const [hasVideo, setHasVideo] = useState<boolean | undefined>(undefined);
  const [hasFileResource, setHasFileResource] = useState<boolean | undefined>(undefined);

  const filters = useMemo(
    () => ({
      lessonType,
      disableStatus,
      contentType,
      status,
      hasVideo,
      hasFileResource,
    }),
    [lessonType, disableStatus, contentType, status, hasVideo, hasFileResource]
  );

  const { lessons, loadingLessons, pageNumber, totalPages, listRef, setSearchText, loadLessons } =
    useLessonSelectLoader({
      lessonUsecase,
      isOpen: dialogOpen,
      searchText: debouncedSearchText,
      filters,
    });

  const isFull = isSmallScreen || isFullscreen;

  const fetchSelectedLessons = useCallback(async () => {
    if (!value) return;
    const idsToFetch = [value].filter((id) => !selectedLessonMap[id]);
    await Promise.all(
      idsToFetch.map(async (id) => {
        try {
          const lesson = await lessonUsecase.getLessonById(id);
          setSelectedLessonMap((prev) => ({ ...prev, [id]: lesson }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      })
    );
  }, [value, lessonUsecase, selectedLessonMap]);

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
    setDisableStatus(undefined);
    setContentType(undefined);
    setStatus(undefined);
    setHasVideo(undefined);
    setHasFileResource(undefined);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    void loadLessons(newPage, true);
    listRef.current?.scrollTo(0, 0);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    void fetchSelectedLessons();
  }, [fetchSelectedLessons]);

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
        <InputLabel id="lesson-select-label">{t(label)}</InputLabel>
        <Select
          labelId="lesson-select-label"
          value={value}
          input={
            <OutlinedInput label={t(label)} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedLessonMap[selected]?.name || 'No Lesson Selected'}
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectLessons')}</Typography>
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
            placeholder={t('searchLessons')}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('lessonType')}</InputLabel>
              <Select
                value={lessonType !== undefined ? String(lessonType) : ''}
                onChange={(e: SelectChangeEvent) => {
                  setLessonType(e.target.value !== '' ? (Number(e.target.value) as LearningModeEnum) : undefined);
                }}
                label={t('lessonType')}
              >
                {filterOptions.lessonType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {t(opt !== undefined ? LearningModeDisplayNames[opt] : 'all')}
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
              <InputLabel>{t('contentType')}</InputLabel>
              <Select
                value={contentType !== undefined ? String(contentType) : ''}
                onChange={(e) => {
                  setContentType(e.target.value !== '' ? (Number(e.target.value) as LessonContentEnum) : undefined);
                }}
                label={t('contentType')}
              >
                {filterOptions.contentType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {t(opt !== undefined ? camelCase(LessonContentEnum[opt]) : 'all')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('status')}</InputLabel>
              <Select
                value={status ?? ''}
                onChange={(e) => {
                  setStatus(e.target.value ? (Number(e.target.value) as StatusEnum) : undefined);
                }}
                label={t('status')}
              >
                {filterOptions.status.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {t(opt !== undefined ? StatusDisplayNames[opt] : 'all')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('hasVideo')}</InputLabel>
              <Select
                value={hasVideo === undefined ? '' : hasVideo ? 'true' : 'false'}
                onChange={(e: SelectChangeEvent) => {
                  const newValue = e.target.value;
                  if (newValue === '') {
                    setHasVideo(undefined);
                  } else {
                    setHasVideo(newValue === 'true');
                  }
                }}
                label={t('hasVideo')}
              >
                {filterOptions.hasPath.map((opt) => (
                  <MenuItem key={String(opt ?? 'none')} value={opt === undefined ? '' : String(opt)}>
                    {opt === undefined ? t('all') : opt ? t('yes') : t('no')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('hasFileResource')}</InputLabel>
              <Select
                value={hasFileResource === undefined ? '' : hasFileResource ? 'true' : 'false'}
                onChange={(e: SelectChangeEvent) => {
                  const newValue = e.target.value;
                  if (newValue === '') {
                    setHasFileResource(undefined);
                  } else {
                    setHasFileResource(newValue === 'true');
                  }
                }}
                label={t('hasFileResource')}
              >
                {filterOptions.hasPath.map((opt) => (
                  <MenuItem key={String(opt ?? 'none')} value={opt === undefined ? '' : String(opt)}>
                    {opt === undefined ? t('all') : opt ? t('yes') : t('no')}
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
            {lessons.map((lesson) => (
              <MenuItem
                key={lesson.id}
                value={lesson.id}
                onClick={() => {
                  setLocalValue(lesson.id ?? '');
                }}
              >
                <Checkbox checked={localValue === lesson.id} />
                <ListItemText primary={lesson.name} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLesson(lesson);
                    setViewOpen(true);
                  }}
                  aria-label={t('showDetails')}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}
            {loadingLessons ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : null}
            {!loadingLessons && lessons.length === 0 && (
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

      {selectedLesson ? (
        <LessonDetailForm
          open={viewOpen}
          lessonId={selectedLesson.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
