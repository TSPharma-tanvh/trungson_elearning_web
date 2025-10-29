import * as React from 'react';
import { useEffect, useState } from 'react';
import { UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import { FileResourceEnum } from '@/utils/enum/file-resource-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Article, Clock, Image as ImageIcon, NumberCircleNine, Tag } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { EnrollmentMultiSelect } from '@/presentation/components/shared/enrollment/enrollment-multi-select';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';
import { QuestionMultiSelect } from '@/presentation/components/shared/quiz/question/question-multi-select';

interface EditQuizDialogProps {
  open: boolean;
  data: QuizResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateQuizRequest) => void;
}

const typeOptions = [
  { value: QuizTypeEnum.ExamQuiz, label: 'examQuiz' },
  { value: QuizTypeEnum.LessonQuiz, label: 'lessonQuiz' },
];

export function UpdateQuizFormDialog({ open, data: quiz, onClose, onSubmit }: EditQuizDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const { categoryUsecase, enrollUsecase, fileUsecase, questionUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateQuizRequest>(new UpdateQuizRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');
  const [fileSelectSource, setFileSelectSource] = useState<'multi-select' | 'upload'>('multi-select');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewData, setFilePreviewData] = useState<{
    url: string;
    title?: string;
    type?: string;
  } | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedResourceIDs, setSelectedResourceIDs] = useState<string[]>([]);

  useEffect(() => {
    if (quiz && open) {
      const resourceIds =
        quiz.fileQuizRelation?.map((item) => item.fileResources?.id).filter((id): id is string => Boolean(id)) ?? [];

      const newFormData = new UpdateQuizRequest({
        id: quiz.id || '',
        title: quiz.title || '',
        description: quiz.description || undefined,
        time: quiz.time,
        status: quiz.status !== undefined ? StatusEnum[quiz.status as keyof typeof StatusEnum] : undefined,
        scoreToPass: quiz.scoreToPass || undefined,
        enrollmentCriteriaType: CategoryEnum.Quiz,
        enrollmentCriteriaIDs:
          quiz.quizEnrollments?.map((enrollment) => enrollment.enrollmentCriteria.id).join(',') || undefined,
        categoryID: quiz.categoryID || undefined,
        thumbnailID: quiz.thumbnailID || undefined,
        questionIDs:
          quiz.quizQuestions !== undefined
            ? quiz.quizQuestions.map((lesson) => lesson.question?.id).join(',') || ''
            : undefined,
        resourceIDs: resourceIds.join(',') || undefined,
        categoryEnum: CategoryEnum.Quiz,
        canStartOver: quiz.canStartOver,
        canShuffle: quiz.canShuffle,
        isRequired: quiz.isRequired,
        isAutoSubmitted: quiz.isAutoSubmitted,
        type: typeof quiz.type === 'string' ? QuizTypeEnum[quiz.type as keyof typeof QuizTypeEnum] : quiz.type,
        maxAttempts: quiz.maxAttempts,
        isDeleteOldThumbnail: false,
      });
      setFormData(newFormData);

      setPreviewUrl(quiz.thumbnail?.resourceUrl ?? null);
      setSelectedResourceIDs(resourceIds);
    }
  }, [quiz, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateQuizRequest>(field: K, value: UpdateQuizRequest[K]) => {
    setFormData((prev) => new UpdateQuizRequest({ ...prev, [field]: value }));
  };

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
      if (formData.thumbnailID) {
        try {
          const file = await fileUsecase.getFileResouceById(formData.thumbnailID);
          setPreviewUrl(file.resourceUrl || null);
        } catch {
          setPreviewUrl(null);
        }
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleFileSelectChange = async (id: string) => {
    handleChange('thumbnailID', id);
    if (id) {
      try {
        const file = await fileUsecase.getFileResouceById(id);
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

  const handleMultipleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (thumbnailSource === 'upload') {
        formData.thumbnailID = undefined;
      } else {
        formData.thumbnail = undefined;
      }

      if (fileSelectSource === 'upload') {
        formData.resourceIDs = undefined;
        formData.resources = uploadedFiles;
      } else {
        formData.resources = undefined;
        formData.resourceIDs = selectedResourceIDs.join(',');
      }

      onSubmit(new UpdateQuizRequest({ ...formData }));
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData(new UpdateQuizRequest({}));
      setPreviewUrl(null);
      setThumbnailSource('select');
      setThumbnailFile(null);
      setUploadedFiles([]);
      setFilePreviewOpen(false);
      setFilePreviewData(null);
      setSelectedResourceIDs([]);
      setFileSelectSource('multi-select');
    }
  }, [open]);

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  const statusOptions = [
    { value: StatusEnum.Enable, label: 'enable' },
    { value: StatusEnum.Disable, label: 'disable' },
    { value: StatusEnum.Deleted, label: 'deleted' },
  ];

  if (!quiz) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateQuiz')}
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
        <Box mt={1}>
          <Typography variant="body2" mb={2}>
            {t('id')}: {quiz?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label={t('title')}
                value={formData.title}
                onChange={(value: string | undefined) => {
                  handleChange('title', value);
                }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('description')}
                value={formData.description}
                onChange={(value: string | undefined) => {
                  handleChange('description', value);
                }}
                disabled={isSubmitting}
                multiline
                rows={3}
                icon={<Article {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('time')}
                value={formData.time}
                onChange={(value: string | undefined) => {
                  handleChange('time', value);
                }}
                disabled={isSubmitting}
                inputMode="text"
                pattern="^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$"
                patternError="hh:mm:ss"
                icon={<Clock {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('scoreToPass')}
                inputMode="numeric"
                value={formData.scoreToPass?.toString() ?? ''}
                onChange={(value: string) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('scoreToPass', numericValue);
                }}
                disabled={isSubmitting}
                icon={<NumberCircleNine {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('maxAttempts')}
                inputMode="numeric"
                value={formData.maxAttempts?.toString() ?? ''}
                onChange={(value: string) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxAttempts', numericValue);
                }}
                disabled={isSubmitting}
                icon={<Article {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('status')}
                value={formData.status ?? ''}
                onChange={(value) => {
                  handleChange('status', value);
                }}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('type')}
                value={formData.type ?? ''}
                onChange={(value) => {
                  handleChange('type', value);
                }}
                disabled={isSubmitting}
                options={typeOptions}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('canStartOver')}
                value={formData.canStartOver ?? false}
                onChange={(value) => {
                  handleChange('canStartOver', value);
                }}
                disabled={isSubmitting}
                options={[
                  { value: true, label: t('yes') },
                  { value: false, label: t('no') },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('canShuffle')}
                value={formData.canShuffle ?? false}
                onChange={(value) => {
                  handleChange('canShuffle', value);
                }}
                disabled={isSubmitting}
                options={[
                  { value: true, label: t('yes') },
                  { value: false, label: t('no') },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isRequired')}
                value={formData.isRequired ?? false}
                onChange={(value) => {
                  handleChange('isRequired', value);
                }}
                disabled={isSubmitting}
                options={[
                  { value: true, label: t('yes') },
                  { value: false, label: t('no') },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isAutoSubmitted')}
                value={formData.isAutoSubmitted ?? false}
                onChange={(value) => {
                  handleChange('isAutoSubmitted', value);
                }}
                disabled={isSubmitting}
                options={[
                  { value: true, label: t('yes') },
                  { value: false, label: t('no') },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <QuestionMultiSelect
                questionUsecase={questionUsecase}
                value={formData.questionIDs ? formData.questionIDs.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => {
                  handleChange('questionIDs', value.join(','));
                }}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <EnrollmentMultiSelect
                enrollmentUsecase={enrollUsecase}
                categoryEnum={CategoryEnum.Quiz}
                value={
                  formData.enrollmentCriteriaIDs ? formData.enrollmentCriteriaIDs.split(',').filter((id) => id) : []
                }
                onChange={(value: string[]) => {
                  handleChange('enrollmentCriteriaIDs', value.join(','));
                }}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Quiz}
                disabled={isSubmitting}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <ClassTeacherSelectDialog
                classUsecase={classTeacherUsecase}
                value={formData.teacherID ?? ''}
                onChange={(value) => handleChange('teacherID', value)}
                disabled={isSubmitting}
              />
            </Grid> */}

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
                  startIcon={<ImageIcon {...iconStyle} />}
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
            )}

            {selectedResourceIDs.length > 0 && fileSelectSource === 'multi-select' ? (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  {t('selectedFiles')}
                </Typography>
                <Grid container spacing={1} direction="column">
                  {selectedResourceIDs.map((id) => {
                    const file = quiz?.fileQuizRelation?.find((f) => f.fileResources?.id === id)?.fileResources;
                    if (!file) return null;
                    return (
                      <Grid item key={file.id}>
                        <Button
                          variant="text"
                          fullWidth
                          onClick={() => {
                            handleFilePreview(file.resourceUrl ?? '', file.name, file.type);
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
                    );
                  })}
                </Grid>
              </Grid>
            ) : null}

            {uploadedFiles.length > 0 && fileSelectSource === 'upload' && (
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
            )}

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
                  type={FileResourceEnum.Image}
                  status={StatusEnum.Enable}
                  value={formData.thumbnailID}
                  onChange={handleFileSelectChange}
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailDocumentNo')}
                      value={formData.thumbDocumentNo}
                      onChange={(value: string | undefined) => {
                        handleChange('thumbDocumentNo', value);
                      }}
                      disabled={isSubmitting}
                      icon={<ImageIcon {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailPrefixName')}
                      value={formData.thumbPrefixName}
                      onChange={(value: string | undefined) => {
                        handleChange('thumbPrefixName', value);
                      }}
                      disabled={isSubmitting}
                      icon={<ImageIcon {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      disabled={isSubmitting}
                      startIcon={<ImageIcon {...iconStyle} />}
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
                          checked={Boolean(formData.isDeleteOldThumbnail)}
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
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            m: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </Box>
      </DialogActions>

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
