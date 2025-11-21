import React, { useEffect, useState } from 'react';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import {
  LessonsCollectionUpdateDetailRequest,
  LessonsCollectionUpdateRequest,
} from '@/domain/models/lessons/request/lesson-collection-update-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, StatusEnum } from '@/utils/enum/core-enum';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
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

import { CustomEmployeeDistinctSelectInForm } from '@/presentation/components/core/drop-down/custom-employee-distinct-select-in-form';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/shared/classes/teacher/teacher-select';
import { LessonCollectionUpdateEditor } from '@/presentation/components/shared/courses/lessons/lesson-collection-update-form';
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
  const { categoryUsecase, fileUsecase, classTeacherUsecase } = useDI();

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
      const mappedCollections =
        course.collections?.map(
          (c) =>
            new LessonsCollectionUpdateRequest({
              id: c.id,
              name: c.name,
              order: c.order,
              startDate: c.startDate ? new Date(c.startDate) : undefined,
              endDate: c.endDate ? new Date(c.endDate) : undefined,
              fixedCourseDayDuration: c.fixedCourseDayDuration,

              collection:
                c.lessons
                  ?.map(
                    (lesson) =>
                      new LessonsCollectionUpdateDetailRequest({
                        lessonId: lesson.id,
                        order: lesson.order ?? 0,
                      })
                  )
                  .sort((a, b) => a.order - b.order) ?? [],
            })
        ) ?? [];

      const newFormData = new UpdateCourseRequest({
        id: course.id || '',
        name: course.name || '',
        detail: course.detail || undefined,
        isRequired: course.isRequired || false,
        disableStatus: course.disableStatus,
        meetingLink: course.meetingLink || undefined,
        teacherId: course.teacherId || undefined,
        isFixedCourse: course.isFixedCourse ?? false,
        categoryId: course.categoryId || undefined,
        thumbnailId: course.thumbnailId || undefined,
        categoryEnum: CategoryEnum[CategoryEnum.Course],
        isDeleteOldThumbnail: false,
        resourceIds:
          course.fileCourseRelation
            ?.map((item) => item.fileResources?.id)
            .filter((id): id is string => Boolean(id))
            .join(',') || undefined,

        collections: mappedCollections,
        positionCode: course.positionCode,
        positionStateCode: course.positionStateCode,
        departmentTypeCode: course.departmentTypeCode,
      });

      setFormData(newFormData);
      setPreviewUrl(course.thumbnail?.resourceUrl ?? null);
      setSelectedResourceIDs(
        course.fileCourseRelation?.map((item) => item.fileResources?.id).filter((id): id is string => Boolean(id)) ?? []
      );
    }
  }, [course, open]);

  const handleChange = <K extends keyof UpdateCourseRequest>(field: K, value: UpdateCourseRequest[K]) => {
    setFormData((prev) => new UpdateCourseRequest({ ...prev, [field]: value }));
  };

  const handleThumbnailSourceChange = async (_: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (!newSource) return;
    setThumbnailSource(newSource);
    if (newSource === 'upload') {
      if (thumbnailFile) setPreviewUrl(URL.createObjectURL(thumbnailFile));
      else setPreviewUrl(null);
    } else if (formData.thumbnailId) {
      try {
        const file = await fileUsecase.getFileResourceById(formData.thumbnailId);
        setPreviewUrl(file.resourceUrl || null);
      } catch {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileSelectChange = async (id: string) => {
    handleChange('thumbnailId', id);
    if (id) {
      try {
        const file = await fileUsecase.getFileResourceById(id);
        setPreviewUrl(file.resourceUrl || null);
      } catch {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileUpload = (file: File | null) => {
    setThumbnailFile(file);
    handleChange('thumbnail', file ?? undefined);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
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
        formData.thumbnailId = undefined;
      } else {
        formData.thumbnail = undefined;
      }
      if (fileSelectSource === 'upload') {
        formData.resourceIds = undefined;
        formData.resources = uploadedFiles;
      } else {
        formData.resources = undefined;
        formData.resourceIds = selectedResourceIDs.join(',');
      }
      onSubmit(new UpdateCourseRequest({ ...formData }));
      onClose();
    } catch (error) {
      // ignore
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

  const iconStyle = { size: 20, weight: 'fill' as const, color: '#616161' };
  const statusOptions = [
    { value: StatusEnum[StatusEnum.Enable], label: 'enable' },
    { value: StatusEnum[StatusEnum.Disable], label: 'disable' },
    { value: StatusEnum[StatusEnum.Deleted], label: 'deleted' },
  ];
  // const displayTypeOptions = [
  //   { value: DisplayTypeEnum.Public, label: 'public' },
  //   { value: DisplayTypeEnum.Private, label: 'private' },
  // ];

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
                label={t('status')}
                value={formData.disableStatus ?? ''}
                onChange={(value) => {
                  handleChange('disableStatus', value);
                }}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('displayType')}
                value={formData.displayType ?? ''}
                onChange={(value) => handleChange('displayType', value)}
                disabled={isSubmitting}
                options={displayTypeOptions}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isFixedCourse')}
                value={formData.isFixedCourse ?? false}
                onChange={(val) => {
                  handleChange('isFixedCourse', val);
                }}
                disabled={isSubmitting}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryId}
                onChange={(value) => {
                  handleChange('categoryId', value);
                }}
                categoryEnum={CategoryEnum.Course}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <ClassTeacherSelectDialog
                classUsecase={classTeacherUsecase}
                value={formData.teacherId ?? ''}
                onChange={(value) => {
                  handleChange('teacherId', value);
                }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomEmployeeDistinctSelectInForm
                label="departmentType"
                value={formData.departmentTypeCode}
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
                value={formData.positionCode}
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
                value={formData.positionStateCode}
                type={DepartmentFilterType.PositionState}
                onChange={(value) => {
                  handleChange('positionStateCode', value);
                }}
                loadOnMount
              />
            </Grid>

            {/* Thumbnail Section */}
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
                <ToggleButton value="select">{t('selectFromResources')}</ToggleButton>
                <ToggleButton value="upload">{t('uploadFile')}</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12}>
              {thumbnailSource === 'select' ? (
                <FileResourceSelect
                  fileUsecase={fileUsecase}
                  type={FileResourceEnum.Image}
                  status={StatusEnum.Enable}
                  value={formData.thumbnailId}
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

            {/* File Resources */}
            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>
                {t('uploadFiles')}
              </Typography>
              <ToggleButtonGroup
                value={fileSelectSource}
                exclusive
                onChange={(e, newValue: 'upload' | 'multi-select') => {
                  newValue && setFileSelectSource(newValue);
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
                  onChange={setSelectedResourceIDs}
                  disabled={isSubmitting}
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

            {formData.resourceIds && fileSelectSource === 'multi-select' ? (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  {t('selectedFiles')}
                </Typography>
                <Grid container spacing={1} direction="column">
                  {formData.resourceIds.split(',').map((id) => {
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

            <Grid item xs={12}>
              <LessonCollectionUpdateEditor
                fixedCourse={formData.isFixedCourse}
                value={formData.collections}
                onChange={(collections) => {
                  handleChange('collections', collections);
                }}
              />
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
