import React, { useEffect, useState } from 'react';
import { UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { type ClassResponse } from '@/domain/models/class/response/class-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';
import { FileTypeEnum } from '@/utils/enum/file-resource-enum';
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
import { CustomTimePicker } from '@/presentation/components/core/picker/custom-time-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/shared/classes/teacher/teacher-select';
import { EnrollmentMultiSelect } from '@/presentation/components/shared/enrollment/enrollment-multi-select';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';

interface EditClassDialogProps {
  open: boolean;
  classes: ClassResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateClassRequest) => void;
}

export function UpdateClassFormDialog({ open, classes, onClose, onSubmit }: EditClassDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const { categoryUsecase, enrollUsecase, fileUsecase, classTeacherUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateClassRequest>(new UpdateClassRequest({}));
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

  const [fieldValidations, _setFieldValidations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (classes && open) {
      const newFormData = new UpdateClassRequest({
        id: classes.id || undefined,
        className: classes.className || undefined,
        classDetail: classes.classDetail || undefined,
        duration: classes.duration || undefined,
        locationID: classes.locationID || undefined,
        teacherID: classes.teacherID || undefined,
        isUpdateQrCode: false,
        // startAt: classes.startAt ? classes.startAt : undefined,
        // endAt: classes.endAt ? classes.endAt : undefined,
        // minuteLate: classes.minuteLate || undefined,
        classType:
          classes.classType !== undefined
            ? LearningModeEnum[classes.classType as keyof typeof LearningModeEnum]
            : undefined,
        meetingLink: classes.meetingLink || undefined,
        scheduleStatus:
          classes.scheduleStatus !== undefined
            ? ScheduleStatusEnum[classes.scheduleStatus as keyof typeof ScheduleStatusEnum]
            : undefined,
        enrollmentCriteriaType: CategoryEnum.Class,
        enrollmentCriteriaIDs:
          classes.classEnrollments?.map((item) => item.enrollmentCriteriaID).join(',') || undefined,
        categoryID: classes.categoryID || undefined,
        thumbnailID: classes.thumbnailID || undefined,
        resourceIDs:
          classes.fileClassRelation
            ?.map((item) => item.fileResources?.id)
            .filter((id): id is string => Boolean(id))
            .join(',') || undefined,
        categoryEnum: CategoryEnum.Class,
        isDeleteOldThumbnail: false,
      });
      setFormData(newFormData);
      setPreviewUrl(classes.thumbnail?.resourceUrl ?? null);

      setSelectedResourceIDs(
        classes.fileClassRelation?.map((item) => item.fileResources?.id).filter((id): id is string => Boolean(id)) ?? []
      );
    }
  }, [classes, open]);

  useEffect(() => {
    if (
      filePreviewData?.url &&
      filePreviewOpen &&
      !filePreviewData.type?.includes('image') &&
      !filePreviewData.type?.includes('video')
    ) {
      window.open(filePreviewData.url, '_blank', 'noopener,noreferrer');
      setFilePreviewOpen(false);
      setFilePreviewData(null);
    }
  }, [filePreviewData, filePreviewOpen]);

  useEffect(() => {
    if (!open) {
      setFormData(new UpdateClassRequest({}));
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

  const handleChange = <K extends keyof UpdateClassRequest>(field: K, value: UpdateClassRequest[K]) => {
    setFormData((prev) => new UpdateClassRequest({ ...prev, [field]: value }));
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

  const handleMultipleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    const allValid = Object.values(fieldValidations).every((v) => v);
    if (!allValid) {
      CustomSnackBar.showSnackbar('Một số trường không hợp lệ', 'error');
      return;
    }

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

      onSubmit(new UpdateClassRequest({ ...formData }));
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

  const classTypeOptions = [
    { value: LearningModeEnum.Online, label: 'online' },
    { value: LearningModeEnum.Offline, label: 'offline' },
  ];

  // const qrCodeOptions = [
  //   { value: 'true', label: 'yes' },
  //   { value: 'false', label: 'no' },
  // ];

  const scheduleStatusOptions = [
    { value: ScheduleStatusEnum.Schedule, label: 'schedule' },
    { value: ScheduleStatusEnum.Ongoing, label: 'ongoing' },
    { value: ScheduleStatusEnum.Cancelled, label: 'cancelled' },
  ];

  if (!classes) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateClass')}
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
            {t('id')}: {classes?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label={t('name')}
                value={formData.className}
                onChange={(value) => {
                  handleChange('className', value);
                }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label={t('detail')}
                value={formData.classDetail}
                onChange={(value) => {
                  handleChange('classDetail', value);
                }}
                disabled={isSubmitting}
                multiline
                rows={3}
                icon={<Article {...iconStyle} />}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('minuteLate')}
                value={formData.minuteLate?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('minuteLate', numericValue);
                }}
                disabled={isSubmitting}
                icon={<Clock {...iconStyle} />}
                inputMode="numeric"
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, minuteLate: isValid }));
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startTime')}
                value={formData.startAt ? DateTimeUtils.formatISODateToString(formData.startAt) : undefined}
                onChange={(value) => {
                  handleChange('startAt', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endAt')}
                value={formData.endAt ? DateTimeUtils.formatISODateToString(formData.endAt) : undefined}
                onChange={(value) => {
                  handleChange('endAt', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={isSubmitting}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CustomTimePicker
                label={t('selectDuration')}
                value={formData.duration}
                onChange={(value) => {
                  handleChange('duration', value);
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('scheduleStatus')}
                value={formData.scheduleStatus ?? ''}
                onChange={(value) => {
                  handleChange('scheduleStatus', value);
                }}
                disabled={isSubmitting}
                options={scheduleStatusOptions}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Class}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('classType')}
                value={formData.classType ?? ''}
                onChange={(value) => {
                  handleChange('classType', value);
                }}
                disabled={isSubmitting}
                options={classTypeOptions}
              />
            </Grid>

            {formData.classType === LearningModeEnum.Online && (
              <Grid item xs={12}>
                <CustomTextField
                  label={t('meetingLink')}
                  value={formData.meetingLink}
                  onChange={(val) => {
                    handleChange('meetingLink', val);
                  }}
                  disabled={false}
                  sx={{ '& .MuiInputBase-root': { height: fullScreen ? '100%' : 'auto' } }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <EnrollmentMultiSelect
                enrollmentUsecase={enrollUsecase}
                categoryEnum={CategoryEnum.Class}
                value={
                  formData.enrollmentCriteriaIDs ? formData.enrollmentCriteriaIDs.split(',').filter((id) => id) : []
                }
                onChange={(value: string[]) => {
                  handleChange('enrollmentCriteriaIDs', value.join(','));
                }}
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
                <ToggleButton value="multi-select">{t('selectFromResources')}</ToggleButton>
                <ToggleButton value="upload">{t('uploadFiles')}</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {fileSelectSource === 'multi-select' ? (
              <Grid item xs={12}>
                <FileResourceMultiSelect
                  fileUsecase={fileUsecase}
                  type={FileTypeEnum.Image}
                  value={selectedResourceIDs}
                  onChange={(ids) => {
                    setSelectedResourceIDs(ids);
                  }}
                  disabled={false}
                  showTypeSwitcher={true}
                  allowAllTypes={true}
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
                    const file = classes?.fileClassRelation?.find((f) => f.fileResources?.id === id)?.fileResources;
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
                  {t('uploadFiles')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} sm={12}>
              {thumbnailSource === 'select' ? (
                <FileResourceSelect
                  fileUsecase={fileUsecase}
                  type={FileTypeEnum.Image}
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
                    alt={t('thumbnailPreview')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
            ) : null}

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isUpdateQrCode === true}
                    onChange={(e) => {
                      handleChange('isUpdateQrCode', e.target.checked);
                    }}
                    disabled={isSubmitting}
                  />
                }
                label={t('isUpdateQrCode')}
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
