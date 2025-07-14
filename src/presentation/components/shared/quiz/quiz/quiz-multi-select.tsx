'use client';

import React, { useEffect, useState } from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { useQuizSelectDebounce } from '@/presentation/hooks/quiz/use-quiz-select-debounce';
import { useQuizSelectLoader } from '@/presentation/hooks/quiz/use-quiz-select-loader';
import { Book, BookOutlined } from '@mui/icons-material';
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
  SelectChangeEvent,
  SelectProps,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';

interface QuizMultiSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  quizUsecase: QuizUsecase | null;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function QuizMultiSelectDialog({
  quizUsecase,
  value,
  onChange,
  label = 'Quizzes',
  disabled = false,
  ...selectProps
}: QuizMultiSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useQuizSelectDebounce(localSearchText, 300);
  const [selectedQuizMap, setSelectedQuizMap] = useState<Record<string, QuizResponse>>({});
  const [selectedQuiz, setSelectedQuiz] = React.useState<QuizResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const {
    quizzes,
    loadingQuizzes,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadQuizzes,
  } = useQuizSelectLoader({
    quizUsecase,
    isOpen: dialogOpen,
    searchText: debouncedSearchText,
  });

  const isFull = isSmallScreen || isFullscreen;

  // Handlers
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
      loadQuizzes(newPage, true);
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
    if (quizUsecase && value.length > 0) {
      const fetchSelectedQuizzes = async () => {
        try {
          const newMap = { ...selectedQuizMap };
          let updated = false;

          for (const id of value) {
            if (!newMap[id]) {
              const response = await quizUsecase.getQuizById(id);
              const quiz = response;
              if (quiz?.id) {
                newMap[quiz.id] = quiz;
                updated = true;
              }
            }
          }

          if (updated) {
            setSelectedQuizMap(newMap);
          }
        } catch (error) {
          console.error('Error fetching selected quizzes:', error);
        }
      };

      fetchSelectedQuizzes();
    }
  }, [quizUsecase, value]);

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
        <InputLabel id="course-select-label">{label}</InputLabel>
        <Select
          labelId="course-select-label"
          multiple
          value={value}
          input={
            <OutlinedInput label={label} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected.map((id: string) => selectedQuizMap[id]?.title || id).join(', ') || 'No Quizzes Selected'
          }
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Quizzes</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen((prev) => !prev)} size="small">
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder="Search courses..." />
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
                onClick={() =>
                  setLocalValue((prev) =>
                    prev.includes(quiz.id!) ? prev.filter((id) => id! !== quiz.id!) : [...prev, quiz.id!]
                  )
                }
              >
                <Checkbox checked={localValue.includes(quiz.id ?? '')} />
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
            {loadingQuizzes && (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            )}
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

      {/* {selectedQuiz && (
        <QuizInformationForm open={viewOpen} quizId={selectedQuiz?.id ?? null} onClose={() => setViewOpen(false)} />
      )} */}
    </>
  );
}
