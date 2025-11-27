'use client';

import React, { useEffect, useState } from 'react';
import { type AnswerDetailResponse } from '@/domain/models/answer/response/answer-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

interface AnswerDetailsProps {
  open: boolean;
  answerId: string | null;
  onClose: () => void;
}

function AnswerDetailContent({ answer, fullScreen }: { answer: AnswerDetailResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  return (
    <Box sx={{ p: fullScreen ? 2 : 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={answer.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {answer.answerText?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{answer.answerText ?? ''}</Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('answerInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', answer.id)}
            {renderField('title', answer.answerText)}
            {renderField('isCorrect', answer.isCorrect ? t('yes') : t('no'))}
            {renderField('id', answer.questionID)}
            {renderField('id', answer.categoryID)}
            {renderField('id', answer.thumbnailID)}
            {renderField('questionBank', answer.category?.categoryName)}
          </Grid>
        </CardContent>
      </Card>

      {answer.question ? (
        <Card sx={{ mb: 2 }}>
          <CardHeader title={t('questionInformation')} />
          <CardContent>
            <Grid container spacing={2}>
              {renderField('questionID', answer.question.id)}
              {renderField('questionText', answer.question.questionText)}
              {renderField(
                'questionType',
                answer.question.questionType
                  ? t(answer.question.questionType.charAt(0).toLowerCase() + t(answer.question.questionType).slice(1))
                  : ''
              )}
              {renderField('point', answer.question.point)}
              {renderField('canShuffle', answer.question.canShuffle ? t('yes') : t('no'))}
              {renderField(
                'status',
                answer.question.status
                  ? t(answer.question.status.charAt(0).toLowerCase() + t(answer.question.status).slice(1))
                  : ''
              )}
              {renderField('id', answer.question.categoryId)}
              {renderField('id', answer.question.thumbnailId)}
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {previewImage ? (
        <ImagePreviewDialog
          open
          onClose={() => {
            setPreviewImage(null);
          }}
          imageUrl={previewImage}
          title={t('imagePreview')}
          fullscreen={fullScreen}
          onToggleFullscreen={() => {
            undefined;
          }}
        />
      ) : null}
    </Box>
  );
}

export default function AnswerDetailForm({ open, answerId, onClose }: AnswerDetailsProps) {
  const { t } = useTranslation();
  const { answerUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AnswerDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && answerId) {
      setLoading(true);
      answerUsecase
        .getAnswerById(answerId)
        .then(setAnswer)
        .catch(() => {
          setAnswer(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, answerId]);

  if (!answerId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('answerInformation')}</Typography>
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

      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !answer ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <AnswerDetailContent answer={answer} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
