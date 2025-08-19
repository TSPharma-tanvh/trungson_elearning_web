import { useEffect, useState } from 'react';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
import { UpdateUserAnswerRequest } from '@/domain/models/user-answer/request/update-user-answer-request';
import { UserAnswerResponse } from '@/domain/models/user-answer/response/user-answer-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { QuestionEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ListNumbers } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface AnswerDetailDialogProps {
  open: boolean;
  answer: UserAnswerResponse;
  questionId: string;
  onClose: () => void;
  onSaved: () => void;
}

export function AnswerDetailDialog({ open, answer, questionId, onClose, onSaved }: AnswerDetailDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const { questionUsecase, userAnswerUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [score, setScore] = useState(answer.score?.toString() ?? '');
  const [isScoreValid, setIsScoreValid] = useState(true);
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && questionId) {
      setIsLoadingQuestion(true);
      questionUsecase
        .getQuestionById(questionId)
        .then(setQuestion)
        .catch((error) => {
          CustomSnackBar.showSnackbar('Lỗi khi lấy chi tiết câu hỏi', 'error');
          console.error('Failed to fetch question:', error);
        })
        .finally(() => setIsLoadingQuestion(false));
    }
  }, [open, questionId, questionUsecase]);

  const handleSave = async () => {
    const numericValue = /^\d+$/.test(score) ? Number(score) : undefined;
    if (numericValue !== undefined && question?.point !== undefined && numericValue > question.point) {
      CustomSnackBar.showSnackbar(`Điểm không được vượt quá ${question.point}`, 'error');
      return;
    }

    setIsSubmitting(true);

    const req = new UpdateUserAnswerRequest({
      id: answer.id ?? '',
      score: numericValue ?? null,
      answerText:
        question?.questionType === QuestionEnum[QuestionEnum.LongAnswer] ||
        question?.questionType === QuestionEnum[QuestionEnum.ShortAnswer]
          ? answer.answerText ?? ''
          : null,
      isCorrect: answer.isCorrect ?? null,
    });

    try {
      const result = await userAnswerUsecase.updateUserAnswer(req);

      CustomSnackBar.showSnackbar(t('updateSuccess'), 'success');
      onSaved();
      onClose();
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label: string, value: string | number | undefined) => (
    <Grid item xs={12}>
      <Typography variant="body2" fontWeight={500}>
        {t(label)}:
      </Typography>
      <Typography variant="body2">{value ?? '-'}</Typography>
    </Grid>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('answerDetails')}</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {isLoadingQuestion ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : question ? (
            <>
              <Typography variant="body2" fontWeight={500}>
                {t('questionDetails')}:
              </Typography>
              <Typography variant="body2">{question.questionText}</Typography>
              {question.questionType === 'multiple_choice' && question.answers?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {t('answerOptions')}:
                  </Typography>
                  {question.answers.map((ans, ansIndex) => (
                    <Typography key={ans.id ?? ansIndex} variant="body2">
                      {`${ansIndex + 1}. ${ans.answerText ?? 'N/A'} ${ans.isCorrect ? `(${t('correct')})` : ''}`}
                    </Typography>
                  ))}
                </Box>
              )}
              {question.questionType !== 'multiple_choice' && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {t('correctAnswer')}:
                  </Typography>
                  {question.answers
                    ?.filter((a) => a.isCorrect)
                    .map((a, index) => (
                      <Typography key={a.id ?? index} variant="body2">
                        #{index + 1}: {a.answerText ?? t('noCorrectAnswer')}
                      </Typography>
                    )) ?? <Typography variant="body2">{t('noCorrectAnswer')}</Typography>}
                </Box>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('score')}: {question.point ?? 0}
              </Typography>
            </>
          ) : (
            <Typography variant="body2">{t('questionDataNotAvailable')}</Typography>
          )}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {renderField('answerId', answer.id)}
            {renderField('questionId', answer.questionID)}
            {renderField('answerText', answer.answerText)}
            {renderField('answeredAt', DateTimeUtils.formatISODateToString(answer.answeredAt))}
            {renderField('elapsedSeconds', answer.elapsedSeconds)}
            {renderField('sessionID', answer.sessionID)}
            {answer.selectedAnswers?.map((sa, saIndex) => (
              <Grid item xs={12} key={sa.id ?? saIndex}>
                <Typography variant="body2" fontWeight={500}>
                  {t('selectedAnswer')} {saIndex + 1}:
                </Typography>
                <Typography variant="body2">{sa.answer?.answerText ?? '-'}</Typography>
              </Grid>
            ))}
            <Grid item xs={12}>
              <CustomTextField
                label={t('answerScore')}
                value={score}
                onChange={(value) => {
                  setScore(value);
                  const isValid = /^\d+$/.test(value) || value === '';
                  setIsScoreValid(isValid);
                }}
                disabled={isSubmitting}
                icon={<ListNumbers size={20} weight="fill" color="#616161" />}
                inputMode="numeric"
                onValidationChange={setIsScoreValid}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            m: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting || !isScoreValid}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
