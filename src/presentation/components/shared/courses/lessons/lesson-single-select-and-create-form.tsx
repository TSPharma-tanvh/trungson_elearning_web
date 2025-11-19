'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { type CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { type UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { type LessonUsecase } from '@/domain/usecases/lessons/lesson-usecase';
import { useLessonSelectDebounce } from '@/presentation/hooks/enrollment/use-lesson-select-debounce';
import { useLessonSelectLoader } from '@/presentation/hooks/lesson/use-lesson-select-loader';
import { type LessonContentEnum, type StatusEnum } from '@/utils/enum/core-enum';
import { Add, Book, Close, FilterList, Fullscreen, FullscreenExit, MoreVert } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  Pagination,
  Typography,
  useMediaQuery,
  type SelectProps,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import { CreateLessonDialog } from '@/presentation/components/dashboard/courses/lessons/create-lesson-form';
import LessonDetailForm from '@/presentation/components/dashboard/courses/lessons/lesson-detail-form';
import { UpdateLessonFormDialog } from '@/presentation/components/dashboard/courses/lessons/update-lesson-form';

import { LessonSelectFilterDialog } from './lesson-filter-dialog';

interface LessonSingleSelectAndCreateDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  lessonUsecase: LessonUsecase;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  // allowClear?: boolean;
}

