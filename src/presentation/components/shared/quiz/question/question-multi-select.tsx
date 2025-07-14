'use client';

import React, { useEffect, useState } from 'react';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
import { QuestionUsecase } from '@/domain/usecases/question/question-usecase';
import { useQuestionSelectDebounce } from '@/presentation/hooks/question/use-question-select-debounce';
import { useQuestionSelectLoader } from '@/presentation/hooks/question/use-question-select-loader';
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

import QuestionInformationForm from './question-information-form';

interface QuestionMultiSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  questionUsecase: QuestionUsecase | null;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function QuestionMultiSelectDialog({
  questionUsecase,
  value,
  onChange,
  label = 'Questions',
  disabled = false,
  ...selectProps
}: QuestionMultiSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useQuestionSelectDebounce(localSearchText, 300);
  const [selectedQuestionMap, setSelectedQuestionMap] = useState<Record<string, QuestionResponse>>({});
  const [selectedQuestion, setSelectedQuestion] = React.useState<QuestionResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const {
    questions,
    loadingQuestions,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadQuestions,
  } = useQuestionSelectLoader({
    questionUsecase,
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
    if (questionUsecase && !loadingQuestions) {
      loadQuestions(newPage, true);
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
    if (questionUsecase && value.length > 0) {
      const fetchSelectedQuestions = async () => {
        try {
          const request = new GetQuestionRequest({});
          const result = await questionUsecase.getQuestionListInfo(request);
          const newMap = { ...selectedQuestionMap };
          let updated = false;
          for (const question of result.questions) {
            if (!newMap[question.id]) {
              newMap[question.id] = question;
              updated = true;
            }
          }
          if (updated) {
            setSelectedQuestionMap(newMap);
          }
        } catch (error) {
          console.error('Error fetching selected courses:', error);
        }
      };
      fetchSelectedQuestions();
    }
  }, [questionUsecase, value, selectedQuestionMap]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedQuestionMap };
      let updated = false;
      for (const question of questions) {
        if (question.id && !newMap[question.id]) {
          newMap[question.id] = question;
          updated = true;
        }
      }
      if (updated) {
        setSelectedQuestionMap(newMap);
      }
    }
  }, [questions, dialogOpen, selectedQuestionMap]);

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
            selected.map((id: string) => selectedQuestionMap[id]?.questionText || id).join(', ') ||
            'No Questions Selected'
          }
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Questions</Typography>
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
            {questions.map((question) => (
              <MenuItem
                key={question.id}
                value={question.id}
                onClick={() =>
                  setLocalValue((prev) =>
                    prev.includes(question.id) ? prev.filter((id) => id !== question.id) : [...prev, question.id]
                  )
                }
              >
                <Checkbox checked={localValue.includes(question.id)} />
                <ListItemText
                  primary={question.questionText}
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
                    setSelectedQuestion(question);
                    setViewOpen(true);
                  }}
                >
                  Show Detail
                </Button>
              </MenuItem>
            ))}
            {loadingQuestions && (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            )}
            {!loadingQuestions && questions.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No questions found
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

      {selectedQuestion && (
        <QuestionInformationForm
          open={viewOpen}
          questionId={selectedQuestion?.id ?? null}
          onClose={() => setViewOpen(false)}
        />
      )}
    </>
  );
}
