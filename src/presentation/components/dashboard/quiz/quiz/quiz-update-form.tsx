'use client';

import React, { useEffect, useState } from 'react';
import { UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import { FileTypeEnum } from '@/utils/enum/file-resource-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Clock, Image, NumberCircleNine, NumberCircleSix } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { QuestionCategorySelect } from '@/presentation/components/shared/category/question-category-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';

interface UpdateQuizForLessonProps {
  quiz?: QuizResponse | null;
  disabled?: boolean;
  onSubmit: (data: UpdateQuizRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function UpdateQuizForLessonDialog({
  quiz,
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: UpdateQuizForLessonProps) {
  const { t } = useTranslation();
  const { categoryUsecase, fileUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, _setDetailRows] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<UpdateQuizRequest>(new UpdateQuizRequest({}));
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = <K extends keyof UpdateQuizRequest>(key: K, value: UpdateQuizRequest[K]) => {
    setForm((prev) => new UpdateQuizRequest({ ...prev, [key]: value }));
  };

  const handleFileSelectChange = async (id: string) => {
    const newId = id === '' ? undefined : id;

    handleChange('thumbnailID', newId);
    if (id) {
      try {
        const file = await fileUsecase.getFileResourceById(id);
        setPreviewUrl(file.resourceUrl || null);
      } catch {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileUpload = (file: File | null) => {
    setThumbnailFile(file);
    handleChange('thumbnail', file ?? undefined);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleThumbnailSourceChange = (_: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select' | null) => {
    if (!newSource) return;
    setThumbnailSource(newSource);

    if (newSource === 'upload') {
      setPreviewUrl(thumbnailFile ? URL.createObjectURL(thumbnailFile) : null);
    } else if (form.thumbnailID) {
      fileUsecase
        .getFileResourceById(form.thumbnailID)
        .then((f) => {
          setPreviewUrl(f.resourceUrl || null);
        })
        .catch(() => {
          setPreviewUrl(null);
        });
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (thumbnailSource === 'upload') {
        form.thumbnailID = undefined;
      } else {
        form.thumbnail = undefined;
      }

      if (!form.id) {
        CustomSnackBar.showSnackbar(t('quizIdMissing'), 'error');
        return;
      }

      onSubmit(form);
      onClose();
    } catch (error) {
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconStyle = { size: 20, weight: 'fill' as const, color: '#616161' };

  // Initialize form from quiz response
  useEffect(() => {
    if (open && quiz) {
      const updated = new UpdateQuizRequest({
        id: quiz.id!,
        title: quiz.title,
        description: quiz.description,
        isRequired: quiz.isRequired ?? true,
        displayedQuestionCount: quiz.displayedQuestionCount,
        time: quiz.time,
        scoreToPass: quiz.scoreToPass,
        type: quiz.type ? (quiz.type === 'ExamQuiz' ? QuizTypeEnum.ExamQuiz : QuizTypeEnum.LessonQuiz) : undefined,
        categoryID: quiz.categoryID,
        questionCategoryIDs:
          quiz.quizQuestions.length > 0
            ? Array.from(
                new Set(quiz.quizQuestions.map((q) => q.categoryID).filter((id): id is string => Boolean(id)))
              ).join(',')
            : undefined,
        thumbnailID: quiz.thumbnailID,
        // thumbDocumentNo: quiz.thumbnail?.documentNo,
        // thumbPrefixName: quiz.thumbnail?.prefixName,
        isDeleteOldThumbnail: false,
        canShuffle: quiz.canShuffle,
        canStartOver: quiz.canStartOver,
      });

      setForm(updated);

      // Set initial thumbnail preview
      if (quiz.thumbnailID) {
        setThumbnailSource('select');
        fileUsecase
          .getFileResourceById(quiz.thumbnailID)
          .then((f) => {
            setPreviewUrl(f.resourceUrl || null);
          })
          .catch(() => {
            setPreviewUrl(null);
          });
      } else if (quiz.thumbnail?.resourceUrl) {
        setThumbnailSource('select');
        setPreviewUrl(quiz.thumbnail.resourceUrl);
      }
    }
  }, [open, quiz, fileUsecase]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setForm(new UpdateQuizRequest({}));
      setThumbnailFile(null);
      setThumbnailSource('select');
      setPreviewUrl(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('updateQuiz')}</Typography>
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

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: fullScreen ? '100%' : 'auto' }}>
        <Box component="form" p={2} sx={{ flex: 1, overflowY: 'auto' }}>
          <Grid container spacing={fullScreen ? (window.innerWidth < 600 ? 1 : 3) : 4}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('generalInfo')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('title')}
                value={form.title || ''}
                onChange={(v) => {
                  handleChange('title', v);
                }}
                disabled={isSubmitting}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('description')}
                value={form.description || ''}
                onChange={(v) => {
                  handleChange('description', v);
                }}
                disabled={isSubmitting}
                multiline
                rows={detailRows}
              />
            </Grid>

            <Grid item xs={12}>
              <QuestionCategorySelect
                categoryUsecase={categoryUsecase}
                value={form.questionCategoryIDs}
                label={t('questionBank')}
                onChange={(v) => {
                  handleChange('questionCategoryIDs', v);
                }}
                categoryEnum={CategoryEnum.Question}
                required
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('quizSettings')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isRequired')}
                value={form.isRequired ?? true}
                onChange={(v) => {
                  handleChange('isRequired', v);
                }}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('canShuffle')}
                value={form.canShuffle ?? true}
                onChange={(v) => {
                  handleChange('canShuffle', v);
                }}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('displayedQuestionCount')}
                value={form.displayedQuestionCount?.toString() ?? ''}
                onChange={(v) => {
                  handleChange('displayedQuestionCount', v ? Number(v) : undefined);
                }}
                inputMode="numeric"
                disabled={isSubmitting}
                icon={<NumberCircleSix {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('time')}
                value={form.time || ''}
                onChange={(v) => {
                  handleChange('time', v);
                }}
                disabled={isSubmitting}
                pattern="^[0-2]?[0-9]:[0-5][0-9]:[0-5][0-9]$"
                patternError="HH:mm:ss"
                required
                icon={<Clock {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('scoreToPass')}
                value={form.scoreToPass?.toString() ?? ''}
                onChange={(v) => {
                  handleChange('scoreToPass', v ? Number(v) : undefined);
                }}
                inputMode="numeric"
                disabled={isSubmitting}
                required
                icon={<NumberCircleNine {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CategorySelect
                label={t('quizCategory')}
                categoryUsecase={categoryUsecase}
                value={form.categoryID}
                onChange={(v) => {
                  handleChange('categoryID', v);
                }}
                categoryEnum={CategoryEnum.Quiz}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Thumbnail */}
            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>
                {t('uploadThumbnail')}
              </Typography>
              <ToggleButtonGroup
                value={thumbnailSource}
                exclusive
                onChange={handleThumbnailSourceChange}
                fullWidth
                disabled={isSubmitting}
                sx={{ mb: 2 }}
              >
                <ToggleButton value="select">{t('selectFromResources')}</ToggleButton>
                <ToggleButton value="upload">{t('uploadFile')}</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12}>
              {thumbnailSource === 'select' ? (
                <FileResourceSelect
                  fileUsecase={fileUsecase}
                  type={FileTypeEnum.Image}
                  status={StatusEnum.Enable}
                  value={form.thumbnailID || ''}
                  onChange={handleFileSelectChange}
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailDocumentNo')}
                      value={form.thumbDocumentNo || ''}
                      onChange={(v) => {
                        handleChange('thumbDocumentNo', v);
                      }}
                      disabled={isSubmitting}
                      icon={<Image {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailPrefixName')}
                      value={form.thumbPrefixName || ''}
                      onChange={(v) => {
                        handleChange('thumbPrefixName', v);
                      }}
                      disabled={isSubmitting}
                      icon={<Image {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      disabled={isSubmitting}
                      startIcon={<Image {...iconStyle} />}
                    >
                      {t('uploadThumbnail')}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          handleFileUpload(e.target.files?.[0] || null);
                        }}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(form.isDeleteOldThumbnail)}
                          onChange={(e) => {
                            handleChange('isDeleteOldThumbnail', e.target.checked);
                          }}
                          disabled={isSubmitting}
                        />
                      }
                      label={t('deleteOldThumbnail')}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>

            {previewUrl ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: fullScreen ? 400 : 250,
                    height: fullScreen ? 400 : 250,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    overflow: 'hidden',
                    mx: 'auto',
                    mt: 2,
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Thumbnail preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
            ) : null}

            <Grid item xs={12}>
              <CustomButton
                label={t('update')}
                onClick={handleSave}
                loading={loading || isSubmitting}
                disabled={disabled || isSubmitting}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
