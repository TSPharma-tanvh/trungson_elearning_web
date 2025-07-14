'use client';

import React, { useEffect, useState } from 'react';
import { GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { AnswerResponse } from '@/domain/models/answer/response/answer-response';
import { AnswerUsecase } from '@/domain/usecases/answer/answer-usecase';
import { useAnswerSelectLoader } from '@/presentation/hooks/answer/use-answer-select-loader';
import { useAnswerSelectDebounce } from '@/presentation/hooks/answer/use-question-select-debounce';
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

interface AnswerMultiSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  answerUsecase: AnswerUsecase | null;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function AnswerMultiSelectDialog({
  answerUsecase,
  value,
  onChange,
  label = 'Answers',
  disabled = false,
  ...selectProps
}: AnswerMultiSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useAnswerSelectDebounce(localSearchText, 300);
  const [selectedAnswerMap, setSelectedAnswerMap] = useState<Record<string, AnswerResponse>>({});
  const [selectedAnswer, setSelectedAnswer] = React.useState<AnswerResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const {
    answers,
    loadingAnswers,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadAnswers,
  } = useAnswerSelectLoader({
    answerUsecase,
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
    if (answerUsecase && !loadingAnswers) {
      loadAnswers(newPage, true);
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
    if (answerUsecase && value.length > 0) {
      const fetchSelectedAnswers = async () => {
        try {
          const newMap = { ...selectedAnswerMap };
          let updated = false;

          for (const id of value) {
            if (!newMap[id]) {
              const response = await answerUsecase.getAnswerById(id);
              const answer = response;
              if (answer?.id) {
                newMap[answer.id] = answer;
                updated = true;
              }
            }
          }

          if (updated) {
            setSelectedAnswerMap(newMap);
          }
        } catch (error) {
          console.error('Error fetching selected answers:', error);
        }
      };

      fetchSelectedAnswers();
    }
  }, [answerUsecase, value, selectedAnswerMap]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedAnswerMap };
      let updated = false;
      for (const answer of answers) {
        if (answer.id && !newMap[answer.id]) {
          newMap[answer.id] = answer;
          updated = true;
        }
      }
      if (updated) {
        setSelectedAnswerMap(newMap);
      }
    }
  }, [answers, dialogOpen, selectedAnswerMap]);

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
            selected.map((id: string) => selectedAnswerMap[id]?.answerText || id).join(', ') || 'No Answers Selected'
          }
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Answers</Typography>
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
            {answers.map((answer) => (
              <MenuItem
                key={answer.id}
                value={answer.id}
                onClick={() =>
                  setLocalValue((prev) =>
                    prev.includes(answer.id ?? '') ? prev.filter((id) => id !== answer.id) : [...prev, answer.id ?? '']
                  )
                }
              >
                <Checkbox checked={localValue.includes(answer.id ?? '')} />
                <ListItemText
                  primary={answer.answerText}
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
                    setSelectedAnswer(answer);
                    setViewOpen(true);
                  }}
                >
                  Show Detail
                </Button>
              </MenuItem>
            ))}
            {loadingAnswers && (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            )}
            {!loadingAnswers && answers.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No answers found
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

      {/* {selectedAnswer && (
        <AnswerInformationForm
          open={viewOpen}
          answerId={selectedAnswer?.id ?? null}
          onClose={() => setViewOpen(false)}
        />
      )} */}
    </>
  );
}
