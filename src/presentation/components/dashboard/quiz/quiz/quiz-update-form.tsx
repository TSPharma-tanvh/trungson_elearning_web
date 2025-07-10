import { useEffect, useState } from 'react';
import { UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CategoryEnum, CategoryEnumUtils, DisplayTypeEnum, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
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
import { Article, Calendar, Clock, Image as ImageIcon, Note, Tag } from '@phosphor-icons/react';

import { CategorySelect } from '@/presentation/components/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/classes/teacher/teacher-select';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { LessonSelectDialog } from '@/presentation/components/courses/lessons/lesson-select';
import { EnrollmentSelect } from '@/presentation/components/enrollment/enrollment-select';
import { FileResourceMultiSelect } from '@/presentation/components/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/file/file-resource-select';
import ImagePreviewDialog from '@/presentation/components/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/file/video-preview-dialog';
import { QuestionMultiSelectDialog } from '@/presentation/components/quiz/question/question-multi-select';

interface EditQuizDialogProps {
  open: boolean;
  data: QuizResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateQuizRequest) => void;
}

const statusOptions = [
  { value: StatusEnum.Enable, label: 'Enable' },
  { value: StatusEnum.Disable, label: 'Disable' },
  { value: StatusEnum.Deleted, label: 'Deleted' },
];

const typeOptions = [
  { value: QuizTypeEnum.ExamQuiz, label: 'ExamQuiz' },
  { value: QuizTypeEnum.LessonQuiz, label: 'LessonQuiz' },
];

const booleanOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

