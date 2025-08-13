'use client';

import React, { useEffect, useState } from 'react';
import { UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';
import { type CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, CategoryEnumUtils } from '@/utils/enum/core-enum';
import { FileResourceEnum } from '@/utils/enum/file-resource-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
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
import { Image as ImageIcon, Note, Tag } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { CourseMultiSelectDialog } from '@/presentation/components/shared/courses/courses/courses-multi-select';
import { EnrollmentMultiSelect } from '@/presentation/components/shared/enrollment/enrollment-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';

interface EditPathDialogProps {
  open: boolean;
  path: CoursePathResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateCoursePathRequest) => void;
}

export function UpdatePathFormDialog({ open, path, onClose, onSubmit }: EditPathDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryUsecase, courseUsecase, enrollUsecase, fileUsecase } = useDI();

  const [courseFormData, setCourseFormData] = useState<UpdateCoursePathRequest>(new UpdateCoursePathRequest());

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');

  useEffect(() => {
    if (path && open) {
      const newFormData = new UpdateCoursePathRequest({
        id: path.id || '',
        name: path.name || '',
        detail: path.detail || undefined,
        isRequired: path.isRequired || false,
        startTime: path.startTime,
        endTime: path.endTime,
        status: path.status !== undefined ? StatusEnum[path.status as keyof typeof StatusEnum] : undefined,
        displayType:
          path.displayType !== undefined
            ? DisplayTypeEnum[path.displayType as keyof typeof DisplayTypeEnum]
            : undefined,
        enrollmentCriteriaIDs: path.enrollmentCriteria?.map((enrollment) => enrollment.id).join(',') || undefined,
        enrollmentCriteriaType: CategoryEnum.Path,
        categoryID: path.categoryID || undefined,
        thumbnailID: path.thumbnailID || undefined,
        enrollmentCourseIDs: path.courses.map((course) => course.id).join(',') || '',
        categoryEnum: CategoryEnumUtils.getCategoryKeyFromValue(CategoryEnum.Path),
        isDeleteOldThumbnail: false,
      });
      setCourseFormData(newFormData);

      if (path.thumbnailID) {
        fileUsecase
          .getFileResouceById(path.thumbnailID)
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
  }, [path, open, fileUsecase]);

  useEffect(() => {
    if (!open) {
      setCourseFormData(
        new UpdateCoursePathRequest({ categoryEnum: CategoryEnumUtils.getCategoryKeyFromValue(CategoryEnum.Path) })
      );
      setPreviewUrl(null);
      setThumbnailSource('select');
    }
  }, [open]);

  const handleChange = <K extends keyof UpdateCoursePathRequest>(field: K, value: UpdateCoursePathRequest[K]) => {
    setCourseFormData((prev) => new UpdateCoursePathRequest({ ...prev, [field]: value }));
  };

  const handleThumbnailSourceChange = (event: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (newSource) {
      setThumbnailSource(newSource);
      if (newSource === 'upload') {
        handleChange('thumbnailID', undefined);
        setPreviewUrl(courseFormData.thumbnail ? URL.createObjectURL(courseFormData.thumbnail) : null);
      } else {
        handleChange('thumbnail', undefined);
        if (courseFormData.thumbnailID) {
          fileUsecase
            .getFileResouceById(courseFormData.thumbnailID)
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

  const handleFileSelectChange = async (id: string) => {
    handleChange('thumbnailID', id);
    if (id) {
      try {
        const file = await fileUsecase.getFileResouceById(id);
        setPreviewUrl(file.resourceUrl || null);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error has occurred.';
        CustomSnackBar.showSnackbar(message, 'error');
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
      onSubmit(courseFormData);
      setPreviewUrl('');
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

  const statusOptions = [
    { value: StatusEnum.Enable, label: 'enable' },
    { value: StatusEnum.Disable, label: 'disable' },
    { value: StatusEnum.Deleted, label: 'deleted' },
  ];

  const displayTypeOptions = [
    { value: DisplayTypeEnum.Public, label: 'public' },
    { value: DisplayTypeEnum.Private, label: 'private' },
  ];

  if (!path) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateCoursePath')}
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
            {t('id')}: {path.id}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label={t('name')}
                value={courseFormData.name}
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
                value={courseFormData.detail}
                onChange={(value) => {
                  handleChange('detail', value);
                }}
                disabled={isSubmitting}
                multiline
                rows={3}
                icon={<Note {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startTime')}
                value={courseFormData.startTime}
                onChange={(value) => {
                  handleChange('startTime', value);
                }}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endTime')}
                value={courseFormData.endTime}
                onChange={(value) => {
                  handleChange('endTime', value);
                }}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('status')}
                value={courseFormData.status ?? ''}
                onChange={(value) => {
                  handleChange('status', value);
                }}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('displayType')}
                value={courseFormData.displayType ?? ''}
                onChange={(value) => {
                  handleChange('displayType', value);
                }}
                disabled={isSubmitting}
                options={displayTypeOptions}
              />
            </Grid>
            <Grid item xs={12}>
              <CourseMultiSelectDialog
                courseUsecase={courseUsecase}
                value={
                  courseFormData.enrollmentCourseIDs
                    ? courseFormData.enrollmentCourseIDs.split(',').filter((id) => id)
                    : []
                }
                onChange={(value: string[]) => {
                  handleChange('enrollmentCourseIDs', value.join(','));
                }}
                disabled={isSubmitting}
                pathID={courseFormData.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <EnrollmentMultiSelect
                enrollmentUsecase={enrollUsecase}
                categoryEnum={CategoryEnum.Path}
                value={
                  courseFormData.enrollmentCriteriaIDs
                    ? courseFormData.enrollmentCriteriaIDs.split(',').filter((id) => id)
                    : []
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
                value={courseFormData.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Path}
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
                <ToggleButton value="select" aria-label={t('selectFromResources')}>
                  {t('selectFromResources')}
                </ToggleButton>
                <ToggleButton value="upload" aria-label={t('uploadFiles')}>
                  {t('uploadFiles')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} sm={12}>
              {thumbnailSource === 'select' ? (
                <FileResourceSelect
                  fileUsecase={fileUsecase}
                  type={FileResourceEnum.Image}
                  status={StatusEnum.Enable}
                  value={courseFormData.thumbnailID}
                  onChange={handleFileSelectChange}
                  label={t('thumbnail')}
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailDocumentNo')}
                      value={courseFormData.thumbDocumentNo}
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
                      value={courseFormData.thumbPrefixName}
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
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(courseFormData.isRequired)}
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
                    checked={Boolean(courseFormData.isDeleteOldThumbnail)}
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
    </Dialog>
  );
}
