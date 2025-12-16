'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { type CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { type QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { useQuizSelectLoader } from '@/presentation/hooks/quiz/use-quiz-select-loader';
import { QuizTypeEnum } from '@/utils/enum/core-enum';
import { Add, Book, Close, FilterList, Fullscreen, FullscreenExit, MoreVert } from '@mui/icons-material';
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
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import { CreateQuizForLessonDialog } from '@/presentation/components/dashboard/quiz/quiz/quiz-create-for-lesson-form';
import QuizDetailForm from '@/presentation/components/dashboard/quiz/quiz/quiz-detail-form';
import { UpdateQuizForLessonDialog } from '@/presentation/components/dashboard/quiz/quiz/quiz-update-form';

import { QuizSelectFilterDialog } from './quiz-select-filter-dialog';

interface QuizSingleSelectAndCreateDialogProps {
  quizUsecase: QuizUsecase;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function QuizSingleSelectAndCreateDialog({
  quizUsecase,
  value = '',
  onChange,
  label = 'quiz',
  disabled = false,
}: QuizSingleSelectAndCreateDialogProps) {
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
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponse | null>(null);

  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Selection & data
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedQuizMap, setSelectedQuizMap] = useState<Record<string, QuizResponse>>({});

  // Filters
  const [filters, setFilters] = useState({
    canStartOver: undefined as boolean | undefined,
    isRequired: undefined as boolean | undefined,
    hasLesson: undefined as boolean | undefined,
    type: QuizTypeEnum.LessonQuiz,
    isFixedQuiz: undefined as boolean | undefined,
    positionCode: undefined as string | undefined,
    positionStateCode: undefined as string | undefined,
    departmentTypeCode: undefined as string | undefined,
  });

  const { quizzes, loadingQuizzes, pageNumber, totalPages, listRef, setSearchText, loadQuizzes } = useQuizSelectLoader({
    quizUsecase,
    isOpen: dialogOpen,
    searchText: localSearchText,
    filters,
  });

  const isFull = isSmallScreen || isFullscreen;

  const fetchSelectedQuizzes = useCallback(async () => {
    if (!value || selectedQuizMap[value]) return;

    try {
      const quiz = await quizUsecase.getQuizById(value);
      setSelectedQuizMap((prev) => ({ ...prev, [value]: quiz }));
    } catch {
      // ignore
    }
  }, [value, quizUsecase, selectedQuizMap]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    void fetchSelectedQuizzes();
  }, [fetchSelectedQuizzes]);

  const handleCreateQuizLesson = async (request: CreateQuizRequest) => {
    try {
      await quizUsecase.createQuiz(request);
      setShowCreateDialog(false);
      await loadQuizzes(1, true);
    } catch (error) {
      return undefined;
    }
  };

  const handleEditQuiz = async (request: UpdateQuizRequest) => {
    try {
      const response = quizUsecase.updateQuiz(request);
      await loadQuizzes(pageNumber, true);
      setShowEditDialog(false);
      setSelectedQuiz(null);
      return response;
    } catch (error) {
      return undefined;
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
      await quizUsecase.deleteQuiz(pendingDeleteId);
      CustomSnackBar.showSnackbar(t('deleteSuccess'), 'success');
      await loadQuizzes(pageNumber, true);
      if (localValue === pendingDeleteId) {
        setLocalValue('');
        onChange('');
      }
    } catch {
      CustomSnackBar.showSnackbar(t('deleteFailed'), 'error');
    } finally {
      setDeleteLoading(false);
      setPendingDeleteId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setLocalValue(value);
  };

  const toggleQuiz = (id: string) => {
    setLocalValue((prev) => (prev === id ? '' : id));
  };

  return (
    <>
      {/* Select hiển thị */}
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>{t(label)}</InputLabel>
        <Select
          value={value}
          onClick={() => {
            setDialogOpen(true);
          }}
          input={<OutlinedInput label={t(label)} startAdornment={<Book sx={{ mr: 1, opacity: 0.7 }} />} />}
          renderValue={() => selectedQuizMap[value]?.title || value || t('noQuizSelected')}
          open={false}
        />
      </FormControl>

      {/* Main Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('selectQuiz')}</Typography>
          <Box>
            <IconButton
              onClick={() => {
                setIsFullscreen(!isFullscreen);
              }}
            >
              {isFull ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box sx={{ px: 3, pb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <CustomSearchInput
            value={localSearchText}
            onChange={(val) => {
              setLocalSearchText(val);
              setSearchText(val);
            }}
            placeholder={t('searchQuizzes')}
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
            {t('createQuiz')}
          </Button>
        </Box>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ p: 0, m: 0, listStyle: 'none' }}>
            {quizzes.map((quiz) => (
              <QuizListItem
                key={quiz.id}
                quiz={quiz}
                selected={localValue === quiz.id}
                onToggle={() => {
                  toggleQuiz(quiz.id ?? '');
                }}
                onView={() => {
                  setSelectedQuiz(quiz);
                  setViewOpen(true);
                }}
                onEdit={() => {
                  setSelectedQuiz(quiz);
                  setShowEditDialog(true);
                }}
                onDelete={() => {
                  if (quiz.id) {
                    handleRequestDelete(quiz.id);
                  }
                }}
              />
            ))}
            {loadingQuizzes ? (
              <Typography textAlign="center" py={2}>
                {t('loading')}...
              </Typography>
            ) : null}
            {!loadingQuizzes && quizzes.length === 0 && (
              <Typography textAlign="center" py={4} color="text.secondary">
                {t('noQuizzesFound')}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && (
            <Pagination count={totalPages} page={pageNumber} onChange={(_, p) => void loadQuizzes(p, true)} />
          )}
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button
              onClick={() => {
                onChange(localValue);
                setDialogOpen(false);
              }}
              variant="contained"
            >
              {t('confirm')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Các dialog phụ */}
      <QuizSelectFilterDialog
        open={filterOpen}
        onClose={() => {
          setFilterOpen(false);
        }}
        onConfirm={(newFilters) => {
          setFilters(newFilters);
          setFilterOpen(false);
        }}
        initialFilters={filters}
      />

      <CreateQuizForLessonDialog
        open={showCreateDialog}
        disabled={false}
        loading={false}
        onClose={() => {
          setShowCreateDialog(false);
        }}
        onSubmit={handleCreateQuizLesson}
      />

      {selectedQuiz ? (
        <UpdateQuizForLessonDialog
          open={showEditDialog}
          quiz={selectedQuiz}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedQuiz(null);
          }}
          onSubmit={handleEditQuiz}
        />
      ) : null}

      {selectedQuiz ? (
        <QuizDetailForm
          open={viewOpen}
          quizId={selectedQuiz.id ?? null}
          onClose={() => {
            setViewOpen(false);
            setSelectedQuiz(null);
          }}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        selectedCount={1}
        onCancel={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </>
  );
}

// Item với menu MoreVert (giữ nguyên)
function QuizListItem({
  quiz,
  selected,
  onToggle,
  onView,
  onEdit,
  onDelete,
}: {
  quiz: QuizResponse;
  selected: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <MenuItem onClick={onToggle}>
      <Checkbox checked={selected} />
      <ListItemText primary={quiz.title} secondary={quiz.description} primaryTypographyProps={{ fontWeight: 500 }} />
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
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
