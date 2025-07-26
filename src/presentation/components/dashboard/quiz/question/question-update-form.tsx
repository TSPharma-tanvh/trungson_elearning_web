import { useEffect, useState } from 'react';
import { UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { type QuestionResponse } from '@/domain/models/question/response/question-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, QuestionEnum, StatusEnum } from '@/utils/enum/core-enum';
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
import { Image as ImageIcon, Tag } from '@phosphor-icons/react';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';
import { AnswerMultiSelectDialog } from '@/presentation/components/shared/quiz/answer/answer-multi-select';

interface EditQuestionDialogProps {
  open: boolean;
  data: QuestionResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateQuestionRequest) => void;
}

export function UpdateQuestionFormDialog({ open, data: question, onClose, onSubmit }: EditQuestionDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryUsecase, fileUsecase, answerUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateQuestionRequest>(new UpdateQuestionRequest({}));
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

  useEffect(() => {
    if (question && open) {
      const newFormData = new UpdateQuestionRequest({
        id: question.id || '',
        questionText: question.questionText || '',
        questionType:
          question.questionType !== undefined
            ? QuestionEnum[question.questionType as keyof typeof QuestionEnum]
            : undefined,
        point: question.point,
        totalAnswer: question.totalAnswer,
        status: question.status !== undefined ? StatusEnum[question.status as keyof typeof StatusEnum] : undefined,
        categoryID: question.categoryId || undefined,
        thumbnailID: question.thumbnailId || undefined,
        answerIDs: question.answers != null ? question.answers.map((answer) => answer.id).join(',') || '' : undefined,
        resourceIDs:
          question.fileQuestionRelation
            ?.map((item) => item.fileResourceId)
            .filter((id): id is string => Boolean(id))
            .join(',') || undefined,
        categoryEnum: CategoryEnum.Question,
        isDeleteOldThumbnail: false,
      });
      setFormData(newFormData);
      console.error(newFormData);
    }
  }, [question, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateQuestionRequest>(field: K, value: UpdateQuestionRequest[K]) => {
    setFormData((prev) => new UpdateQuestionRequest({ ...prev, [field]: value }));
  };

  const handleThumbnailSourceChange = (event: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (newSource) {
      setThumbnailSource(newSource);
      if (newSource === 'upload') {
        setPreviewUrl(formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : null);
      } else {
        handleChange('thumbnail', undefined);
        if (formData.thumbnailID) {
          fileUsecase
            .getFileResouceById(formData.thumbnailID)
            .then((file) => {
              setPreviewUrl(file.resourceUrl || null);
            })
            .catch((error) => {
              console.error('Error fetching thumbnail:', error);
              setPreviewUrl(null);
            });
        } else {
          setPreviewUrl(null);
        }
      }
    }
  };

  const handleFileSelectChange = async (id: string) => {
    handleChange('thumbnailID', id);
    if (id) {
      try {
        const file = await fileUsecase.getFileResouceById(id);
        setPreviewUrl(file.resourceUrl || null);
      } catch (error) {
        console.error('Error fetching file resource:', error);
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
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

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      CustomSnackBar.showSnackbar('Failed to update question', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  const statusOptions = [
    { value: StatusEnum.Enable, label: 'Enable' },
    { value: StatusEnum.Disable, label: 'Disable' },
    { value: StatusEnum.Deleted, label: 'Deleted' },
  ];

  const questionOptions = [
    { value: QuestionEnum.SingleChoice, label: 'SingleChoice' },
    { value: QuestionEnum.MultipleChoice, label: 'MultipleChoice' },
    { value: QuestionEnum.ShortAnswer, label: 'ShortAnswer' },
    { value: QuestionEnum.LongAnswer, label: 'LongAnswer' },
  ];

  if (!question) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update Question
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
            ID: {question?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label="questionText"
                value={formData.questionText}
                onChange={(value) => {
                  handleChange('questionText', value);
                }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Question Type"
                value={formData.questionType ?? ''}
                onChange={(value) => {
                  handleChange('questionType', value);
                }}
                disabled={isSubmitting}
                options={questionOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Status"
                value={formData.status ?? 0}
                onChange={(value) => {
                  handleChange('status', value as StatusEnum);
                }}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>

            <Grid item xs={12}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Question}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <AnswerMultiSelectDialog
                answerUsecase={answerUsecase}
                value={formData.answerIDs ? formData.answerIDs.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => {
                  handleChange('answerIDs', value.join(','));
                }}
                disabled={isSubmitting}
              />
            </Grid>
            {/* Upload file resources */}

            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>
                Upload Files
              </Typography>
              <ToggleButtonGroup
                value={fileSelectSource}
                exclusive
                onChange={(e, newValue) => newValue && setFileSelectSource(newValue)}
                aria-label="file select source"
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="multi-select">Select from File Resources</ToggleButton>
                <ToggleButton value="upload">Upload Files</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {fileSelectSource === 'multi-select' ? (
              <Grid item xs={12}>
                <FileResourceMultiSelect
                  fileUsecase={fileUsecase}
                  type={FileResourceEnum.Image}
                  value={formData.resourceIDs?.split(',').filter(Boolean) ?? []}
                  onChange={(ids) => {
                    handleChange('resourceIDs', ids.join(','));
                  }}
                  label="Select Files"
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
                  Upload Files
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

            {formData.resourceIDs && formData.resourceIDs.length > 0 ? (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  Selected Files
                </Typography>
                <Grid container spacing={1} direction="column">
                  {formData.resourceIDs.split(',').map((id) => {
                    const file = question?.fileQuestionRelation?.find((f) => f.fileResources?.id === id)?.fileResources;
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
            {uploadedFiles.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  Uploaded Files
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

            {/* Thumbnail */}

            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>
                Upload Thumbnail
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
                  Select from Resources
                </ToggleButton>
                <ToggleButton value="upload" aria-label="upload file">
                  Upload File
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
                  onChange={(ids) => {
                    handleChange('thumbnailID', ids);
                  }}
                  label="Thumbnail"
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Thumbnail Document No"
                      value={formData.thumbDocumentNo}
                      onChange={(value) => {
                        handleChange('thumbDocumentNo', value);
                      }}
                      disabled={isSubmitting}
                      icon={<ImageIcon {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Thumbnail Prefix Name"
                      value={formData.thumbPrefixName}
                      onChange={(value) => {
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
                      Upload Thumbnail
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
                      label="Delete Old Thumbnail"
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
                          alt="Thumbnail Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    </Grid>
                  ) : null}
                </Grid>
              )}
            </Grid>
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
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
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
