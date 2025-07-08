import { useEffect, useState } from 'react';
import { UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CategoryEnum, CategoryEnumUtils, DisplayTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
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
import { Article, Calendar, Image as ImageIcon, Note, Tag } from '@phosphor-icons/react';

import { CategorySelect } from '@/presentation/components/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/classes/teacher/teacher-select';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { LessonSelectDialog } from '@/presentation/components/courses/lessons/lesson-select';
import { EnrollmentSelect } from '@/presentation/components/enrollment/enrollment-select';
import { FileResourceSelect } from '@/presentation/components/file/file-resource-select';
import { QuestionMultiSelectDialog } from '@/presentation/components/quiz/question/question-multi-select';

interface EditQuizDialogProps {
  open: boolean;
  data: QuizResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateQuizRequest) => void;
}

export function UpdateQuizFormDialog({ open, data: quiz, onClose, onSubmit }: EditQuizDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryUsecase, enrollUsecase, fileUsecase, questionUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateQuizRequest>(new UpdateQuizRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');

  useEffect(() => {
    if (quiz && open) {
      const newFormData = new UpdateQuizRequest({
        id: quiz.id || '',
        title: quiz.title || '',
        description: quiz.description || undefined,
        // isRequired: quiz.isRequired || false,
        startTime: quiz.startTime ? quiz.startTime : undefined,
        endTime: quiz.endTime ? quiz.endTime : undefined,
        // disableStatus:
        //   quiz.disableStatus !== undefined ? StatusEnum[quiz.disableStatus as keyof typeof StatusEnum] : undefined,
        // displayType:
        //   quiz.displayType !== undefined
        //     ? DisplayTypeEnum[quiz.displayType as keyof typeof DisplayTypeEnum]
        //     : undefined,
        // teacherID: quiz.teacherId || undefined,
        enrollmentCriteriaType: CategoryEnum.Quiz,
        enrollmentCriteriaIDs: quiz.enrollmentCriteria?.map((enrollment) => enrollment.id).join(',') || undefined,
        // categoryID: quiz.categoryId || undefined,
        // thumbnailID: quiz.thumbnailId || undefined,
        // lessonIds: quiz.lessons != null ? quiz.lessons.map((lesson) => lesson.id).join(',') || '' : undefined,
        categoryEnum: CategoryEnum.Quiz,
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
            {/* <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Status"
                value={formData.disableStatus ?? ''}
                onChange={(value) => handleChange('disableStatus', value as StatusEnum)}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Display Type"
                value={formData.displayType ?? ''}
                onChange={(value) => handleChange('displayType', value as DisplayTypeEnum)}
                disabled={isSubmitting}
                options={displayTypeOptions}
              />
            </Grid>
            <Grid item xs={12}>
              <LessonSelectDialog
                lessonUsecase={lessonUsecase}
                value={formData.lessonIds ? formData.lessonIds.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => handleChange('lessonIds', value.join(','))}
                disabled={isSubmitting}
                pathID={formData.id}
              />
            </Grid> */}
            <Grid item xs={12}>
              <QuestionMultiSelectDialog
                questionUsecase={questionUsecase}
                value={formData.questionIDs ? formData.questionIDs.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => handleChange('questionIDs', value.join(','))}
                disabled={isSubmitting}
                pathID={formData.id}
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

            <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  </Grid>
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
    </Dialog>
  );
}
