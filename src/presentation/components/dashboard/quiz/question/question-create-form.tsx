'use client';

import React, { useEffect, useState } from 'react';
import { CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, QuestionEnum, StatusEnum } from '@/utils/enum/core-enum';
import { FileResourceEnum } from '@/utils/enum/file-resource-enum';
import { Image } from '@mui/icons-material';
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
import { Clock } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import { AnswerMultiSelectDialog } from '@/presentation/components/shared/quiz/answer/answer-multi-select';

interface QuestionCreateFormProps {
  disabled?: boolean;
  onSubmit: (data: CreateQuestionRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function QuestionCreateForm({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: QuestionCreateFormProps) {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  const { categoryUsecase, fileUsecase, answerUsecase } = useDI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');
  const [fileSelectSource, setFileSelectSource] = useState<'multi-select' | 'upload'>('multi-select');
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [form, setForm] = useState<CreateQuestionRequest>(
    new CreateQuestionRequest({
      questionText: '',
      questionType: QuestionEnum.SingleChoice,
      canShuffle: false,
      status: StatusEnum.Enable,
      categoryEnum: CategoryEnum.Question,
    })
  );

  const handleChange = <K extends keyof CreateQuestionRequest>(key: K, value: CreateQuestionRequest[K]) => {
    setForm((prev) => new CreateQuestionRequest({ ...prev, [key]: value }));
  };

  // useEffect(() => {
  //   const updateRows = () => {
  //     const windowHeight = window.innerHeight;
  //     const windowWidth = window.innerWidth;
  //     const aspectRatio = windowWidth / windowHeight;

  //     let otherElementsHeight = 300;
  //     if (windowHeight < 600) {
  //       otherElementsHeight = 250;
  //     } else if (windowHeight > 1000) {
  //       otherElementsHeight = 350;
  //     }

  //     const rowHeight = aspectRatio > 1.5 ? 22 : 24;
  //     const availableHeight = windowHeight - otherElementsHeight;
  //     const calculatedRows = Math.max(3, Math.floor(availableHeight / rowHeight));

  //   };

  //   updateRows();
  //   window.addEventListener('resize', updateRows);
  //   return () => {
  //     window.removeEventListener('resize', updateRows);
  //   };
  // }, [fullScreen]);

  const handleThumbnailSourceChange = (event: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (newSource) {
      setThumbnailSource(newSource);
      if (newSource === 'upload') {
        setPreviewUrl(form.thumbnail ? URL.createObjectURL(form.thumbnail) : null);
      } else {
        handleChange('thumbnail', undefined);
        if (form.thumbnailID) {
          fileUsecase
            .getFileResouceById(form.thumbnailID)
            .then((file) => {
              setPreviewUrl(file.resourceUrl || null);
            })
            .catch(() => {
              setPreviewUrl(null);
            });
        } else {
          setPreviewUrl(null);
        }
      }
    }
  };

  const handleFileUpload = (file: File | null) => {
    handleChange('thumbnail', file ?? undefined);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleMultipleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
    handleChange('resources', files);
  };

  // const handleFilePreview = (url: string, title?: string, type?: string) => {
  //   setFilePreviewData({ url, title, type });
  //   setFilePreviewOpen(true);
  // };

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

  useEffect(() => {
    if (!open) {
      setUploadedFiles([]);
    }
  }, [open]);

  const booleanOptions = [
    { value: 'true', label: 'yes' },
    { value: 'false', label: 'no' },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('createQuestion')}
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
                label={t('title')}
                value={form.questionText}
                onChange={(val) => {
                  handleChange('questionText', val);
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('point')}
                required
                value={form.point?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('point', numericValue);
                }}
                disabled={isSubmitting}
                inputMode="numeric"
                icon={<Clock />}
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, point: isValid }));
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={form.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Question}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<QuestionEnum>
                label={t('questionType')}
                value={form.questionType ?? ''}
                onChange={(val) => {
                  handleChange('questionType', val);
                }}
                disabled={disabled}
                options={[
                  { value: QuestionEnum.SingleChoice, label: 'singleChoice' },
                  { value: QuestionEnum.MultipleChoice, label: 'multipleChoice' },
                  { value: QuestionEnum.ShortAnswer, label: 'shortAnswer' },
                  { value: QuestionEnum.LongAnswer, label: 'longAnswer' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<StatusEnum>
                label={t('status')}
                value={form.status!}
                onChange={(val) => {
                  handleChange('status', val);
                }}
                disabled={disabled}
                options={[
                  { value: StatusEnum.Enable, label: 'enable' },
                  { value: StatusEnum.Disable, label: 'disable' },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <AnswerMultiSelectDialog
                answerUsecase={answerUsecase}
                value={form.answerIDs ? form.answerIDs.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => {
                  handleChange('answerIDs', value.join(','));
                }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('canShuffle')}
                value={String(form.canShuffle ?? '')}
                onChange={(value) => {
                  handleChange('canShuffle', value === 'true');
                }}
                disabled={isSubmitting}
                options={booleanOptions}
              />
            </Grid>
            {/* Upload file resources */}

            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>
                {t('uploadFiles')}
              </Typography>
              <ToggleButtonGroup
                value={fileSelectSource}
                exclusive
                onChange={(e, newValue: 'upload' | 'multi-select') => {
                  if (newValue) setFileSelectSource(newValue);
                }}
                aria-label={t('uploadFiles')}
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="multi-select"> {t('selectFromResources')}</ToggleButton>
                <ToggleButton value="upload"> {t('uploadFiles')}</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {fileSelectSource === 'multi-select' ? (
              <Grid item xs={12}>
                <FileResourceMultiSelect
                  fileUsecase={fileUsecase}
                  type={FileResourceEnum.Image}
                  value={form.resourceIDs?.split(',').filter(Boolean) ?? []}
                  onChange={(ids) => {
                    handleChange('resourceIDs', ids.join(','));
                  }}
                  label={t('selectFiles')}
                  disabled={false}
                  showTypeSwitcher
                  allowAllTypes
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth disabled={isSubmitting} startIcon={<Image />}>
                  {t('uploadFiles')}
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      handleMultipleFileUpload(files);
                    }}
                  />
                </Button>
              </Grid>
            )}

            {uploadedFiles.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  {t('uploadedFiles')}
                </Typography>
                <Grid container spacing={1} direction="column">
                  {uploadedFiles.map((file, index) => (
                    <Grid item key={index}>
                      <Button
                        variant="text"
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {file.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Thumbnail */}

            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>
                {t('uploadThumbnail')}
              </Typography>
              <ToggleButtonGroup
                value={thumbnailSource}
                exclusive
                onChange={handleThumbnailSourceChange}
                aria-label={t('uploadThumbnail')}
                fullWidth
                disabled={isSubmitting}
                sx={{ mb: 2 }}
              >
                <ToggleButton value="select" aria-label="select from resources">
                  {t('selectFromResources')}
                </ToggleButton>
                <ToggleButton value="upload" aria-label="upload file">
                  {t('uploadFile')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} sm={12}>
              {thumbnailSource === 'select' ? (
                <FileResourceSelect
                  fileUsecase={fileUsecase}
                  type={FileResourceEnum.Image}
                  status={StatusEnum.Enable}
                  value={form.thumbnailID}
                  onChange={(ids) => {
                    handleChange('thumbnailID', ids);
                  }}
                  label={t('thumbnail')}
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailDocumentNo')}
                      value={form.thumbDocumentNo}
                      onChange={(value) => {
                        handleChange('thumbDocumentNo', value);
                      }}
                      disabled={isSubmitting}
                      icon={<Image />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailPrefixName')}
                      value={form.thumbPrefixName}
                      onChange={(value) => {
                        handleChange('thumbPrefixName', value);
                      }}
                      disabled={isSubmitting}
                      icon={<Image />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" component="label" fullWidth disabled={isSubmitting}>
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
                  {/* <Grid item xs={12}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={!!form.isRequired}
                                      onChange={(e) => handleChange('isRequired', e.target.checked)}
                                      disabled={isSubmitting}
                                    />
                                  }
                                  label="Is Required"
                                />
                              </Grid> */}
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
                  {previewUrl ? (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          width: fullScreen ? 400 : 200,
                          height: fullScreen ? 400 : 200,
                          borderRadius: 1,
                          border: '1px solid #ccc',
                          overflow: 'hidden',
                          mt: 2,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mx: 'auto',
                        }}
                      >
                        <img
                          src={previewUrl}
                          alt={t('thumbnailPreview')}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    </Grid>
                  ) : null}
                </Grid>
              )}
            </Grid>

            <Grid item xs={12}>
              <CustomButton label={t('create')} onClick={handleSave} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
