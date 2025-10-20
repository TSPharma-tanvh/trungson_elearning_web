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
  FormControlLabel,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  type SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import camelCase from 'lodash/camelCase';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import QuizDetailForm from '@/presentation/components/dashboard/quiz/quiz/quiz-detail-form';

interface QuizMultiSelectProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  quizUsecase: QuizUsecase;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function QuizMultiSelect({
  quizUsecase,
  value,
  onChange,
  label = 'quizzes',
  disabled = false,
  ...selectProps
}: QuizMultiSelectProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value ?? []);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedQuizMap, setSelectedQuizMap] = useState<Record<string, QuizResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponse | null>(null);
  const [canStartOver, setCanStartOver] = useState<boolean | undefined>(undefined);
  const [isRequired, setIsRequired] = useState<boolean | undefined>(undefined);
  const [hasLesson, setHasLesson] = useState<boolean | undefined>(undefined);
  const [quizType, setQuizType] = useState<QuizTypeEnum | undefined>(undefined);

  const filters = useMemo(() => {
    return {
      canStartOver,
      isRequired,
      hasLesson,
      type: quizType,
    };
  }, [canStartOver, isRequired, hasLesson, quizType]);

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
    await Promise.all(
      idsToFetch.map(async (id) => {
        try {
          const detail = await quizUsecase.getQuizById(id);
          setSelectedQuizMap((prev) => ({ ...prev, [id]: detail }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      })
    );
  }, [value, quizUsecase, selectedQuizMap]);

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
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="quiz-multi-select-label">{t(label)}</InputLabel>
        <Select
          labelId="quiz-multi-select-label"
          multiple
          value={value}
          input={
            <OutlinedInput label={t(label)} startAdornment={<Tag sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected
              .map((id) => selectedQuizMap[id]?.title)
              .filter(Boolean)
              .join(', ') || 'No Quizzes Selected'
          }
          open={false}
          {...selectProps}
        />
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
            <Typography variant="h6">{t('selectQuizzes')}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen(!isFullscreen);
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

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={canStartOver ?? false}
                  onChange={(e) => {
                    setCanStartOver(e.target.checked ? true : undefined);
                  }}
                />
              }
              label={t('canStartOver')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRequired ?? false}
                  onChange={(e) => {
                    setIsRequired(e.target.checked ? true : undefined);
                  }}
                />
              }
              label={t('isRequired')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasLesson ?? false}
                  onChange={(e) => {
                    setHasLesson(e.target.checked ? true : undefined);
                  }}
                />
              }
              label={t('hasLesson')}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{t('quizType')}</InputLabel>
              <Select
                value={quizType ?? ''}
                onChange={(e) => {
                  setQuizType(e.target.value === '' ? undefined : (e.target.value as QuizTypeEnum));
                }}
                input={<OutlinedInput label={t('quizType')} />}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                {Object.keys(QuizTypeEnum)
                  .filter((key) => isNaN(Number(key)))
                  .map((key) => {
                    const camelKey = camelCase(key);
                    return (
                      <MenuItem key={key} value={QuizTypeEnum[key as keyof typeof QuizTypeEnum]}>
                        {t(camelKey)}
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
            {quizzes.map((item) => {
              const isSelected = localValue.includes(item.id ?? '');
              return (
                <MenuItem
                  key={item.id}
                  value={item.id}
                  selected={isSelected}
                  onClick={() => {
                    const id = item.id ?? '';
                    setLocalValue((prev) => (isSelected ? prev.filter((v) => v !== id) : [...prev, id]));
                  }}
                >
                  <Checkbox checked={isSelected} />
                  <ListItemText primary={item.title} />
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
            <Button onClick={handleSave} variant="contained" disabled={localValue.length === 0}>
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedQuiz ? (
        <QuizDetailForm
          open={viewOpen}
          quizId={selectedQuiz.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
