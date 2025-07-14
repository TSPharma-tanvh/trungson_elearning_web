'use client';

import React, { useEffect, useState } from 'react';
import { CreateQuizFromExcelRequest } from '@/domain/models/quiz/request/create-quiz-from-excel-request';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { CategoryEnum, DisplayTypeEnum, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
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
import { Article, Calendar, Clock, Image as ImageIcon, Note, Tag } from '@phosphor-icons/react';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';
import { QuizSelectDialog } from '@/presentation/components/shared/quiz/quiz/quiz-select';

interface Props {
  disabled?: boolean;
  onSubmit: (data: CreateQuizFromExcelRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function ImportQuizDialog({ disabled = false, onSubmit, loading = false, open, onClose }: Props) {
  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categoryUsecase, quizUsecase } = useDI();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fieldValidations, setFieldValidations] = useState<{ [key: string]: boolean }>({});

  const [form, setForm] = useState<CreateQuizFromExcelRequest>(
    new CreateQuizFromExcelRequest({
      categoryEnum: CategoryEnum.Quiz,
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
    if (file == null) {
      CustomSnackBar.showSnackbar('File is required.', 'error');
      return;
    }

    handleChange('excelFile', file as File);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v !== false);
      if (!allValid) {
        CustomSnackBar.showSnackbar('Một số trường không hợp lệ', 'error');
        return;
      }

      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error('Error updating path:', error);
      CustomSnackBar.showSnackbar('Failed to update path', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  useEffect(() => {
    const updateRows = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const aspectRatio = windowWidth / windowHeight;

      let otherElementsHeight = 300;
      if (windowHeight < 600) {
        otherElementsHeight = 250;
      } else if (windowHeight > 1000) {
        otherElementsHeight = 350;
      }

      const rowHeight = aspectRatio > 1.5 ? 22 : 24;
      const availableHeight = windowHeight - otherElementsHeight;
      const calculatedRows = Math.max(3, Math.floor(availableHeight / rowHeight));

      setDetailRows(fullScreen ? calculatedRows : 3);
    };

    updateRows();
    window.addEventListener('resize', updateRows);
    return () => window.removeEventListener('resize', updateRows);
  }, [fullScreen]);

  useEffect(() => {
    if (!open) {
      setForm(
        new CreateQuizFromExcelRequest({
          categoryEnum: CategoryEnum.Quiz,
        })
      );
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Import Quiz
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
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Point to Pass"
                inputMode="numeric"
                required={true}
                value={form.scoreToPass?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : 0;
                  handleChange('scoreToPass', numericValue);
                }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
                onValidationChange={(isValid) => setFieldValidations((prev) => ({ ...prev, minuteLate: isValid }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={form.questionCategoryID}
                onChange={(value) => handleChange('questionCategoryID', value)}
                categoryEnum={CategoryEnum.Question}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <QuizSelectDialog
                quizUsecase={quizUsecase}
                value={form.quizID}
                onChange={(value) => handleChange('quizID', value ?? '')}
                disabled={isSubmitting}
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
                Upload File
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*,application/pdf"
                  onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                />
              </Button>
            </Grid>
            {form.excelFile ? (
              <Grid item spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" mb={1}>
                    Uploaded Files
                  </Typography>

                  <Grid item>
                    <Button
                      variant="text"
                      fullWidth
                      onClick={() =>
                        handleFilePreview(URL.createObjectURL(form.excelFile), form.excelFile.name, form.excelFile.type)
                      }
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
                  No file uploaded yet.
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomButton label="Tạo mới" onClick={() => handleSave()} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {filePreviewData?.url && (
        <>
          {filePreviewData.type?.includes('image') ? (
            <ImagePreviewDialog
              open={filePreviewOpen}
              onClose={() => setFilePreviewOpen(false)}
              imageUrl={filePreviewData.url}
              title={filePreviewData.title}
              fullscreen={fullScreen}
              onToggleFullscreen={() => setFullScreen((prev) => !prev)}
            />
          ) : filePreviewData.type?.includes('video') ? (
            <VideoPreviewDialog
              open={filePreviewOpen}
              onClose={() => setFilePreviewOpen(false)}
              videoUrl={filePreviewData.url}
              title={filePreviewData.title}
              fullscreen={fullScreen}
              onToggleFullscreen={() => setFullScreen((prev) => !prev)}
            />
          ) : null}
        </>
      )}
    </Dialog>
  );
}
