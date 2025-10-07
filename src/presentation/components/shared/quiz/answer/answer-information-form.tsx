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

import ImagePreviewDialog from '../../file/image-preview-dialog';

interface AnswerInformationFormProps {
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
            {renderField('answerText', answer.answerText)}
            {renderField('isCorrect', answer.isCorrect ? t('yes') : t('no'))}
            {renderField('questionId', answer.questionID)}
            {renderField('categoryId', answer.categoryID)}
            {renderField('thumbnailId', answer.thumbnailID)}
            {renderField('categoryName', answer.category?.categoryName)}
          </Grid>
        </CardContent>
      </Card>

      {previewImage ? (
        <ImagePreviewDialog
          open
          onClose={() => {
            setPreviewImage(null);
          }}
          imageUrl={previewImage}
          title={t('imagePreview')}
          fullscreen={fullScreen}
          onToggleFullscreen={undefined}
        />
      ) : null}
    </Box>
  );
}

export default function AnswerInformationForm({ open, answerId, onClose }: AnswerInformationFormProps) {
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
