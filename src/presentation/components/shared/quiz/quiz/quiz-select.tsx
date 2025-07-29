'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { type QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { useQuizSelectLoader } from '@/presentation/hooks/quiz/use-quiz-select-loader';
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
  type SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import QuizDetailForm from '@/presentation/components/dashboard/quiz/quiz/quiz-detail-form';

interface QuizSingleSelectProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  quizUsecase: QuizUsecase;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function QuizSingleSelect({
  quizUsecase,
  value,
  onChange,
  label = 'Quiz',
  disabled = false,
  ...selectProps
}: QuizSingleSelectProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedQuizMap, setSelectedQuizMap] = useState<Record<string, QuizResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponse | null>(null);

  const { quizzes, loadingQuizzes, pageNumber, totalPages, setSearchText, searchText, listRef, loadQuizzes } =
    useQuizSelectLoader({
      quizUsecase,
      isOpen: dialogOpen,
    });

  const isFull = isSmallScreen || isFullscreen;

  useEffect(() => {
    if (localSearchText !== searchText) {
      setSearchText(localSearchText);
    }
  }, [localSearchText, searchText, setSearchText]);

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
    // setDisableStatus(undefined);
  };

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="quiz-select-label">{label}</InputLabel>
        <Select
          labelId="quiz-select-label"
          value={value}
          input={
            <OutlinedInput label={label} startAdornment={<Tag sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
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
            }}
            placeholder="Search quizzes..."
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              Clear Filters
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {quizzes.map((item) => (
              <MenuItem
                key={item.id}
                value={item.id}
                selected={localValue === item.id}
                onClick={() => {
                  setLocalValue(item.id ?? '');
                }}
              >
                <Checkbox checked={localValue === item.id} />
                <ListItemText primary={item.title} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuiz(item);
                    setViewOpen(true);
                  }}
                  aria-label="Show Details"
                >
                  <InfoOutlined />
                </IconButton>
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
            <Button onClick={handleSave} variant="contained" disabled={!localValue}>
              Save
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
