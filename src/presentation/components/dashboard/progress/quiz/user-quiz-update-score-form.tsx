import { useEffect, useState } from 'react';
import { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { type UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { StatusEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';
import { Edit, InfoOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Card,
  CardHeader,
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
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

import { AnswerDetailDialog } from './user-answer-update-form';

interface EditUserQuizScoreDialogProps {
  open: boolean;
  data: UserQuizProgressDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserQuizRequest) => void;
}

export function UpdateUserQuizScoreFormDialog({
  open,
  data: userQuizProgress,
  onClose,
  onSubmit,
}: EditUserQuizScoreDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const { quizUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateUserQuizRequest>(new UpdateUserQuizRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<any | null>(null);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);

  useEffect(() => {
    if (userQuizProgress && open) {
      const newFormData = new UpdateUserQuizRequest({
        userID: userQuizProgress.userId !== undefined ? userQuizProgress.userId : '',
        quizID: userQuizProgress.quizId || undefined,
        score: userQuizProgress.score || undefined,
        startedAt: userQuizProgress.startedAt || undefined,
        completedAt: userQuizProgress.completedAt || undefined,
        progressStatus:
          userQuizProgress.progressStatus !== undefined
            ? UserQuizProgressEnum[userQuizProgress.progressStatus as keyof typeof UserQuizProgressEnum]
            : undefined,
        activeStatus:
          userQuizProgress.activeStatus !== undefined
            ? StatusEnum[userQuizProgress.activeStatus as keyof typeof StatusEnum]
            : undefined,
        attempts: userQuizProgress.attempts || undefined,
      });
      setFormData(newFormData);

      if (userQuizProgress.quizId) {
        setIsLoadingQuiz(true);
        quizUsecase
          .getQuizById(userQuizProgress.quizId)
          .then((quizResponse) => {
            setQuizData(quizResponse);
          })
          .catch((error) => {
            CustomSnackBar.showSnackbar('Lỗi khi lấy chi tiết bài kiểm tra', 'error');
            console.error('Failed to fetch quiz:', error);
          })
          .finally(() => {
            setIsLoadingQuiz(false);
          });
      }
    } else {
      setQuizData(null);
    }
  }, [userQuizProgress, open, quizUsecase]);

  const handleChange = <K extends keyof UpdateUserQuizRequest>(field: K, value: UpdateUserQuizRequest[K]) => {
    setFormData((prev) => new UpdateUserQuizRequest({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v);
      if (!allValid) {
        CustomSnackBar.showSnackbar('Một số trường không hợp lệ', 'error');
        return;
      }
      onSubmit(formData);
      onClose();
    } catch (error) {
      CustomSnackBar.showSnackbar('Lỗi khi lưu dữ liệu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerSave = (answerId: string, updated: { score?: number; answerText?: string }) => {
    if (!userQuizProgress) return;

    const updatedAnswers = userQuizProgress.userAnswers.map((a) =>
      a.id === answerId || `${a.id}` === answerId
        ? { ...a, score: updated.score ?? a.score, answerText: updated.answerText ?? a.answerText }
        : a
    );

    const totalScore = updatedAnswers.reduce((sum, a) => sum + (a.score || 0), 0);
    setFormData((prev) => new UpdateUserQuizRequest({ ...prev, score: totalScore }));
  };

  const renderField = (label: string, value: string | number | undefined) => (
    <Grid item xs={12}>
      <Typography variant="body2" fontWeight={500}>
        {t(label)}:
      </Typography>
      <Typography variant="body2">{value ?? '-'}</Typography>
    </Grid>
  );

  const renderUserAnswers = () => {
    if (isLoadingQuiz) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (!userQuizProgress?.userAnswers || userQuizProgress.userAnswers.length === 0) {
      return <Typography variant="body2">{t('noAnswersAvailable')}</Typography>;
    }

    if (!quizData) {
      return <Typography variant="body2">{t('quizDataNotAvailable')}</Typography>;
    }

    return (
      <Box sx={{ mb: 2, ml: 0 }}>
        {/* <CardHeader title={t('userAnswers')} sx={{ pl: 2, pb: 1, mb: 2 }} /> */}
        {userQuizProgress.userAnswers.map((answer, index) => {
          const answerId = answer.id ?? `${index}`;
          const question = quizData.quizQuestions?.find((q) => q.questionID === answer.questionID)?.question;

          return (
            <Card
              key={answerId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={question?.questionText ?? `${t('answer')} ${index + 1}`}
                titleTypographyProps={{
                  color: answer.isCorrect ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-error-main)',
                }}
                subheader={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {t('selectedAnswers')}:
                    </Typography>
                    <Typography variant="body2">{answer.selectedAnswers.length}</Typography>

                    <Typography variant="body2" fontWeight={500}>
                      {t('answerText')}:
                    </Typography>
                    <Typography variant="body2">{answer.answerText}</Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {t('answeredAt')}: {answer.answeredAt?.toISOString() ?? ''}
                    </Typography>
                  </Box>
                }
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">
                      {t('score')}: {answer.score ?? 0}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setSelectedAnswer({ ...answer, index });
                        setAnswerDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                }
                sx={{ py: 1 }}
              />
            </Card>
          );
        })}
      </Box>
    );
  };

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  if (!userQuizProgress) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
          <Typography variant="h6" component="div">
            {t('updateUserQuizScore')}
          </Typography>
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
          <Typography variant="body2" mb={2}>
            {t('id')}: {userQuizProgress?.id}
          </Typography>
          {renderUserAnswers()}
        </DialogContent>
        {/* <DialogActions>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : t('save')}
            </Button>
          </Box>
        </DialogActions> */}
      </Dialog>
      {selectedAnswer && (
        <AnswerDetailDialog
          open={answerDialogOpen}
          answer={selectedAnswer}
          questionId={selectedAnswer.questionID}
          onClose={() => setAnswerDialogOpen(false)}
          onSaved={() => setAnswerDialogOpen(false)}
        />
      )}
    </>
  );
}
