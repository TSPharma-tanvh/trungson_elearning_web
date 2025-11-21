'use client';

import React, { useEffect, useState } from 'react';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { type UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { type QuestionResponse } from '@/domain/models/question/response/question-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Edit, ExpandMore, InfoOutlined } from '@mui/icons-material';
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
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

import QuestionDetailForm from '../question/question-detail';
import { UpdateQuestionFormDialog } from '../question/question-update-form';

interface CategoryDetailFormProps {
  open: boolean;
  categoryId: string | null;
  onClose: () => void;
}

function QuestionCategoryDetails({
  category,
  fullScreen,
  onReload,
}: {
  category: CategoryDetailResponse;
  fullScreen: boolean;
  onReload: () => void;
}) {
  const { t } = useTranslation();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [openQuestionDetailId, setOpenQuestionDetailId] = useState<string | null>(null);
  const [openEditQuestionId, setOpenEditQuestionId] = useState<string | null>(null);
  const [editData, setEditData] = useState<QuestionResponse | null>(null);
  const { questionUsecase } = useDI();

  const handleEditQuestion = async (id: string) => {
    try {
      const res = await questionUsecase.getQuestionById(id);
      setEditData(res);
      setOpenEditQuestionId(id);
    } catch {
      return null;
    }
  };

  const handleEditQuestionRequest = async (request: UpdateQuestionRequest) => {
    try {
      await questionUsecase.updateQuestion(request);
      return true;
    } catch {
      return false;
    }
  };

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderQuestions = () => {
    const lessons = category.questions;
    if (!lessons || lessons.length === 0) return null;

    const toggleExpanded = (courseId: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [courseId]: !prev[courseId],
      }));
    };

    const handleViewLessonDetail = (lessonId: string) => {
      setOpenQuestionDetailId(lessonId);
    };

    return (
      <Box sx={{ mb: 2 }}>
        <CardHeader title={t('questionDetail')} sx={{ pl: 2, pb: 1, mb: 2 }} />
        {lessons.map((question, index) => {
          const lessonId = question.id ?? `${t('question')}-${index}`;
          const isExpanded = expandedItems[lessonId] || false;

          return (
            <Card
              key={lessonId}
              sx={{
                mb: 3,
                mx: window.innerWidth < 600 ? 1 : 2,
              }}
            >
              <CardHeader
                title={question?.questionText ?? `${t('question')} ${index + 1}`}
                titleTypographyProps={{
                  sx: {
                    fontSize: 18,
                    // color: courseEnroll.isCorrect ? theme.palette.primary.light : theme.palette.error.main,
                  },
                }}
                action={
                  <Box>
                    <IconButton
                      onClick={async () => {
                        await handleEditQuestion(question?.id ?? '');
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        handleViewLessonDetail(question?.id ?? '');
                      }}
                    >
                      <InfoOutlined />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        toggleExpanded(lessonId);
                      }}
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Box>
                }
                sx={{ py: 1 }}
              />
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Grid container spacing={2}>
                    {renderField('id', question.id)}
                    {renderField('questionText', question.questionText)}
                    {renderField('canShuffle', question.canShuffle ? t('yes') : t('no'))}
                    {renderField('point', question.point)}
                  </Grid>
                </CardContent>
              </Collapse>

              <QuestionDetailForm
                open={openQuestionDetailId === question?.id}
                questionId={question?.id ?? ''}
                onClose={() => {
                  setOpenQuestionDetailId(null);
                }}
              />

              <UpdateQuestionFormDialog
                open={openEditQuestionId === question?.id}
                data={editData}
                onClose={() => {
                  setOpenEditQuestionId(null);
                  setEditData(null);
                }}
                onSubmit={async (updated) => {
                  const ok = await handleEditQuestionRequest(updated);
                  if (ok) {
                    onReload();
                  }

                  setOpenEditQuestionId(null);
                  setEditData(null);
                }}
              />
            </Card>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={category.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {category.categoryName?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{category.categoryName ?? ''}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', category.id)}
            {renderField('name', category.categoryName)}
            {renderField('detail', category.description)}
            {renderField('question', category.questions.length)}
            {renderField('totalScore', category.totalScore)}
          </Grid>
        </CardContent>
      </Card>
      {renderQuestions()}
    </Box>
  );
}

export default function CategoryDetailForm({ open, categoryId, onClose }: CategoryDetailFormProps) {
  const { t } = useTranslation();

  const { categoryUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<CategoryDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && categoryId && categoryUsecase) {
      setLoading(true);
      categoryUsecase
        .getCategoryById(categoryId)
        .then(setCategory)
        .catch(() => {
          setCategory(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, categoryId, categoryUsecase]);

  const reloadCategory = async () => {
    if (!categoryId) return;
    setLoading(true);
    await categoryUsecase
      .getCategoryById(categoryId)
      .then(setCategory)
      .finally(() => {
        setLoading(false);
      });
  };

  if (!categoryId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('questionBankDetail')}
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

      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !category ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <QuestionCategoryDetails category={category} fullScreen={fullScreen} onReload={reloadCategory} />
        )}
      </DialogContent>
    </Dialog>
  );
}
