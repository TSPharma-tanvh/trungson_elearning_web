'use client';

import React, { useEffect, useState } from 'react';
import { CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
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
import { Clock, Image, NumberCircleFive, NumberCircleNine, NumberCircleSix } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomEmployeeDistinctSelectInForm } from '@/presentation/components/core/drop-down/custom-employee-distinct-select-in-form';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { QuestionCategorySelect } from '@/presentation/components/shared/category/question-category-select';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';

interface CreateExamProps {
  disabled?: boolean;
  onSubmit: (data: CreateQuizRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateExamDialog({ disabled = false, onSubmit, loading = false, open, onClose }: CreateExamProps) {
  const { t } = useTranslation();
  const { categoryUsecase, fileUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidations, _setFieldValidations] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<CreateQuizRequest>(new CreateQuizRequest({}));

  //files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [_filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [_filePreviewData, setFilePreviewData] = useState<{
    url: string;
    title?: string;
    type?: string;
  } | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedResourceIDs, setSelectedResourceIDs] = useState<string[]>([]);
  const [fileSelectSource, setFileSelectSource] = useState<'multi-select' | 'upload'>('multi-select');
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = <K extends keyof CreateQuizRequest>(key: K, value: CreateQuizRequest[K]) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      return new CreateQuizRequest(updated);
    });
  };

  const handleFileSelectChange = async (id: string) => {
    const newId = id === '' ? undefined : id;

    handleChange('thumbnailID', newId);
    if (id) {
      try {
        const file = await fileUsecase.getFileResourceById(id);
        setPreviewUrl(file.resourceUrl || null);
        if (thumbnailSource === 'select') {
          setPreviewUrl(file.resourceUrl || null);
        }
      } catch {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
      if (thumbnailSource === 'select') {
        setPreviewUrl(null);
      }
    }
  };

  const handleFileUpload = (file: File | null) => {
    setThumbnailFile(file);
    handleChange('thumbnail', file ?? undefined);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  // const handleExcelUpload = (file: File | null) => {
  //   if (file === null) {
  //     CustomSnackBar.showSnackbar(t('fileIsRequired'), 'error');
  //     return;
  //   }

  //   handleChange('excelFile', file);
  // };

  // const handleMultipleFileUpload = (files: File[]) => {
  //   setUploadedFiles(files);
  // };

  // const handleFilePreview = (url: string, title?: string, type?: string) => {
  //   setFilePreviewData({ url, title, type });
  //   setFilePreviewOpen(true);
  // };

  const handleThumbnailSourceChange = async (_: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (!newSource) return;
    setThumbnailSource(newSource);

    if (newSource === 'upload') {
      // file
      if (thumbnailFile) {
        setPreviewUrl(URL.createObjectURL(thumbnailFile));
      } else {
        setPreviewUrl(null);
      }
    } else {
      // thumbnail id
      if (form.thumbnailID) {
        try {
          const file = await fileUsecase.getFileResourceById(form.thumbnailID);
          setPreviewUrl(file.resourceUrl || null);
        } catch {
          setPreviewUrl(null);
        }
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v);
      if (!allValid) {
        CustomSnackBar.showSnackbar(t('someFieldsAreInvalid'), 'error');
        return;
      }

      if (thumbnailSource === 'upload') {
        form.thumbnailID = undefined;
      } else {
        form.thumbnail = undefined;
      }

      if (fileSelectSource === 'upload') {
        form.resourceIDs = undefined;
        form.resources = uploadedFiles;
      } else {
        form.resources = undefined;
        form.resourceIDs = selectedResourceIDs.join(',');
      }
      onSubmit(new CreateQuizRequest({ ...form }));
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
    return () => {
      window.removeEventListener('resize', updateRows);
    };
  }, [fullScreen]);

  useEffect(() => {
    if (!open) {
      setForm(
        new CreateQuizRequest({
          title: '',
          description: '',
          isRequired: true,
          hasLesson: false,
          maxAttempts: 5,
          status: StatusEnum.Enable,
          type: QuizTypeEnum.ExamQuiz,
          categoryEnum: CategoryEnum.Quiz,
          // questionCategoryEnum: CategoryEnum.Question,
          // answerCategoryEnum: CategoryEnum.Answer,
          canShuffle: false,
          canStartOver: true,
        })
      );
      setThumbnailSource('select');
      setThumbnailFile(null);
      setUploadedFiles([]);
      setFilePreviewOpen(false);
      setFilePreviewData(null);
      setSelectedResourceIDs([]);
      setFileSelectSource('multi-select');
      setPreviewUrl('');
    }
  }, [open]);

  // const booleanOptions = [
  //   { value: 'true', label: 'yes' },
  //   { value: 'false', label: 'no' },
  // ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('createExam')}
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
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('generalInfo')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('title')}
                value={form.title}
                onChange={(val) => {
                  handleChange('title', val);
                }}
                disabled={disabled}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('description')}
                value={form.description}
                onChange={(val) => {
                  handleChange('description', val);
                }}
                disabled={disabled}
                multiline
                rows={detailRows}
                sx={{
                  '& .MuiInputBase-root': {
                    height: fullScreen ? '100%' : 'auto',
                  },
                }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<StatusEnum>
                label={t('status')}
                value={form.status}
                onChange={(val) => {
                  handleChange('status', val);
                }}
                disabled={disabled}
                options={[
                  { value: StatusEnum.Enable, label: 'enable' },
                  { value: StatusEnum.Disable, label: 'disable' },
                ]}
              />
            </Grid> */}

            <Grid item xs={12}>
              <QuestionCategorySelect
                categoryUsecase={categoryUsecase}
                value={form.questionCategoryIDs}
                label={t('questionBank')}
                onChange={(value) => {
                  handleChange('questionCategoryIDs', value);
                }}
                categoryEnum={CategoryEnum.Question}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('examSettings')}
              </Typography>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<QuizTypeEnum>
                label={t('quizType')}
                value={form.type}
                onChange={(val) => {
                  handleChange('type', val);
                }}
                disabled={disabled}
                options={[
                  { value: QuizTypeEnum.LessonQuiz, label: 'lessonQuiz' },
                  { value: QuizTypeEnum.ExamQuiz, label: 'examQuiz' },
                ]}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isRequired')}
                value={form.isRequired}
                onChange={(v) => {
                  handleChange('isRequired', v);
                }}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            {form.type === QuizTypeEnum.ExamQuiz ? (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label={t('maxAttempts')}
                  value={form.maxAttempts?.toString() ?? ''}
                  onChange={(value) => {
                    const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                    handleChange('maxAttempts', numericValue ?? 1);
                  }}
                  disabled={isSubmitting}
                  inputMode="numeric"
                  required
                  icon={<NumberCircleFive {...iconStyle} />}
                />
              </Grid>
            ) : (
              <div></div>
            )}

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('displayedQuestionCount')}
                value={form.displayedQuestionCount?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('displayedQuestionCount', numericValue ?? 1);
                }}
                disabled={isSubmitting}
                inputMode="numeric"
                icon={<NumberCircleSix {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('time')}
                value={form.time}
                onChange={(value) => {
                  handleChange('time', value);
                }}
                disabled={isSubmitting}
                inputMode="text"
                pattern="^(?:[0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
                patternError="hh:mm:ss"
                required
                icon={<Clock {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('scoreToPass')}
                value={form.scoreToPass?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('scoreToPass', numericValue ?? 0);
                }}
                disabled={isSubmitting}
                inputMode="numeric"
                required
                icon={<NumberCircleNine {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isFixedQuiz')}
                value={form.isFixedQuiz}
                onChange={(v) => {
                  handleChange('isFixedQuiz', v);
                }}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('timeSchedule')}
              </Typography>
            </Grid>

            {form.isFixedQuiz === true ? (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label={t('durationInDaysForThisPart')}
                  value={form.fixedQuizDayDuration?.toString() ?? ''}
                  onChange={(val) => {
                    const num = val === '' ? undefined : /^\d+$/.test(val) ? Number(val) : form.fixedQuizDayDuration;
                    handleChange('fixedQuizDayDuration', num);
                  }}
                  required
                  inputMode="numeric"
                  patternError={t('onlyPositiveIntegerError')}
                />
              </Grid>
            ) : null}

            {form.isFixedQuiz === false ? (
              <Grid item xs={12} sm={6}>
                <CustomDateTimePicker
                  label={t('startDate')}
                  value={form.startDate ? form.startDate.toISOString() : undefined}
                  onChange={(iso) => {
                    handleChange('startDate', iso ? new Date(iso) : undefined);
                  }}
                  allowClear
                  required={form.isFixedQuiz === false ? true : false}
                />
              </Grid>
            ) : null}

            {form.isFixedQuiz === false ? (
              <Grid item xs={12} sm={6}>
                <CustomDateTimePicker
                  label={t('endDate')}
                  value={form.endDate ? form.endDate.toISOString() : undefined}
                  onChange={(iso) => {
                    handleChange('endDate', iso ? new Date(iso) : undefined);
                  }}
                  allowClear
                  required={form.isFixedQuiz === false ? true : false}
                />
              </Grid>
            ) : null}

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('employeeFilters')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomEmployeeDistinctSelectInForm
                label="departmentType"
                value={form.departmentTypeCode}
                type={DepartmentFilterType.DepartmentType}
                onChange={(value) => {
                  handleChange('departmentTypeCode', value);
                }}
                loadOnMount
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomEmployeeDistinctSelectInForm
                label="position"
                value={form.positionCode}
                type={DepartmentFilterType.Position}
                onChange={(value) => {
                  handleChange('positionCode', value);
                }}
                loadOnMount
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomEmployeeDistinctSelectInForm
                label="currentPositionStateName"
                value={form.positionStateCode}
                type={DepartmentFilterType.PositionState}
                onChange={(value) => {
                  handleChange('positionStateCode', value);
                }}
                loadOnMount
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('categoryAndClassification')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CategorySelect
                label={t('examCategory')}
                categoryUsecase={categoryUsecase}
                value={form.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Quiz}
                disabled={isSubmitting}
              />
            </Grid>

            {/* upload thumbnail */}
            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>
                {t('uploadThumbnail')}
              </Typography>
              <ToggleButtonGroup
                value={thumbnailSource}
                exclusive
                onChange={handleThumbnailSourceChange}
                aria-label="thumbnail source"
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
                  type={FileTypeEnum.Image}
                  status={StatusEnum.Enable}
                  value={form.thumbnailID}
                  onChange={handleFileSelectChange}
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailDocumentNo')}
                      value={form.thumbDocumentNo}
                      onChange={(value: string | undefined) => {
                        handleChange('thumbDocumentNo', value);
                      }}
                      disabled={isSubmitting}
                      icon={<Image {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailPrefixName')}
                      value={form.thumbPrefixName}
                      onChange={(value: string | undefined) => {
                        handleChange('thumbPrefixName', value);
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
                  {/* <Grid item xs={12}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={!!formData.isRequired}
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
                </Grid>
              )}
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
                    alt="Thumbnail Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
            ) : null}

            {/* Upload file resources */}
            {/* <Grid item xs={12}>
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
                <ToggleButton value="multi-select">{t('selectFileResources')}</ToggleButton>
                <ToggleButton value="upload">{t('uploadFiles')}</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {fileSelectSource === 'multi-select' ? (
              <Grid item xs={12}>
                <FileResourceMultiSelect
                  fileUsecase={fileUsecase}
                  value={selectedResourceIDs}
                  onChange={(ids) => {
                    setSelectedResourceIDs(ids);
                  }}
                  disabled={false}
                  showTypeSwitcher
                  allowAllTypes
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={<Image {...iconStyle} />}
                >
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
            )} */}

            {/* {uploadedFiles.length > 0 && fileSelectSource === 'upload' && (
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
                        onClick={() => {
                          handleFilePreview(URL.createObjectURL(file), file.name, file.type);
                        }}
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
            )} */}

            <Grid item xs={12}>
              <CustomButton label={t('create')} onClick={() => handleSave()} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
