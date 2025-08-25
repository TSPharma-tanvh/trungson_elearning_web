'use client';

import React, { useEffect, useState } from 'react';
import { type QuestionResponse } from '@/domain/models/question/response/question-response';
import { type QuestionUsecase } from '@/domain/usecases/question/question-usecase';
import { useQuestionSelectLoader } from '@/presentation/hooks/question/use-question-select-loader';
import { StatusEnum } from '@/utils/enum/core-enum';
import { InfoOutlined, QuestionMarkOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
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
  useTheme,
  type SelectProps,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import QuestionDetailForm from '@/presentation/components/dashboard/quiz/question/question-detail';

interface QuestionSelectProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  questionUsecase: QuestionUsecase;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function QuestionMultiSelect({
  questionUsecase,
  value,
  onChange,
  label = 'questions',
  disabled = false,
}: QuestionSelectProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedQuestionMap, setSelectedQuestionMap] = useState<Record<string, QuestionResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | null>(null);

  const { questions, loadingQuestions, pageNumber, totalPages, setSearchText, listRef, loadQuestions } =
    useQuestionSelectLoader({
      questionUsecase,
      isOpen: dialogOpen,
    });

  const isFull = isSmallScreen || isFullscreen;

  useEffect(() => {
    const fetch = async () => {
      const newMap = { ...selectedQuestionMap };
      let updated = false;

      for (const id of value) {
        if (!newMap[id]) {
          try {
            const detail = await questionUsecase.getQuestionById(id);
            newMap[id] = detail;
            updated = true;
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An error has occurred.';
            CustomSnackBar.showSnackbar(message, 'error');
          }
        }
      }

      if (updated) setSelectedQuestionMap(newMap);
    };

    if (value.length > 0) void fetch();
  }, [value, questionUsecase]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleOpen = () => {
    if (!disabled) {
      setDialogOpen(true);
    }
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
    void loadQuestions(newPage);
    listRef.current?.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    setLocalSearchText('');
    setSearchText('');
  };

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="question-select-label">{t(label)}</InputLabel>
        <Select
          multiple
          labelId="question-select-label"
          value={value}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={<QuestionMarkOutlined sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected.map((id: string) => selectedQuestionMap[id]?.questionText || id).join(', ') || ''
          }
          open={false}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectQuestions')}</Typography>
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
            placeholder={t('searchQuestions')}
          />

          <Button size="small" onClick={handleClearFilters} variant="outlined">
            {t('clearFilters')}
          </Button>
        </DialogTitle>

        <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
          {questions.map((item) => {
            const checked = localValue.includes(item.id);
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                onClick={() => {
                  setLocalValue((prev) => (checked ? prev.filter((id) => id !== item.id) : [...prev, item.id]));
                }}
              >
                <Checkbox checked={checked} />
                <ListItemText
                  primary={item.questionText}
                  sx={{
                    color:
                      item.status === StatusEnum[StatusEnum.Enable]
                        ? 'var(--mui-palette-primary-main)'
                        : 'var(--mui-palette-error-main)',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuestion(item);
                    setViewOpen(true);
                  }}
                  aria-label={t('showDetails')}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            );
          })}

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
            <Button onClick={handleSave} variant="contained">
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedQuestion ? (
        <QuestionDetailForm
          open={viewOpen}
          questionId={selectedQuestion.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