export function LessonSingleSelectAndCreateDialog({
  lessonUsecase,
  value,
  onChange,
  label = 'lesson',
  disabled = false,
  // allowClear = true,
  ...selectProps
}: LessonSingleSelectAndCreateDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetailResponse | null>(null);

  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Local state
  const [localValue, setLocalValue] = useState<string>(value || '');
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useLessonSelectDebounce(localSearchText, 300);

  // Lưu lesson đã chọn để hiển thị tên
  const [selectedLessonDetail, setSelectedLessonDetail] = useState<LessonDetailResponse | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    contentType: undefined as LessonContentEnum | undefined,
    status: undefined as StatusEnum | undefined,
    hasVideo: undefined as boolean | undefined,
    hasFileResource: undefined as boolean | undefined,
    hasCourse: undefined as boolean | undefined,
  });

  const { lessons, loadingLessons, pageNumber, totalPages, listRef, loadLessons } = useLessonSelectLoader({
    lessonUsecase,
    isOpen: dialogOpen,
    searchText: debouncedSearchText,
    filters,
  });

  const isFull = isSmallScreen || isFullscreen;

  // Lấy chi tiết lesson đã chọn để hiển thị tên
  const fetchSelectedLesson = useCallback(async () => {
    if (!value || selectedLessonDetail?.id === value) return;
    try {
      const lesson = await lessonUsecase.getLessonById(value);
      setSelectedLessonDetail(lesson);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading lesson';
      CustomSnackBar.showSnackbar(message, 'error');
    }
  }, [value, lessonUsecase, selectedLessonDetail?.id]);

  // Handlers
  const handleCreateLesson = async (request: CreateLessonRequest) => {
    try {
      const response = await lessonUsecase.createLesson(request);
      setShowCreateDialog(false);
      CustomSnackBar.showSnackbar(t('lessonCreatedSuccessfully'), 'success');
      await loadLessons(1, true);

      if (response?.result?.id) {
        const newId = response.result.id;
        setLocalValue(newId);
        onChange(newId);
      }
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to create lesson', 'error');
    }
  };

  const handleEditLesson = async (request: UpdateLessonRequest) => {
    try {
      const response = await lessonUsecase.updateLesson(request);
      await loadLessons(pageNumber, true);
      setShowEditDialog(false);
      setSelectedLesson(null);
      return response;
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to update lesson', 'error');
      throw error;
    }
  };

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setDeleteLoading(true);
      await lessonUsecase.deleteLesson(pendingDeleteId);
      CustomSnackBar.showSnackbar(t('deleteSuccess'), 'success');
      await loadLessons(pageNumber, true);

      // Nếu lesson bị xóa là lesson đang chọn → bỏ chọn
      if (localValue === pendingDeleteId) {
        setLocalValue('');
        onChange('');
        setSelectedLessonDetail(null);
      }
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to delete lesson', 'error');
    } finally {
      setDeleteLoading(false);
      setPendingDeleteId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setLocalValue(value || '');
  };

  const handleSave = () => {
    onChange(localValue);
    setDialogOpen(false);
  };

  const handleFilterConfirm = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setFilterOpen(false);
  };

  // Sync external value
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    if (dialogOpen) {
      void loadLessons(1, true);
    }
  }, [filters, dialogOpen, loadLessons]);

  useEffect(() => {
    void fetchSelectedLesson();
  }, [fetchSelectedLesson]);

  return (
    <>
      {/* Select trigger */}
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="lesson-single-select-label">{t(label)}</InputLabel>
        <Select
          labelId="lesson-single-select-label"
          value={value}
          label={t(label)}
          onClick={() => {
            setDialogOpen(true);
          }}
          startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />}
          displayEmpty
          renderValue={(selected: string) => {
            if (!selected || !selectedLessonDetail) return <em>{t('selectLesson')}</em>;
            return selectedLessonDetail.name;
          }}
          open={false}
          {...selectProps}
        />
      </FormControl>

      {/* Main Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('selectLesson')}</Typography>
          <Box>
            <IconButton
              onClick={() => {
                setIsFullscreen(!isFullscreen);
              }}
              size="small"
            >
              {isFull ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Toolbar */}
        <Box sx={{ px: 3, pb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <CustomSearchInput
            value={localSearchText}
            onChange={(val) => {
              setLocalSearchText(val);
            }}
            placeholder={t('searchLessons')}
          />

          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterList />}
            onClick={() => {
              setFilterOpen(true);
            }}
          >
            {t('filter')}
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            {t('createLesson')}
          </Button>
        </Box>

        {/* Lesson list */}
        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {lessons.map((lesson) => (
              <LessonListItem
                key={lesson.id}
                lesson={lesson}
                selected={localValue === lesson.id}
                onSelect={() => {
                  setLocalValue(lesson.id);
                }}
                onView={() => {
                  setSelectedLesson(lesson);
                  setViewOpen(true);
                }}
                onEdit={() => {
                  setSelectedLesson(lesson);
                  setShowEditDialog(true);
                }}
                onDelete={() => {
                  if (lesson.id) {
                    handleRequestDelete(lesson.id);
                  }
                }}
              />
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

        {/* Pagination + Actions */}
        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={(e, p) => void loadLessons(p, true)}
                color="primary"
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

      {/* Các dialog phụ */}
      <LessonSelectFilterDialog
        open={filterOpen}
        onClose={() => {
          setFilterOpen(false);
        }}
        onConfirm={handleFilterConfirm}
        initialFilters={filters}
      />

      <CreateLessonDialog
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
        onSubmit={handleCreateLesson}
        disabled={false}
        loading={false}
      />

      {selectedLesson ? (
        <UpdateLessonFormDialog
          open={showEditDialog}
          data={selectedLesson}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedLesson(null);
          }}
          onSubmit={handleEditLesson}
          onSuccess={() => {
            setShowEditDialog(false);
            setSelectedLesson(null);
          }}
        />
      ) : null}

      {selectedLesson ? (
        <LessonDetailForm
          open={viewOpen}
          lessonId={selectedLesson.id ?? null}
          onClose={() => {
            setViewOpen(false);
            setSelectedLesson(null);
          }}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        selectedCount={1}
        onCancel={() => {
          setPendingDeleteId(null);
          setDeleteDialogOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </>
  );
}

// LessonListItem cho single select (radio style)
function LessonListItem({
  lesson,
  selected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: {
  lesson: LessonDetailResponse;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <MenuItem
      selected={selected}
      onClick={onSelect}
      sx={{
        bgcolor: selected ? 'action.selected' : 'transparent',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>{lesson.name}</Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
        >
          <MoreVert />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <MenuItem
          onClick={() => {
            onView();
            setAnchorEl(null);
          }}
        >
          {t('viewDetails')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEdit();
            setAnchorEl(null);
          }}
        >
          {t('edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete();
            setAnchorEl(null);
          }}
          sx={{ color: 'error.main' }}
        >
          {t('delete')}
        </MenuItem>
      </Menu>
    </MenuItem>
  );
}
