'use client';

import React, { useEffect, useState } from 'react';
import { CreateQuizFromExcelRequest } from '@/domain/models/quiz/request/create-quiz-from-excel-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { Exam, Image as ImageIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';
import { QuizSingleSelect } from '@/presentation/components/shared/quiz/quiz/quiz-select';

interface QuizImportFormProps {
  disabled?: boolean;
  onSubmit: (data: CreateQuizFromExcelRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function ImportQuizDialog({ disabled = false, onSubmit, loading = false, open, onClose }: QuizImportFormProps) {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  // const [detailRows, setDetailRows] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categoryUsecase, quizUsecase } = useDI();
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<CreateQuizFromExcelRequest>(
    new CreateQuizFromExcelRequest({
      questionCategoryEnum: CategoryEnum.Question,
      answerCategoryEnum: CategoryEnum.Answer,
    })
  );
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewData, setFilePreviewData] = useState<{
    url: string;
    title?: string;
    type?: string;
  } | null>(null);

  const handleChange = <K extends keyof CreateQuizFromExcelRequest>(key: K, value: CreateQuizFromExcelRequest[K]) => {
    setForm((prev) => new CreateQuizFromExcelRequest({ ...prev, [key]: value }));
  };

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

  //   const handleFileSourceChange = (event: React.MouseEvent<HTMLElement>) => {
  //     if (file == null){
  //         CustomSnackBar.showSnackbar("File is required.", "error");
  //         return;
  //     }
  //     handleChange('excelFile', file as File);
  //       if (form.excelFile) {
  //         fileUsecase
  //           .getFileResouceById(form.excelFile)
  //           .then((file) => setPreviewUrl(file.resourceUrl || null))
  //           .catch((error) => {
  //             console.error('Error fetching thumbnail:', error);
  //             setPreviewUrl(null);
  //           });

  //     }
  //   };

  const handleFileUpload = (file: File | null) => {
    if (file === null) {
      CustomSnackBar.showSnackbar(t('fileIsRequired'), 'error');
      return;
    }

    handleChange('excelFile', file);
    // if (file) {
    //   setPreviewUrl(URL.createObjectURL(file));
    // } else {
    //   setPreviewUrl(null);
    // }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v);
      if (!allValid) {
        CustomSnackBar.showSnackbar(t('someFieldsAreInvalid'), 'error');
        return;
      }

      onSubmit(form);
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  // useEffect(() => {
  //   const updateRows = () => {
  //     // const windowHeight = window.innerHeight;
  //     // const windowWidth = window.innerWidth;
  //     // const aspectRatio = windowWidth / windowHeight;
  //     // let otherElementsHeight = 300;
  //     // if (windowHeight < 600) {
  //     //   otherElementsHeight = 250;
  //     // } else if (windowHeight > 1000) {
  //     //   otherElementsHeight = 350;
  //     // }
  //     // const rowHeight = aspectRatio > 1.5 ? 22 : 24;
  //     // const availableHeight = windowHeight - otherElementsHeight;
  //     // const calculatedRows = Math.max(3, Math.floor(availableHeight / rowHeight));
  //     // setDetailRows(fullScreen ? calculatedRows : 3);
  //   };

  //   updateRows();
  //   window.addEventListener('resize', updateRows);
  //   return () => {
  //     window.removeEventListener('resize', updateRows);
  //   };
  // }, [fullScreen]);

  useEffect(() => {
    if (!open) {
      setForm(
        new CreateQuizFromExcelRequest({
          questionCategoryEnum: CategoryEnum.Question,
          answerCategoryEnum: CategoryEnum.Answer,
          canShuffle: false,
        })
      );
    }
  }, [open]);

  const booleanOptions = [
    { value: 'true', label: 'yes' },
    { value: 'false', label: 'no' },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="subtitle1" component="div">
          {t('importQuiz')}
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
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: fullScreen ? '100%' : 'auto',
          padding: 0,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          p={2}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid
            container
            spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}
            sx={{
              flex: 1,
            }}
          >
            <Grid item xs={12}>
              <CustomTextField
                label={t('pointToPass')}
                inputMode="numeric"
                required
                value={form.scoreToPass?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : 0;
                  handleChange('scoreToPass', numericValue);
                }}
                disabled={isSubmitting}
                icon={<Exam {...iconStyle} />}
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, minuteLate: isValid }));
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={form.questionCategoryID}
                label={t('questionCategory')}
                onChange={(value) => {
                  handleChange('questionCategoryID', value);
                }}
                categoryEnum={CategoryEnum.Question}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={form.answerCategoryID}
                label={t('answerCategory')}
                onChange={(value) => {
                  handleChange('answerCategoryID', value);
                }}
                categoryEnum={CategoryEnum.Answer}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <QuizSingleSelect
                quizUsecase={quizUsecase}
                value={form.quizID}
                onChange={(value) => {
                  handleChange('quizID', value);
                }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomSelectDropDown
                label={t('canAnswersShuffle')}
                value={String(form.canShuffle)}
                onChange={(value) => {
                  handleChange('canShuffle', value === 'true');
                }}
                disabled={isSubmitting}
                options={booleanOptions}
              />
            </Grid>

            {/* upload file */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={isSubmitting}
                startIcon={<ImageIcon {...iconStyle} />}
              >
                {t('uploadFile')}
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    handleFileUpload(e.target.files?.[0] || null);
                  }}
                />
              </Button>
            </Grid>
            {form.excelFile ? (
              <Grid item spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" mb={1}>
                    {t('uploadedFiles')}
                  </Typography>

                  <Grid item>
                    <Button
                      variant="text"
                      fullWidth
                      onClick={() => {
                        handleFilePreview(
                          URL.createObjectURL(form.excelFile),
                          form.excelFile.name,
                          form.excelFile.type
                        );
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {form.excelFile.name}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                {' '}
                <Typography variant="body2" color="text.secondary">
                  {t('noFileUploadedYet')}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomButton label={t('import')} onClick={() => handleSave()} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {filePreviewData?.url ? (
        <>
          {filePreviewData.type?.includes('image') ? (
            <ImagePreviewDialog
              open={filePreviewOpen}
              onClose={() => {
                setFilePreviewOpen(false);
              }}
              imageUrl={filePreviewData.url}
              title={filePreviewData.title}
              fullscreen={fullScreen}
              onToggleFullscreen={() => {
                setFullScreen((prev) => !prev);
              }}
            />
          ) : filePreviewData.type?.includes('video') ? (
            <VideoPreviewDialog
              open={filePreviewOpen}
              onClose={() => {
                setFilePreviewOpen(false);
              }}
              videoUrl={filePreviewData.url}
              title={filePreviewData.title}
              fullscreen={fullScreen}
              onToggleFullscreen={() => {
                setFullScreen((prev) => !prev);
              }}
            />
          ) : null}
        </>
      ) : null}
    </Dialog>
  );
}
