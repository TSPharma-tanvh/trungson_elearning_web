import { useEffect, useState } from 'react';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
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

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/shared/classes/teacher/teacher-select';
import { LessonMultiSelectDialog } from '@/presentation/components/shared/courses/lessons/lesson-multi-select';
import { EnrollmentMultiSelect } from '@/presentation/components/shared/enrollment/enrollment-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';

interface EditCourseDialogProps {
  open: boolean;
  data: CourseDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateCourseRequest) => void;
}

export function UpdateCourseFormDialog({ open, data: course, onClose, onSubmit }: EditCourseDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryUsecase, lessonUsecase, enrollUsecase, fileUsecase, classTeacherUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateCourseRequest>(new UpdateCourseRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');

  useEffect(() => {
    if (course && open) {
      const newFormData = new UpdateCourseRequest({
        id: course.id || '',
        name: course.name || '',
        detail: course.detail || undefined,
        isRequired: course.isRequired || false,
        startTime: course.startTime ? DateTimeUtils.formatISODateToString(course.startTime) : '',
        endTime: course.endTime ? DateTimeUtils.formatISODateToString(course.endTime) : '',
        disableStatus:
          course.disableStatus !== undefined ? StatusEnum[course.disableStatus as keyof typeof StatusEnum] : undefined,
        displayType:
          course.displayType !== undefined
            ? DisplayTypeEnum[course.displayType as keyof typeof DisplayTypeEnum]
            : undefined,
        teacherID: course.teacherId || undefined,
        enrollmentCriteriaType: CategoryEnum.Course,
        enrollmentCriteriaIDs: course.enrollmentCriteria?.map((enrollment) => enrollment.id).join(',') || undefined,
        categoryID: course.categoryId || undefined,
        thumbnailID: course.thumbnailId || undefined,
        lessonIds: course.lessons != null ? course.lessons.map((lesson) => lesson.id).join(',') || '' : undefined,
        categoryEnum: CategoryEnum.Course,
        isDeleteOldThumbnail: false,
      });
      setFormData(newFormData);
    }
  }, [course, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateCourseRequest>(field: K, value: UpdateCourseRequest[K]) => {
    setFormData((prev) => new UpdateCourseRequest({ ...prev, [field]: value }));
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
            .then((file) => { setPreviewUrl(file.resourceUrl || null); })
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

  if (!course) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update Course
        </Typography>
        <Box>
          <IconButton onClick={() => { setFullScreen((prev) => !prev); }}>
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
            ID: {course?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label="Name"
                value={formData.name}
                onChange={(value) => { handleChange('name', value); }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label="Detail"
                value={formData.detail}
                onChange={(value) => { handleChange('detail', value); }}
                disabled={isSubmitting}
                icon={<Article {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={(value) => { handleChange('startTime', value); }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="End Time"
                value={formData.endTime}
                onChange={(value) => { handleChange('endTime', value); }}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Status"
                value={formData.disableStatus ?? ''}
                onChange={(value) => { handleChange('disableStatus', value); }}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Display Type"
                value={formData.displayType ?? ''}
                onChange={(value) => { handleChange('displayType', value); }}
                disabled={isSubmitting}
                options={displayTypeOptions}
              />
            </Grid>
            <Grid item xs={12}>
              <LessonMultiSelectDialog
                lessonUsecase={lessonUsecase}
                value={formData.lessonIds ? formData.lessonIds.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => { handleChange('lessonIds', value.join(',')); }}
                disabled={isSubmitting}
                pathID={formData.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <EnrollmentMultiSelect
                enrollmentUsecase={enrollUsecase}
                categoryEnum={CategoryEnum.Course}
                value={
                  formData.enrollmentCriteriaIDs ? formData.enrollmentCriteriaIDs.split(',').filter((id) => id) : []
                }
                onChange={(value: string[]) => { handleChange('enrollmentCriteriaIDs', value.join(',')); }}
                disabled={isSubmitting}
                label="Enrollment Criteria"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => { handleChange('categoryID', value); }}
                categoryEnum={CategoryEnum.Course}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <ClassTeacherSelectDialog
                classUsecase={classTeacherUsecase}
                value={formData.teacherID ?? ''}
                onChange={(value) => { handleChange('teacherID', value); }}
                disabled={isSubmitting}
              />
            </Grid>

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
                      onChange={(value) => { handleChange('thumbDocumentNo', value); }}
                      disabled={isSubmitting}
                      icon={<ImageIcon {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Thumbnail Prefix Name"
                      value={formData.thumbPrefixName}
                      onChange={(value) => { handleChange('thumbPrefixName', value); }}
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
                        onChange={(e) => { handleFileUpload(e.target.files?.[0] || null); }}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(formData.isRequired)}
                          onChange={(e) => { handleChange('isRequired', e.target.checked); }}
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
                          checked={Boolean(formData.isDeleteOldThumbnail)}
                          onChange={(e) => { handleChange('isDeleteOldThumbnail', e.target.checked); }}
                          disabled={isSubmitting}
                        />
                      }
                      label="Delete Old Thumbnail"
                    />
                  </Grid>
                  {previewUrl ? <Grid item xs={12}>
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
                    </Grid> : null}
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
