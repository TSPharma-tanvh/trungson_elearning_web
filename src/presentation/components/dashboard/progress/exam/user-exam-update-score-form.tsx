import { useEffect, useState } from 'react';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { type UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { StatusEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';
import { Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

import { AnswerDetailDialog } from '../quiz/user-answer-update-form';

interface EditUserQuizScoreDialogProps {
  open: boolean;
  data: UserQuizProgressDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserQuizRequest) => void;
}

export function UpdateUserQuizScoreFormDialog({ open, data: userQuizProgress, onClose }: EditUserQuizScoreDialogProps) {
  const { t } = useTranslation();
  const { quizUsecase, userQuizProgressUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [_formData, setFormData] = useState<UpdateUserQuizRequest>(new UpdateUserQuizRequest({}));
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<any | null>(null);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [progressDetail, setProgressDetail] = useState<UserQuizProgressDetailResponse | null>(null);

  useEffect(() => {
    if (userQuizProgress) {
      setProgressDetail(userQuizProgress);
    }
  }, [userQuizProgress]);

  useEffect(() => {
    if (progressDetail && open) {
      const newFormData = new UpdateUserQuizRequest({
        userID: progressDetail.userId ?? '',
        quizID: progressDetail.quizId ?? undefined,
        score: progressDetail.score ?? undefined,
        startedAt: progressDetail.startedAt ?? undefined,
        completedAt: progressDetail.completedAt ?? undefined,
        progressStatus:
          progressDetail.progressStatus !== undefined
            ? UserQuizProgressEnum[progressDetail.progressStatus as keyof typeof UserQuizProgressEnum]
            : undefined,
        activeStatus:
          progressDetail.activeStatus !== undefined
            ? StatusEnum[progressDetail.activeStatus as keyof typeof StatusEnum]
            : undefined,
        attempts: progressDetail.attempts ?? undefined,
      });
      setFormData(newFormData);

      if (progressDetail.quizId) {
        setIsLoadingQuiz(true);
        quizUsecase
          .getQuizById(progressDetail.quizId)
          .then((quizResponse) => {
            setQuizData(quizResponse);
          })
          .catch(() => {})
          .finally(() => {
            setIsLoadingQuiz(false);
          });
      }
    } else {
      setQuizData(null);
    }
  }, [progressDetail, open, quizUsecase]);

  const handleAnswerDialogClose = async (refresh?: boolean) => {
    setAnswerDialogOpen(false);
    setSelectedAnswer(null);

    if (refresh && progressDetail?.id) {
      try {
        const updated = await userQuizProgressUsecase.getUserQuizProgressById(progressDetail.id);
        setProgressDetail(updated);
      } catch {
        CustomSnackBar.showSnackbar(t('failedToRefreshProgress'), 'error');
      }
    }
  };

  const renderUserAnswers = () => {
    if (isLoadingQuiz) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (!progressDetail?.userAnswers || progressDetail.userAnswers.length === 0) {
      return <Typography variant="body2">{t('noAnswersAvailable')}</Typography>;
    }

    if (!quizData) {
      return <Typography variant="body2">{t('quizDataNotAvailable')}</Typography>;
    }

    return (
      <Box sx={{ mb: 2, ml: 0 }}>
        {progressDetail.userAnswers.map((answer, index) => {
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

  if (!progressDetail) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
          <Typography variant="h6" component="div">
            {t('updateUserQuizScore')}
          </Typography>
          <Box>
            <IconButton
              onClick={() => {
                setFullScreen((prev) => !prev);
              }}
            >
              {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" mb={2}>
            {t('id')}: {progressDetail.id}
          </Typography>
          {renderUserAnswers()}
        </DialogContent>
      </Dialog>

      {selectedAnswer ? (
        <AnswerDetailDialog
          open={answerDialogOpen}
          answer={selectedAnswer}
          questionId={selectedAnswer.questionID}
          onClose={() => handleAnswerDialogClose(true)}
          onSaved={() => handleAnswerDialogClose(true)}
        />
      ) : null}
    </>
  );
}
