import React, { useEffect, useState } from 'react';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, DisplayTypeEnum, LearningModeEnum, StatusEnum } from '@/utils/enum/core-enum';
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
import { Article, Image as ImageIcon, Tag } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/shared/classes/teacher/teacher-select';
import { LessonMultiSelectAndCreateDialog } from '@/presentation/components/shared/courses/lessons/lesson-multi-select-and-create-form';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';

interface EditCourseDialogProps {
  open: boolean;
  data: CourseDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateCourseRequest) => void;
}

export function UpdateCourseFormDialog({ open, data: course, onClose, onSubmit }: EditCourseDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryUsecase, lessonUsecase, fileUsecase, classTeacherUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateCourseRequest>(new UpdateCourseRequest({}));
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
    if (course && open) {
      const newFormData = new UpdateCourseRequest({
        id: course.id || '',
        name: course.name || '',
        detail: course.detail || undefined,
        isRequired: course.isRequired || false,
        disableStatus:
          course.disableStatus !== undefined ? StatusEnum[course.disableStatus as keyof typeof StatusEnum] : undefined,
        displayType:
          course.displayType !== undefined
            ? DisplayTypeEnum[course.displayType as keyof typeof DisplayTypeEnum]
            : undefined,
        courseType:
          course.courseType !== undefined
            ? LearningModeEnum[course.courseType as keyof typeof LearningModeEnum]
            : undefined,
        meetingLink: course.meetingLink || undefined,
        teacherID: course.teacherId || undefined,
        enrollmentCriteriaType: course.pathId !== undefined ? undefined : CategoryEnum.Course,
        enrollmentCriteriaIDs:
          course.pathId === undefined
            ? course.courseEnrollments?.map((enrollment) => enrollment.enrollmentCriteriaID).join(',') || undefined
            : undefined,
        categoryID: course.categoryId || undefined,
        thumbnailID: course.thumbnailId || undefined,
        lessonIds: course.lessons !== undefined ? course.lessons.map((lesson) => lesson.id).join(',') || '' : undefined,
        categoryEnum: CategoryEnum.Course,
        isDeleteOldThumbnail: false,
        resourceIDs:
          course.fileCourseRelation
            ?.map((item) => item.fileResources?.id)
            .filter((id): id is string => Boolean(id))
            .join(',') || undefined,
      });
      setFormData(newFormData);
      setPreviewUrl(course.thumbnail?.resourceUrl ?? null);

      setSelectedResourceIDs(
        course.fileCourseRelation?.map((item) => item.fileResources?.id).filter((id): id is string => Boolean(id)) ?? []
      );
    }
  }, [course, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateCourseRequest>(field: K, value: UpdateCourseRequest[K]) => {
    setFormData((prev) => new UpdateCourseRequest({ ...prev, [field]: value }));
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
          const file = await fileUsecase.getFileResourceById(formData.thumbnailID);
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

      onSubmit(new UpdateCourseRequest({ ...formData }));
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData(new UpdateCourseRequest({}));
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

  const displayTypeOptions = [
    { value: DisplayTypeEnum.Public, label: 'public' },
    { value: DisplayTypeEnum.Private, label: 'private' },
  ];

  if (!course) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateCourse')}
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
            {t('id')}: {course?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label={t('name')}
                value={formData.name}
                onChange={(value) => {
                  handleChange('name', value);
                }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('detail')}
                value={formData.detail}
                onChange={(value) => {
                  handleChange('detail', value);
                }}
                disabled={isSubmitting}
                icon={<Article {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('disableStatus')}
                value={formData.disableStatus ?? ''}
                onChange={(value) => {
                  handleChange('disableStatus', value);
                }}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('displayType')}
                value={formData.displayType ?? ''}
                onChange={(value) => {
                  handleChange('displayType', value);
                }}
                disabled={isSubmitting}
                options={displayTypeOptions}
              />
            </Grid>

            <Grid item xs={12}>
              <LessonMultiSelectAndCreateDialog
                lessonUsecase={lessonUsecase}
                value={formData.lessonIds ? formData.lessonIds.split(',').filter((id) => id) : []}
                onChange={(value: string[]) => {
                  handleChange('lessonIds', value.join(','));
                }}
              />
            </Grid>

            {/* {course.pathId === undefined ? (
              <Grid item xs={12}>
                <EnrollmentMultiSelect
                  enrollmentUsecase={enrollUsecase}
                  categoryEnum={CategoryEnum.Course}
                  value={
                    formData.enrollmentCriteriaIDs ? formData.enrollmentCriteriaIDs.split(',').filter((id) => id) : []
                  }
                  onChange={(value: string[]) => {
                    handleChange('enrollmentCriteriaIDs', value.join(','));
                  }}
                  disabled={isSubmitting}
                />
              </Grid>
            ) : null} */}

            <Grid item xs={12}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Course}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <ClassTeacherSelectDialog
                classUsecase={classTeacherUsecase}
                value={formData.teacherID ?? ''}
                onChange={(value) => {
                  handleChange('teacherID', value);
                }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <ToggleButtonGroup
                value={thumbnailSource}
                exclusive
                onChange={handleThumbnailSourceChange}
                aria-label={t('uploadFile')}
                fullWidth
                disabled={isSubmitting}
                sx={{ mb: 2 }}
              >
                <ToggleButton value="select" aria-label={t('selectFromResources')}>
                  {t('selectFromResources')}
                </ToggleButton>
                <ToggleButton value="upload" aria-label={t('uploadFile')}>
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
                  label={t('thumbnail')}
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailDocumentNo')}
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
                      label={t('thumbnailPrefixName')}
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
                          checked={Boolean(formData.isRequired)}
                          onChange={(e) => {
                            handleChange('isRequired', e.target.checked);
                          }}
                          disabled={isSubmitting}
                        />
                      }
                      label={t('isRequired')}
                    />
                  </Grid>
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
                  type={FileResourceEnum.Image}
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

            {formData.resourceIDs && formData.resourceIDs.length > 0 && fileSelectSource === 'multi-select' ? (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  {t('selectedFiles')}
                </Typography>
                <Grid container spacing={1} direction="column">
                  {formData.resourceIDs.split(',').map((id) => {
                    const file = course?.fileCourseRelation?.find((f) => f.fileResources?.id === id)?.fileResources;
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