export function UpdateQuizFormDialog({ open, data: quiz, onClose, onSubmit }: EditQuizDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  useEffect(() => {
    if (quiz && open) {
      const newFormData = new UpdateQuizRequest({
        id: quiz.id || '',
        title: quiz.title || '',
        description: quiz.description || undefined,
        startTime: quiz.startTime ? quiz.startTime : undefined,
        endTime: quiz.endTime ? quiz.endTime : undefined,
        time: quiz.time,
        status: quiz.status !== undefined ? StatusEnum[quiz.status as keyof typeof StatusEnum] : undefined,
        enrollmentCriteriaType: CategoryEnum.Quiz,
        enrollmentCriteriaIDs: quiz.enrollmentCriteria?.map((enrollment) => enrollment.id).join(',') || undefined,
        categoryID: quiz.categoryID || undefined,
        thumbnailID: quiz.thumbnailID || undefined,
        questionIDs:
          quiz.quizQuestions != null
            ? quiz.quizQuestions.map((lesson) => lesson.question?.id).join(',') || ''
            : undefined,
        resourceIDs:
          quiz.fileQuizRelation
            ?.map((item) => item.fileResources?.id)
            .filter((id): id is string => !!id)
            .join(',') || undefined,
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
    }
  }, [quiz, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateQuizRequest>(field: K, value: UpdateQuizRequest[K]) => {
    setFormData((prev) => new UpdateQuizRequest({ ...prev, [field]: value }));
  };

  const handleThumbnailSourceChange = (event: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (newSource) {
      setThumbnailSource(newSource);
      if (newSource === 'upload') {
        handleChange('thumbnailID', undefined);
        setPreviewUrl(formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : null);
      } else {
        handleChange('thumbnail', undefined);
        if (formData.thumbnailID) {
          fileUsecase
            .getFileResouceById(formData.thumbnailID)
            .then((file) => setPreviewUrl(file.resourceUrl || null))
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
      console.error('Error updating path:', error);
      CustomSnackBar.showSnackbar('Failed to update path', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setUploadedFiles([]);
    }
  }, [open]);

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

  const displayTypeOptions = [
    { value: DisplayTypeEnum.Public, label: 'Public' },
    { value: DisplayTypeEnum.Private, label: 'Private' },
  ];

  if (!quiz) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update Quiz
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

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body2" mb={2}>
            ID: {quiz?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label="Name"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label="Detail"
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                disabled={isSubmitting}
                multiline
                rows={3}
                icon={<Article {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Start Time"
                value={formData.startTime?.toISOString()}
                onChange={(value) => handleChange('startTime', new Date(value))}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="End Time"
                value={formData.endTime?.toISOString()}
                onChange={(value) => handleChange('endTime', new Date(value))}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Time"
                value={formData.time}
                onChange={(value) => handleChange('time', value)}
                disabled={isSubmitting}
                inputMode="text"
                pattern="^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$"
                patternError="hh:mm:ss"
                icon={<Clock {...iconStyle} />}
                onValidationChange={(isValid) => console.log('Time is valid:', isValid)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Max Capacity"
                inputMode="numeric"
                value={formData.maxCapacity?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxCapacity', numericValue);
                }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Max Attempts"
                inputMode="numeric"
                value={formData.maxAttempts?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxAttempts', numericValue);
                }}
                disabled={isSubmitting}
                icon={<Article {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Status"
                value={formData.status ?? ''}
                onChange={(value) => handleChange('status', value as StatusEnum)}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Type"
                value={formData.type ?? ''}
                onChange={(value) => handleChange('type', value as QuizTypeEnum)}
                disabled={isSubmitting}
                options={typeOptions}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Can Start Over"
                value={String(formData.canStartOver ?? '')}
                onChange={(value) => handleChange('canStartOver', value === 'true')}
                disabled={isSubmitting}
                options={booleanOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Can Shuffle"
                value={String(formData.canShuffle ?? '')}
                onChange={(value) => handleChange('canShuffle', value === 'true')}
                disabled={isSubmitting}
                options={booleanOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Required"
                value={String(formData.isRequired ?? '')}
                onChange={(value) => handleChange('isRequired', value === 'true')}
                disabled={isSubmitting}
                options={booleanOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Auto Submitted"
                value={String(formData.isAutoSubmitted ?? '')}
                onChange={(value) => handleChange('isAutoSubmitted', value === 'true')}
                disabled={isSubmitting}
                options={booleanOptions}
              />
            </Grid>

            <Grid item xs={12}>
              <QuestionMultiSelectDialog
                questionUsecase={questionUsecase}
                value={formData.questionIDs ? formData.questionIDs.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => handleChange('questionIDs', value.join(','))}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <EnrollmentSelect
                enrollmentUsecase={enrollUsecase}
                categoryEnum={CategoryEnum.Quiz}
                value={
                  formData.enrollmentCriteriaIDs ? formData.enrollmentCriteriaIDs.split(',').filter((id) => id) : []
                }
                onChange={(value: string[]) => handleChange('enrollmentCriteriaIDs', value.join(','))}
                disabled={isSubmitting}
                label="Enrollment Criteria"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => handleChange('categoryID', value)}
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
                  onChange={(ids) => handleChange('resourceIDs', ids.join(','))}
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

            {formData.resourceIDs && formData.resourceIDs.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  Selected Files
                </Typography>
                <Grid container spacing={1} direction="column">
                  {formData.resourceIDs.split(',').map((id) => {
                    const file = quiz?.fileQuizRelation?.find((f) => f.fileResources?.id === id)?.fileResources;
                    if (!file) return null;
                    return (
                      <Grid item key={file.id}>
                        <Button
                          variant="text"
                          fullWidth
                          onClick={() => handleFilePreview(file.resourceUrl ?? '', file.name, file.type)}
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
            )}
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
                        onClick={() => handleFilePreview(URL.createObjectURL(file), file.name, file.type)}
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
                  onChange={handleFileSelectChange}
                  label="Thumbnail"
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Thumbnail Document No"
                      value={formData.thumbDocumentNo}
                      onChange={(value) => handleChange('thumbDocumentNo', value)}
                      disabled={isSubmitting}
                      icon={<ImageIcon {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Thumbnail Prefix Name"
                      value={formData.thumbPrefixName}
                      onChange={(value) => handleChange('thumbPrefixName', value)}
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
                        onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
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
                          checked={!!formData.isDeleteOldThumbnail}
                          onChange={(e) => handleChange('isDeleteOldThumbnail', e.target.checked)}
                          disabled={isSubmitting}
                        />
                      }
                      label="Delete Old Thumbnail"
                    />
                  </Grid>
                  {previewUrl && (
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
                  )}
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
