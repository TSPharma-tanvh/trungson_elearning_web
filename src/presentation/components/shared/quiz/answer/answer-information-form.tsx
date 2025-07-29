'use client';

import React, { useEffect, useState } from 'react';
import { type AnswerDetailResponse } from '@/domain/models/answer/response/answer-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

import ImagePreviewDialog from '../../file/image-preview-dialog';

interface AnswerInformationFormProps {
  open: boolean;
  answerId: string | null;
  onClose: () => void;
}

function AnswerDetailContent({ answer, fullScreen }: { answer: AnswerDetailResponse; fullScreen: boolean }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
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
        <Typography variant="h5">{answer.answerText ?? 'Unnamed Answer'}</Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardHeader title="Answer Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', answer.id)}
            {renderField('Answer Text', answer.answerText)}
            {renderField('Is Correct', answer.isCorrect ? 'Yes' : 'No')}
            {renderField('Question ID', answer.questionID)}
            {renderField('Category ID', answer.categoryID)}
            {renderField('Thumbnail ID', answer.thumbnailID)}
            {renderField('Category Name', answer.category?.categoryName)}
          </Grid>
        </CardContent>
      </Card>

      {answer.userAnswerAnswersRelations.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <CardHeader title="User Answer Relations" sx={{ pl: 1, pb: 1 }} />
          {answer.userAnswerAnswersRelations.map((rel, index) => {
            const relId = `${rel.answerID}-${rel.userAnswerID}`;
            const isExpanded = expanded[relId] || false;

            return (
              <Card key={relId} sx={{ mb: 2 }}>
                <CardHeader
                  title={`Relation ${index + 1}`}
                  action={
                    <IconButton
                      onClick={() => {
                        toggleExpand(relId);
                      }}
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  }
                  sx={{ py: 1 }}
                />
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Grid container spacing={2}>
                      {renderField('Answer ID', rel.answerID)}
                      {renderField('User Answer ID', rel.userAnswerID)}
                      {renderField('User ID', rel.userAnswer?.userID)}
                      {renderField('Quiz ID', rel.userAnswer?.quizID)}
                      {renderField('Question ID', rel.userAnswer?.questionID)}
                      {renderField('User Quiz Progress ID', rel.userAnswer?.userQuizProgressID)}
                    </Grid>
                  </CardContent>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      )}

      {previewImage ? (
        <ImagePreviewDialog
          open
          onClose={() => {
            setPreviewImage(null);
          }}
          imageUrl={previewImage}
          title="Image Preview"
          fullscreen={fullScreen}
          onToggleFullscreen={undefined}
        />
      ) : null}
    </Box>
  );
}

export default function AnswerInformationForm({ open, answerId, onClose }: AnswerInformationFormProps) {
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
        <Typography variant="h6">Answer Information</Typography>
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
