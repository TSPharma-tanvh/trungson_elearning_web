'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { type QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { useQuizSelectLoader } from '@/presentation/hooks/quiz/use-quiz-select-loader';
import { QuizTypeEnum, QuizTypeEnumUtils } from '@/utils/enum/core-enum';
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

import { CustomSelectDropDownDialog } from '@/presentation/components/core/drop-down/custom-select-drop-down-dialog';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import QuizDetailForm from '@/presentation/components/dashboard/quiz/quiz/quiz-detail-form';

interface QuizSingleFilterProps {
  quizUsecase: QuizUsecase;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  maxWidth?: number;
}

export function QuizSingleFilter({
  quizUsecase,
  value,
  onChange,
  label = 'quiz',
  disabled = false,
  maxWidth = 200,
}: QuizSingleFilterProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedQuizMap, setSelectedQuizMap] = useState<Record<string, QuizResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponse | null>(null);

  const [canStartOver, setCanStartOver] = useState<boolean | undefined>(undefined);
  const [isRequired, setIsRequired] = useState<boolean | undefined>(undefined);
  const [hasLesson, setHasLesson] = useState<boolean | undefined>(undefined);
  const [quizType, setQuizType] = useState<QuizTypeEnum | undefined>(undefined);

  const filters = useMemo(
    (): Partial<GetQuizRequest> => ({
      canStartOver,
      isRequired,
      hasLesson,
      type: quizType,
    }),
    [canStartOver, isRequired, hasLesson, quizType]
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
    if (value && !selectedQuizMap[value]) {
      try {
        const detail = await quizUsecase.getQuizById(value);
        setSelectedQuizMap((prev) => ({ ...prev, [value]: detail }));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error has occurred.';
        CustomSnackBar.showSnackbar(message, 'error');
      }
    }
  }, [value, quizUsecase]);

  useEffect(() => {
    void fetchQuizDetails();
  }, [fetchQuizDetails]);

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

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    void loadQuizzes(newPage);
    listRef.current?.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    setLocalSearchText('');
    setCanStartOver(undefined);
    setIsRequired(undefined);
    setHasLesson(undefined);
    setQuizType(undefined);
  };

  return (
    <>
      <FormControl disabled={disabled} size="small" sx={{ maxWidth, width: '100%' }}>
        <InputLabel id="quiz-select-label">{t(label)}</InputLabel>
        <Select
          labelId="quiz-select-label"
          value={value || ''}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={<Tag sx={{ mr: 1, color: 'var(--mui-palette-secondary-main)', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedQuizMap[selected]?.title || ''}
          open={false}
          sx={{
            '& .MuiSelect-select': {
              backgroundColor: 'var(--mui-palette-common-white)',
              color: 'var(--mui-palette-secondary-main)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-primary-main)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-secondary-main)',
            },
          }}
        >
          <MenuItem value="" disabled>
            {t('selectQuiz')}
          </MenuItem>
        </Select>
      </FormControl>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        fullScreen={isSmallScreen || isFullscreen}
        maxWidth="sm"
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectQuiz')}</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen(!isFullscreen)} size="small">
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

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <CustomSelectDropDownDialog
              label="canStartOver"
              value={canStartOver}
              onChange={(val) => setCanStartOver(val as boolean | undefined)}
              options={[
                { value: undefined, label: t('all') },
                { value: true, label: t('yes') },
                { value: false, label: t('no') },
              ]}
            />

            <CustomSelectDropDownDialog
              label="isRequired"
              value={isRequired}
              onChange={(val) => setIsRequired(val as boolean | undefined)}
              options={[
                { value: undefined, label: t('all') },
                { value: true, label: t('yes') },
                { value: false, label: t('no') },
              ]}
            />

            <CustomSelectDropDownDialog
              label="hasLesson"
              value={hasLesson}
              onChange={(val) => setHasLesson(val as boolean | undefined)}
              options={[
                { value: undefined, label: t('all') },
                { value: true, label: t('yes') },
                { value: false, label: t('no') },
              ]}
            />

            <CustomSelectDropDownDialog<QuizTypeEnum>
              label="quizType"
              value={quizType}
              onChange={setQuizType}
              minWidth={160}
              options={[
                { value: undefined, label: t('all') },
                {
                  value: QuizTypeEnum.LessonQuiz,
                  label: t(
                    (QuizTypeEnumUtils.getStatusKeyFromValue(QuizTypeEnum.LessonQuiz) ?? '').replace(/^\w/, (c) =>
                      c.toLowerCase()
                    )
                  ),
                },
                {
                  value: QuizTypeEnum.ExamQuiz,
                  label: t(
                    (QuizTypeEnumUtils.getStatusKeyFromValue(QuizTypeEnum.ExamQuiz) ?? '').replace(/^\w/, (c) =>
                      c.toLowerCase()
                    )
                  ),
                },
              ]}
            />

            <Button size="small" onClick={handleClearFilters} variant="outlined">
              {t('clearFilters')}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {quizzes.map((item) => {
              const isSelected = localValue === item.id;
              const textColor =
                item.type === QuizTypeEnum.LessonQuiz || item.type?.toString() === 'LessonQuiz'
                  ? 'var(--mui-palette-primary-main)'
                  : 'var(--mui-palette-secondary-main)';

              return (
                <MenuItem
                  key={item.id}
                  value={item.id}
                  selected={isSelected}
                  onClick={() => setLocalValue(item.id ?? '')}
                >
                  <Checkbox checked={isSelected} />
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ color: textColor }}>
                        {item.title}
                      </Typography>
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuiz(item);
                      setViewOpen(true);
                    }}
                    aria-label={t('showDetails')}
                  >
                    <InfoOutlined />
                  </IconButton>
                </MenuItem>
              );
            })}

            {loadingQuizzes ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : null}
            {!loadingQuizzes && quizzes.length === 0 && (
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

      {selectedQuiz && (
        <QuizDetailForm open={viewOpen} quizId={selectedQuiz.id ?? null} onClose={() => setViewOpen(false)} />
      )}
    </>
  );
}
