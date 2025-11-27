'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { type QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { useQuizSelectLoader } from '@/presentation/hooks/quiz/use-quiz-select-loader';
import { QuizTypeEnum } from '@/utils/enum/core-enum';
import { InfoOutlined, Tag } from '@mui/icons-material';
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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import QuizDetailForm from '@/presentation/components/dashboard/quiz/quiz/quiz-detail-form';

interface QuizMultiSelectLessonProps {
  quizUsecase: QuizUsecase;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

// const filterOptions = {
//   hasPath: [undefined, true, false] as const,
// };

export function QuizMultiSelectLesson({
  quizUsecase,
  value = [],
  onChange,
  label = 'exams',
  disabled = false,
}: QuizMultiSelectLessonProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedQuizMap, setSelectedQuizMap] = useState<Record<string, QuizResponse>>({});

  // Filters
  const [canStartOver, setCanStartOver] = useState<boolean | undefined>(undefined);
  const [isRequired, setIsRequired] = useState<boolean | undefined>(undefined);
  const [hasLesson, setHasLesson] = useState<boolean | undefined>(undefined);
  const [quizType, setQuizType] = useState<QuizTypeEnum | undefined>(undefined);
  const [isFixedQuiz, setIsFixedQuiz] = useState<boolean | undefined>(undefined);
  const [positionCode, setPositionCode] = useState<string | undefined>(undefined);
  const [positionStateCode, setPositionStateCode] = useState<string | undefined>(undefined);
  const [departmentTypeCode, setDepartmentTypeCode] = useState<string | undefined>(undefined);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponse | null>(null);

  const filters = useMemo(
    () => ({
      canStartOver,
      isRequired,
      hasLesson,
      type: quizType,
      isFixedQuiz,
      positionCode,
      positionStateCode,
      departmentTypeCode,
    }),
    [canStartOver, isRequired, hasLesson, quizType, isFixedQuiz, positionCode, positionStateCode, departmentTypeCode]
  );

  const { quizzes, loadingQuizzes, pageNumber, totalPages, setSearchText, listRef, loadQuizzes } = useQuizSelectLoader({
    quizUsecase,
    isOpen: dialogOpen,
    searchText: localSearchText,
    filters,
  });

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const fetchQuizDetails = useCallback(async () => {
    const idsToFetch = value.filter((id) => !selectedQuizMap[id]);
    if (idsToFetch.length === 0) return;

    try {
      const results = await Promise.all(
        idsToFetch.map(async (id) => {
          try {
            const detail = await quizUsecase.getQuizById(id);
            return { id, detail };
          } catch {
            return { id, detail: null };
          }
        })
      );

      setSelectedQuizMap((prev) => {
        const newMap = { ...prev };
        results.forEach(({ id, detail }) => {
          if (detail) newMap[id] = detail;
        });
        return newMap;
      });
    } catch (error) {
      CustomSnackBar.showSnackbar(t('failedToLoadSomeQuizzes'), 'warning');
    }
  }, [value, quizUsecase, selectedQuizMap, t]);

  useEffect(() => {
    void fetchQuizDetails();
  }, [fetchQuizDetails]);

  const handleOpen = () => {
    if (!disabled) {
      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setLocalValue(value); // reset nếu cancel
  };
  const handleSave = () => {
    onChange(localValue);
    setDialogOpen(false);
  };

  const handleClearFilters = () => {
    setLocalSearchText('');
    setCanStartOver(undefined);
    setIsRequired(undefined);
    setHasLesson(undefined);
    setQuizType(undefined);
    setIsFixedQuiz(undefined);
    setPositionCode(undefined);
    setPositionStateCode(undefined);
    setDepartmentTypeCode(undefined);
  };

  const handlePageChange = (_: unknown, page: number) => {
    void loadQuizzes(page);
    listRef.current?.scrollTo(0, 0);
  };

  const toggleQuiz = (id: string) => {
    setLocalValue((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  return (
    <>
      {/* Select hiển thị */}
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="quiz-multi-select-lesson-label">{t(label)}</InputLabel>
        <Select
          labelId="quiz-multi-select-lesson-label"
          multiple
          value={value}
          onClick={handleOpen}
          input={<OutlinedInput label={t(label)} startAdornment={<Tag sx={{ mr: 1, opacity: 0.7 }} />} />}
          renderValue={(selected) =>
            selected.map((id) => selectedQuizMap[id]?.title || '...').join(', ') || t('noQuizzesSelected')
          }
          open={false}
        >
          <MenuItem disabled value="">
            {t('selectQuizzes')}
          </MenuItem>
        </Select>
      </FormControl>

      {/* Dialog chọn quiz */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        fullScreen={isSmallScreen || isFullscreen}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectQuizzes')}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen((v) => !v);
                }}
                size="small"
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
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
            placeholder={t('searchQuizzes')}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('isRequired')}</InputLabel>
              <Select
                value={isRequired === undefined ? '' : isRequired ? 'true' : 'false'}
                onChange={(e) => {
                  const val = e.target.value;
                  setIsRequired(val === '' ? undefined : val === 'true');
                }}
                label={t('isRequired')}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                <MenuItem value="true">{t('yes')}</MenuItem>
                <MenuItem value="false">{t('no')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('hasLesson')}</InputLabel>
              <Select
                value={hasLesson === undefined ? '' : hasLesson ? 'true' : 'false'}
                onChange={(e) => {
                  const val = e.target.value;
                  setHasLesson(val === '' ? undefined : val === 'true');
                }}
                label={t('hasLesson')}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                <MenuItem value="true">{t('yes')}</MenuItem>
                <MenuItem value="false">{t('no')}</MenuItem>
              </Select>
            </FormControl>

            <Button size="small" variant="outlined" onClick={handleClearFilters}>
              {t('clearFilters')}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ p: 0, m: 0, listStyle: 'none' }}>
            {quizzes.map((item) => {
              const isSelected = localValue.includes(item.id ?? '');
              const textColor = item.type === QuizTypeEnum[QuizTypeEnum.LessonQuiz] ? 'primary.main' : 'secondary.main';

              return (
                <MenuItem
                  key={item.id}
                  selected={isSelected}
                  onClick={() => {
                    toggleQuiz(item.id ?? '');
                  }}
                  sx={{ py: 1.5 }}
                >
                  <Checkbox checked={isSelected} />
                  <ListItemText
                    primary={<Typography sx={{ color: textColor, fontWeight: 500 }}>{item.title}</Typography>}
                    secondary={item.description}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuiz(item);
                      setViewOpen(true);
                    }}
                  >
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </MenuItem>
              );
            })}
          </Box>

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
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} />}
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button onClick={handleSave} variant="contained">
              {t('confirm')} ({localValue.length})
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Preview chi tiết */}
      <QuizDetailForm
        open={viewOpen}
        quizId={selectedQuiz?.id ?? null}
        onClose={() => {
          setViewOpen(false);
        }}
      />
    </>
  );
}
