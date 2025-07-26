'use client';

import React, { useEffect, useState } from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { type QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { useQuizSelectDebounce } from '@/presentation/hooks/quiz/use-quiz-select-debounce';
import { useQuizSelectLoader } from '@/presentation/hooks/quiz/use-quiz-select-loader';
import { Book } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
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

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import QuizDetailForm from '@/presentation/components/dashboard/quiz/quiz/quiz-detail-form';

interface QuizSingleSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  quizUsecase: QuizUsecase | null;
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  disabled?: boolean;
}

export function QuizSingleSelectDialog({
  quizUsecase,
  value,
  onChange,
  label = 'Quiz',
  disabled = false,
  ...selectProps
}: QuizSingleSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string | null>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useQuizSelectDebounce(localSearchText, 300);
  const [selectedQuizMap, setSelectedQuizMap] = useState<Record<string, QuizResponse>>({});
  const [selectedQuiz, setSelectedQuiz] = React.useState<QuizResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const { quizzes, loadingQuizzes, pageNumber, totalPages, listRef, setSearchText, loadQuizzes } = useQuizSelectLoader({
    quizUsecase,
    isOpen: dialogOpen,
    searchText: debouncedSearchText,
  });

  const isFull = isSmallScreen || isFullscreen;

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
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (quizUsecase && !loadingQuizzes) {
      void loadQuizzes(newPage, true);
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (quizUsecase && value) {
      const fetchSelectedQuizzes = async () => {
        try {
          const request = new GetQuizRequest({});
          const result = await quizUsecase.getQuizListInfo(request);
          const newMap = { ...selectedQuizMap };
          let updated = false;
          for (const quiz of result.quizzes) {
            if (!newMap[quiz.id ?? '']) {
              newMap[quiz.id ?? ''] = quiz;
              updated = true;
            }
          }
          if (updated) {
            setSelectedQuizMap(newMap);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An unknown error occurred';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      };
      void fetchSelectedQuizzes();
    }
  }, [quizUsecase, value, selectedQuizMap]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedQuizMap };
      let updated = false;
      for (const quiz of quizzes) {
        if (quiz.id && !newMap[quiz.id]) {
          newMap[quiz.id] = quiz;
          updated = true;
        }
      }
      if (updated) {
        setSelectedQuizMap(newMap);
      }
    }
  }, [quizzes, dialogOpen, selectedQuizMap]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="quiz-select-label">{label}</InputLabel>
        <Select
          labelId="quiz-select-label"
          value={value ?? ''}
          input={
            <OutlinedInput label={label} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedQuizMap[selected]?.title || 'No Quiz Selected'}
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Quiz</Typography>
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
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder="Search quizzes..." />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              Clear Filters
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {quizzes.map((quiz) => (
              <MenuItem
                key={quiz.id}
                value={quiz.id}
                selected={localValue === quiz.id}
                onClick={() => {
                  setLocalValue(quiz.id ?? null);
                }}
              >
                <ListItemText
                  primary={quiz.title}
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    mr: 1,
                  }}
                />
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuiz(quiz);
                    setViewOpen(true);
                  }}
                >
                  Show Detail
                </Button>
              </MenuItem>
            ))}
            {loadingQuizzes ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            ) : null}
            {!loadingQuizzes && quizzes.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No quizzes found
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

      {selectedQuiz ? (
        <QuizDetailForm
          open={viewOpen}
          quizId={selectedQuiz?.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
