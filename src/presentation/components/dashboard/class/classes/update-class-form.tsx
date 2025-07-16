import { useEffect, useState } from 'react';
import { UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { ClassResponse } from '@/domain/models/class/response/class-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import {
  CategoryEnum,
  CategoryEnumUtils,
  DisplayTypeEnum,
  LearningModeEnum,
  ScheduleStatusEnum,
  StatusEnum,
} from '@/utils/enum/core-enum';
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
import { Article, Calendar, Image as ImageIcon, Note, QrCode, Tag } from '@phosphor-icons/react';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTimePicker } from '@/presentation/components/core/picker/custom-time-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/shared/classes/teacher/teacher-select';
import { EnrollmentSelect } from '@/presentation/components/shared/enrollment/enrollment-select';
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
  const { categoryUsecase, lessonUsecase, enrollUsecase, fileUsecase, classTeacherUsecase } = useDI();

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

  const [fieldValidations, setFieldValidations] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (classes && open) {
      const newFormData = new UpdateClassRequest({
        id: classes.id || undefined,
        className: classes.className || undefined,
        classDetail: classes.classDetail || undefined,
        duration: classes.duration || undefined,
        locationID: classes.locationID || undefined,
        teacherID: classes.teacherID || undefined,
        qrCodeURL: classes.qrCodeURL || undefined,
        startAt: classes.startAt ? classes.startAt : undefined,
        endAt: classes.endAt ? classes.endAt : undefined,
        minuteLate: classes.minuteLate || undefined,
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
        enrollmentCriteriaIDs: classes.enrollmentCriteria?.map((item) => item.id).join(',') || undefined,
        categoryID: classes.categoryID || undefined,
        thumbnailID: classes.thumbnailID || undefined,
        resourceIDs:
          classes.fileClassRelation
            ?.map((item) => item.fileResources?.id)
            .filter((id): id is string => !!id)
            .join(',') || undefined,
        categoryEnum: CategoryEnum.Class,
        isDeleteOldThumbnail: false,
      });
      setFormData(newFormData);
    }
  }, [classes, open, fileUsecase]);

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

  const handleChange = <K extends keyof UpdateClassRequest>(field: K, value: UpdateClassRequest[K]) => {
    setFormData((prev) => new UpdateClassRequest({ ...prev, [field]: value }));
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
      const allValid = Object.values(fieldValidations).every((v) => v !== false);
      if (!allValid) {
        CustomSnackBar.showSnackbar('Một số trường không hợp lệ', 'error');
        return;
      }

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

  const classTypeOptions = [
    { value: LearningModeEnum.Online, label: 'Online' },
    { value: LearningModeEnum.Offline, label: 'Offline' },
  ];

  const scheduleStatusOptions = [
    { value: ScheduleStatusEnum.Schedule, label: 'Schedule' },
    { value: ScheduleStatusEnum.Ongoing, label: 'Ongoing' },
    { value: ScheduleStatusEnum.Cancelled, label: 'Cancelled' },
  ];

  const statusOptions = [
    { value: StatusEnum.Enable, label: 'Enable' },
    { value: StatusEnum.Disable, label: 'Disable' },
    { value: StatusEnum.Deleted, label: 'Deleted' },
  ];

  const displayTypeOptions = [
    { value: DisplayTypeEnum.Public, label: 'Public' },
    { value: DisplayTypeEnum.Private, label: 'Private' },
  ];

  if (!classes) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update Class
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
            ID: {classes?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label="Name"
                value={formData.className}
                onChange={(value) => handleChange('className', value)}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="Detail"
                value={formData.classDetail}
                onChange={(value) => handleChange('classDetail', value)}
                disabled={isSubmitting}
                multiline
                rows={3}
                icon={<Article {...iconStyle} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="qrCodeURL"
                value={formData.qrCodeURL}
                onChange={(value) => handleChange('qrCodeURL', value)}
                disabled={isSubmitting}
                icon={<QrCode {...iconStyle} />}
                inputMode="url"
                onValidationChange={(isValid) => setFieldValidations((prev) => ({ ...prev, qrCodeURL: isValid }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Minute Late"
                value={formData.minuteLate?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('minuteLate', numericValue);
                }}
                disabled={isSubmitting}
                icon={<QrCode {...iconStyle} />}
                inputMode="numeric"
                onValidationChange={(isValid) => setFieldValidations((prev) => ({ ...prev, minuteLate: isValid }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Start Time"
                value={formData.startAt ? DateTimeUtils.formatISODateToString(formData.startAt) : undefined}
                onChange={(value) => handleChange('startAt', DateTimeUtils.parseLocalDateTimeString(value))}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="End Time"
                value={formData.endAt ? DateTimeUtils.formatISODateToString(formData.endAt) : undefined}
                onChange={(value) => handleChange('endAt', DateTimeUtils.parseLocalDateTimeString(value))}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTimePicker
                label="Select Duration"
                value={formData.duration}
                onChange={(value) => handleChange('duration', value)}
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="classType"
                value={formData.classType ?? ''}
                onChange={(value) => handleChange('classType', value as LearningModeEnum)}
                disabled={isSubmitting}
                options={classTypeOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="scheduleStatus"
                value={formData.scheduleStatus ?? ''}
                onChange={(value) => handleChange('scheduleStatus', value as ScheduleStatusEnum)}
                disabled={isSubmitting}
                options={scheduleStatusOptions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <EnrollmentSelect
                enrollmentUsecase={enrollUsecase}
                categoryEnum={CategoryEnum.Class}
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
                categoryEnum={CategoryEnum.Class}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <ClassTeacherSelectDialog
                classUsecase={classTeacherUsecase}
                value={formData.teacherID ?? ''}
                onChange={(value) => handleChange('teacherID', value)}
                disabled={isSubmitting}
              />
            </Grid>
            {/* <Grid item xs={12} sm={12}>
              <FileResourceMultiSelect
                fileUsecase={fileUsecase}
                // type={FileResourceEnum.Image}
                value={formData.resourceIDs ? formData.resourceIDs.split(',').filter((id) => id.trim() !== '') : []}
                onChange={(ids) => handleChange('resourceIDs', ids.join(','))}
                label="Select Files"
                disabled={false}
                showTypeSwitcher={true}
                allowAllTypes={true}
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
                    const file = classes?.fileClassRelation?.find((f) => f.fileResources?.id === id)?.fileResources;
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
