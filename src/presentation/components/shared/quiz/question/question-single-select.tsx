'use client';

import React, { useEffect, useState } from 'react';
import { type QuestionResponse } from '@/domain/models/question/response/question-response';
import { type QuestionUsecase } from '@/domain/usecases/question/question-usecase';
import { useQuestionSelectDebounce } from '@/presentation/hooks/question/use-question-select-debounce';
import { useQuestionSelectLoader } from '@/presentation/hooks/question/use-question-select-loader';
import { InfoOutlined, QuestionMarkOutlined } from '@mui/icons-material';
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
  Radio,
  Select,
  Typography,
  useMediaQuery,
  type SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';

import QuestionInformationForm from './question-information-form';

interface QuestionSingleSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  questionUsecase: QuestionUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function QuestionSingleSelectDialog({
  questionUsecase,
  value,
  onChange,
  label = 'questions',
  disabled = false,
  ...selectProps
}: QuestionSingleSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useQuestionSelectDebounce(localSearchText, 300);
  const [selectedQuestionMap, setSelectedQuestionMap] = useState<Record<string, QuestionResponse>>({});
  const [selectedQuestion, setSelectedQuestion] = React.useState<QuestionResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const { questions, loadingQuestions, pageNumber, totalPages, listRef, setSearchText, loadQuestions } =
    useQuestionSelectLoader({
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
      void loadQuestions(newPage, true);
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
    if (questionUsecase && value) {
      const fetchSelectedQuestion = async () => {
        try {
          if (!selectedQuestionMap[value]) {
            const response = await questionUsecase.getQuestionById(value);
            const question = response;
            if (question?.id) {
              setSelectedQuestionMap((prev) => ({ ...prev, [question.id]: question }));
            }
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      };

      void fetchSelectedQuestion();
    }
  }, [questionUsecase, value]);

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
        <InputLabel id="question-select-label">{t(label)}</InputLabel>
        <Select
          labelId="question-select-label"
          value={value}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={<QuestionMarkOutlined sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedQuestionMap[selected]?.questionText || selected || 'No Question Selected'}
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectQuestions')}</Typography>
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
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('searchQuestions')} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              {t('clearFilters')}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {questions.map((question) => (
              <MenuItem
                key={question.id}
                value={question.id}
                onClick={() => {
                  setLocalValue(question.id);
                }}
              >
                <Radio checked={localValue === question.id} />
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
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuestion(question);
                    setViewOpen(true);
                  }}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}
            {loadingQuestions ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : null}
            {!loadingQuestions && questions.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('empty')}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '80%' }}>
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
            <Button onClick={handleSave} variant="contained">
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedQuestion ? (
        <QuestionInformationForm
          open={viewOpen}
          questionId={selectedQuestion?.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
