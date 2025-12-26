import React, { useEffect, useState } from 'react';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CategoryEnum, LessonContentEnum, LessonTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
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
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Article, Image as ImageIcon, Tag } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomEmployeeDistinctSelectInForm } from '@/presentation/components/core/drop-down/custom-employee-distinct-select-in-form';
import { CustomSelectDropDownNullable } from '@/presentation/components/core/drop-down/custom-select-drop-down-nullable';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';
import { QuizMultiSelectAndCreateDialog } from '@/presentation/components/shared/quiz/quiz/quiz-multi-select-and-create-form';

import { CustomSelectDropDown } from '../../../core/drop-down/custom-select-drop-down';
import CustomSnackBar from '../../../core/snack-bar/custom-snack-bar';
import { CustomTextField } from '../../../core/text-field/custom-textfield';

interface EditIndependentLessonDialogProps {
  open: boolean;
  data: LessonDetailResponse | null;
  onClose: () => void;
  onSubmit: (request: UpdateLessonRequest, options?: { suppressSuccessMessage?: boolean }) => Promise<ApiResponse>;
  onSuccess?: () => void;
}

export function UpdateIndependentLessonFormDialog({
  open,
  data: lesson,
  onClose,
  onSubmit,
  onSuccess,
}: EditIndependentLessonDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryUsecase, fileUsecase, quizUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateLessonRequest>(new UpdateLessonRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);

  //video
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<'upload' | 'select'>('select');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  // const [_currentChunkIndex, setCurrentChunkIndex] = useState(0);

  //thumbnail
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');

  //resource
  const [resourceSource, setResourceSource] = useState<'upload' | 'select'>('select');
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewData, setFilePreviewData] = useState<{
    url: string;
    title?: string;
    type?: string;
  } | null>(null);

  useEffect(() => {
    async function setupFormData() {
      if (lesson && open) {
        if (lesson.video?.resourceUrl && !formData.videoChunk) {
          try {
            const fetchedFile = await urlToFile(lesson.video.resourceUrl, lesson.video.name ?? '');
            if (fetchedFile) {
              setVideoFile(fetchedFile);
            }
          } catch (error) {
            CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to fetch video file', 'error');
          }
        }

        const newFormData = new UpdateLessonRequest({
          id: lesson.id || '',
          name: lesson.name || '',
          detail: lesson.detail,
          enablePlay: lesson.enablePlay,
          isRequired: lesson.isRequired,
          status: lesson.status !== undefined ? StatusEnum[lesson.status as keyof typeof StatusEnum] : undefined,
          lessonType:
            lesson.lessonType !== undefined
              ? LessonTypeEnum[lesson.lessonType as keyof typeof LessonTypeEnum]
              : undefined,
          contentType:
            lesson.contentType !== undefined
              ? LessonContentEnum[lesson.contentType as keyof typeof LessonContentEnum]
              : undefined,
          quizIDs: lesson?.quizzes !== undefined ? lesson?.quizzes?.map((quiz) => quiz.id).join(',') : undefined,
          categoryID: lesson.categoryID,
          thumbnailID: lesson.thumbnailID,
          categoryEnum: CategoryEnum.Lesson,
          isDeleteOldThumbnail: false,
          videoID: lesson.videoID,
          videoChunk: videoFile ?? undefined,
          resources: resourceFiles ?? undefined,
          resourceIDs:
            lesson.fileLessonRelation
              ?.map((item) => item.fileResourceId)
              .filter((id): id is string => Boolean(id))
              .join(',') || undefined,
          uploadID: lesson.id,
          isFixedLesson: lesson.isFixedLesson,
          startDate: DateTimeUtils.formatISODateToString(lesson.startDate),
          endDate: DateTimeUtils.formatISODateToString(lesson.endDate),
          fixedLessonDayDuration: lesson.fixedLessonDayDuration,
          positionCode: lesson.positionCode,
          positionStateCode: lesson.positionStateCode,
          departmentTypeCode: lesson.departmentTypeCode,
        });

        setFormData(newFormData);
        setPreviewUrl(lesson.thumbnail?.resourceUrl ?? null);
        setVideoPreviewUrl(lesson.video?.resourceUrl ?? null);
        setSelectedVideoId(lesson.video?.id ?? null);
        setUploadProgress(0);
        setTotalChunks(0);
        // setCurrentChunkIndex(0);
        setSelectedResourceIds(
          lesson.fileLessonRelation?.map((item) => item.fileResourceId).filter((id): id is string => Boolean(id)) ?? []
        );
      }
    }
    void setupFormData();
  }, [lesson, open, fileUsecase]);

  async function urlToFile(url: string, filename: string): Promise<File | null> {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      return null;
    }
  }

  const handleChange = <K extends keyof UpdateLessonRequest>(field: K, value: UpdateLessonRequest[K]) => {
    setFormData((prev) => {
      const newData = new UpdateLessonRequest({ ...prev, [field]: value });
      return newData;
    });
  };

  const handleThumbnailSourceChange = (_: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (!newSource) return;
    setThumbnailSource(newSource);

    if (newSource === 'upload') {
      if (thumbnailFile) {
        setPreviewUrl(URL.createObjectURL(thumbnailFile));
      } else {
        setPreviewUrl(null);
      }
    } else if (formData.thumbnailID) {
      fileUsecase
        .getFileResourceById(formData.thumbnailID)
        .then((file) => {
          setPreviewUrl(file.resourceUrl || null);
        })
        .catch(() => {
          setPreviewUrl(null);
        });
    } else {
      setPreviewUrl(null);
    }
  };

  const handleVideoSourceChange = (_: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (!newSource) return;
    setVideoSource(newSource);

    if (newSource === 'upload') {
      // Lưu lại videoID trước khi bỏ
      setSelectedVideoId(formData.videoID ?? null);

      // Khi chuyển sang upload, bỏ videoID khỏi formData
      setFormData((prev) => new UpdateLessonRequest({ ...prev, videoID: undefined }));

      if (videoFile) {
        const url = URL.createObjectURL(videoFile);
        setVideoPreviewUrl(url);

        const chunkSize = 5 * 1024 * 1024; // 5 MB
        const calculatedTotalChunks = Math.ceil(videoFile.size / chunkSize);
        setTotalChunks(calculatedTotalChunks);
        // setCurrentChunkIndex(0);
        setUploadProgress(0);
      }
    } else {
      // Khi quay lại select, restore lại videoID từ selectedVideoId
      setFormData(
        (prev) => new UpdateLessonRequest({ ...prev, videoChunk: undefined, videoID: selectedVideoId ?? undefined })
      );

      if (selectedVideoId) {
        fileUsecase
          .getFileResourceById(selectedVideoId)
          .then((file) => {
            setVideoPreviewUrl(file.resourceUrl || null);
          })
          .catch(() => {
            setVideoPreviewUrl(null);
          });
      } else {
        setVideoPreviewUrl(null);
      }
    }
  };

  const handleVideoUpload = (file: File | null) => {
    setVideoFile(file);
    if (file) {
      const chunkSize = 5 * 1024 * 1024; // 5 MB
      const calculatedTotalChunks = Math.ceil(file.size / chunkSize);
      setTotalChunks(calculatedTotalChunks);
      // setCurrentChunkIndex(0);
      setUploadProgress(0);
      setVideoPreviewUrl(URL.createObjectURL(file));
    } else {
      setVideoPreviewUrl(null);
      setTotalChunks(0);
      setUploadProgress(0);
      // setCurrentChunkIndex(0);
    }
  };

  const handleThumbnailSelectChange = async (id: string) => {
    const newId = id === '' ? undefined : id;

    handleChange('thumbnailID', newId);
    if (id) {
      try {
        const file = await fileUsecase.getFileResourceById(id);
        setPreviewUrl(file.resourceUrl || null);
      } catch (error: unknown) {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleVideoSelectChange = async (id: string) => {
    const newId = id === '' ? undefined : id;

    handleChange('videoID', newId);
    if (id) {
      try {
        const file = await fileUsecase.getFileResourceById(id);
        setVideoPreviewUrl(file.resourceUrl || null);
      } catch (error: unknown) {
        setVideoPreviewUrl(null);
      }
    } else {
      setVideoPreviewUrl(null);
    }
  };

  const handleFileUpload = (file: File | null) => {
    setThumbnailFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      handleChange('thumbnail', file);
    } else {
      setPreviewUrl(null);
      handleChange('thumbnail', undefined);
    }
  };

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

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

  const handleSave = async () => {
    if (!formData?.id || !formData.name) {
      CustomSnackBar.showSnackbar(!formData ? t('formDataMissing') : t('requiredFieldsMissing'), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      let lastResponse: ApiResponse | null = null;

      // thumbnail
      if (thumbnailSource === 'upload') {
        formData.thumbnailID = undefined;
      } else {
        formData.thumbnail = undefined;
      }

      if (resourceSource === 'upload') {
        formData.resourceIDs = undefined;
        formData.resources = resourceFiles;
      } else {
        formData.resources = undefined;
        formData.resourceIDs = selectedResourceIds.join(',');
      }

      // video
      if (videoSource === 'upload' && videoFile && formData.contentType === LessonContentEnum.Video) {
        // upload video by chunk
        const chunkSize = 5 * 1024 * 1024;
        const totalChunksCount = Math.ceil(videoFile.size / chunkSize);

        for (let chunkIndex = 0; chunkIndex < totalChunksCount; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize, videoFile.size);
          const chunk = videoFile.slice(start, end);
          const chunkFile = new File([chunk], videoFile.name, { type: videoFile.type });

          const chunkRequest = new UpdateLessonRequest({
            ...formData,
            videoChunk: chunkFile,
            chunkIndex,
            totalChunks: totalChunksCount,
          });

          const response = await onSubmit(chunkRequest, {
            suppressSuccessMessage: chunkIndex < totalChunksCount - 1,
          });

          // setCurrentChunkIndex(chunkIndex + 1);
          setUploadProgress(((chunkIndex + 1) / totalChunksCount) * 100);
          lastResponse = response;

          if (chunkIndex === totalChunksCount - 1 && lastResponse) {
            setUploadProgress(0);
            setTotalChunks(0);
            // setCurrentChunkIndex(0);
            onClose();
          }
        }
      } else {
        // select video
        // const request = new UpdateLessonRequest({
        //   ...thumbnailPayload,
        //   videoChunk: undefined,
        //   videoID: videoSource === 'select' ? formData.videoID : undefined,
        // });

        formData.videoChunk = undefined;
        formData.videoID = videoSource === 'select' ? formData.videoID : undefined;

        const response = await onSubmit(formData, { suppressSuccessMessage: false });
        lastResponse = response;

        if (lastResponse) {
          setUploadProgress(0);
          setTotalChunks(0);
          // setCurrentChunkIndex(0);
          onClose();
        }
      }
    } catch (error) {
      return;
    } finally {
      if (onSuccess) onSuccess();
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isSubmitting) {
      intervalId = setInterval(() => {
        CustomSnackBar.showSnackbar('Still waiting for server...', 'info');
      }, 120000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isSubmitting]);

  useEffect(() => {
    if (!open) {
      setFormData(new UpdateLessonRequest({}));
      setPreviewUrl(null);
      setVideoPreviewUrl(null);
      setUploadProgress(0);
      setTotalChunks(0);
      // setCurrentChunkIndex(0);
      setThumbnailSource('select');
      setVideoSource('select');
      setSelectedResourceIds([]);
      setFilePreviewOpen(false);
      setFilePreviewData(null);
    }
  }, [open]);

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  // const lessonTypeOptions = [
  //   { value: LessonTypeEnum.Online, label: 'online' },
  //   { value: LessonTypeEnum.Offline, label: 'offline' },
  // ];

  const statusTypeOptions = [
    { value: StatusEnum.Enable, label: 'enable' },
    { value: StatusEnum.Disable, label: 'disable' },
    { value: StatusEnum.Deleted, label: 'deleted' },
  ];

  const booleanOptionsNullable: { value: boolean | null; label: string }[] = [
    { value: true, label: 'yes' },
    { value: false, label: 'no' },
  ];

  if (!lesson) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateLessons')}
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
            {t('id')}: {lesson?.id}
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

            {/* <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('lessonType')}
                value={formData.lessonType ?? ''}
                onChange={(value) => {
                  handleChange('lessonType', value);
                }}
                disabled={isSubmitting}
                options={lessonTypeOptions}
              />
            </Grid> */}

            {/* <Grid item xs={12}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Lesson}
                disabled={isSubmitting}
              />
            </Grid> */}

            <Grid item xs={12}>
              <QuizMultiSelectAndCreateDialog
                quizUsecase={quizUsecase}
                value={formData.quizIDs ? formData.quizIDs.split(',').filter((id) => id) : []}
                onChange={(val) => {
                  handleChange('quizIDs', val.join(','));
                }}
                disabled={isSubmitting}
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
                options={statusTypeOptions}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('required')}
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

            {/* <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('enablePlay')}
                value={formData.enablePlay ?? false}
                onChange={(value) => {
                  handleChange('enablePlay', value);
                }}
                disabled={isSubmitting}
                options={[
                  { value: true, label: t('yes') },
                  { value: false, label: t('no') },
                ]}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDownNullable<boolean>
                label={t('isFixedLesson')}
                value={formData.isFixedLesson}
                onChange={(value) => handleChange('isFixedLesson', value ?? undefined)}
                options={booleanOptionsNullable}
                allowEmpty={false}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">{t('duration')}</Typography>
            </Grid>

            {formData.isFixedLesson === true ? (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label={t('durationInDaysForThisPart')}
                  value={formData.fixedLessonDayDuration?.toString() ?? ''}
                  onChange={(val) => {
                    const num =
                      val === '' ? undefined : /^\d+$/.test(val) ? Number(val) : formData.fixedLessonDayDuration;
                    handleChange('fixedLessonDayDuration', num);
                  }}
                  required
                  inputMode="numeric"
                  patternError={t('onlyPositiveIntegerError')}
                />
              </Grid>
            ) : (
              <div></div>
            )}

            {formData.isFixedLesson === false ? (
              <>
                <Grid item xs={12} sm={6}>
                  <CustomDateTimePicker
                    label={t('startTime')}
                    value={formData.startDate ? DateTimeUtils.formatISODateToString(formData.startDate) : undefined}
                    onChange={(value) => handleChange('startDate', value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomDateTimePicker
                    label={t('endDate')}
                    value={formData.endDate ? DateTimeUtils.formatISODateToString(formData.endDate) : undefined}
                    onChange={(value) => handleChange('endDate', value)}
                  />
                </Grid>
              </>
            ) : (
              <div></div>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('employeeFilters')}
              </Typography>
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

            <Grid item xs={12}>
              <Typography variant="h6">{t('updateThumbnail')}</Typography>
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
                <ToggleButton value="upload" aria-label={t('uploadFile')}>
                  {t('uploadFile')}
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
                  onChange={handleThumbnailSelectChange}
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

            {previewUrl || lesson.thumbnail?.resourceUrl ? (
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
                    src={previewUrl ?? lesson.thumbnail?.resourceUrl ?? ''}
                    alt={t('thumbnailPreview')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
            ) : null}

            <Grid item xs={12}>
              <Typography variant="h6">{t('updateResources')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomSelectDropDown<LessonContentEnum>
                label={t('contentType')}
                value={(formData.contentType as LessonContentEnum) ?? ''}
                onChange={(val) => {
                  handleChange('contentType', val);
                }}
                options={[
                  { value: LessonContentEnum.PDF, label: 'pdf' },
                  { value: LessonContentEnum.Video, label: 'video' },
                ]}
              />
            </Grid>

            {formData.contentType === LessonContentEnum.Video ? (
              <>
                {' '}
                <Grid item xs={12}>
                  <Typography variant="h6">{t('updateVideo')}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <ToggleButtonGroup
                    value={videoSource}
                    exclusive
                    onChange={handleVideoSourceChange}
                    aria-label={t('videoSource')}
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
                  {videoSource === 'select' ? (
                    <FileResourceSelect
                      fileUsecase={fileUsecase}
                      type={FileTypeEnum.Video}
                      status={StatusEnum.Enable}
                      value={formData.videoID}
                      onChange={handleVideoSelectChange}
                      label={t('video')}
                      disabled={isSubmitting}
                    />
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          label={t('videoDocumentNo')}
                          value={formData.videoDocumentNo}
                          onChange={(value) => {
                            handleChange('videoDocumentNo', value);
                          }}
                          disabled={isSubmitting}
                          icon={<ImageIcon {...iconStyle} />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          label={t('videoPrefixName')}
                          value={formData.videoPrefixName}
                          onChange={(value) => {
                            handleChange('videoPrefixName', value);
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
                          {t('uploadVideo')}
                          <input
                            type="file"
                            hidden
                            accept="video/*"
                            onChange={(e) => {
                              handleVideoUpload(e.target.files?.[0] || null);
                            }}
                          />
                        </Button>
                      </Grid>
                      {totalChunks > 0 && (
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,

                              textAlign: 'center',
                            }}
                          >
                            <Box sx={{ position: 'relative', height: 24 }}>
                              {/* Thanh progress */}
                              <LinearProgress
                                variant="determinate"
                                value={uploadProgress}
                                sx={{
                                  height: 24,
                                  borderRadius: 12,
                                  [`& .MuiLinearProgress-bar`]: {
                                    borderRadius: 12,
                                    backgroundColor:
                                      uploadProgress < 100 ? theme.palette.primary.main : theme.palette.secondary.main,
                                  },
                                  // backgroundColor: theme.palette.grey[300],
                                }}
                              />

                              <Typography
                                variant="body2"
                                sx={{
                                  position: 'absolute',
                                  inset: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 600,
                                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                }}
                              >
                                {Math.round(uploadProgress)}%
                              </Typography>
                            </Box>
                          </Box>

                          {/* CSS keyframes cho gradient */}
                          <style>
                            {`
        @keyframes moveGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}
                          </style>
                        </Grid>
                      )}
                    </Grid>
                  )}
                </Grid>
                {videoPreviewUrl || lesson.video?.resourceUrl ? (
                  <Grid item xs={12}>
                    <CustomVideoPlayer src={videoPreviewUrl ?? lesson.video?.resourceUrl ?? ''} fullscreen />
                  </Grid>
                ) : null}
              </>
            ) : (
              <></>
            )}

            <Grid item xs={12}>
              <Typography variant="h6">{t('selectResources')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <ToggleButtonGroup
                value={resourceSource}
                exclusive
                onChange={(_, newSource: 'upload' | 'select') => {
                  if (newSource) setResourceSource(newSource);
                }}
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
            <Grid item xs={12}>
              {resourceSource === 'select' ? (
                <FileResourceMultiSelect
                  fileUsecase={fileUsecase}
                  // type={FileTypeEnum.PDF}
                  status={StatusEnum.Enable}
                  value={selectedResourceIds}
                  onChange={(val) => {
                    setSelectedResourceIds(val);
                  }}
                  label={t('resources')}
                  disabled={isSubmitting}
                  showTypeSwitcher
                  allowAllTypes
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('resourceDocumentNo')}
                      value={formData.resourceDocumentNo}
                      onChange={(value) => {
                        handleChange('resourceDocumentNo', value);
                      }}
                      disabled={isSubmitting}
                      icon={<ImageIcon {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('resourcePrefixName')}
                      value={formData.resourcePrefixName}
                      onChange={(value) => {
                        handleChange('resourcePrefixName', value);
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
                      {t('uploadResources')}
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="*/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          setResourceFiles(files);
                        }}
                      />
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>

            {formData.resourceIDs && formData.resourceIDs.length > 0 && resourceSource === 'select' ? (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  {t('selectedFiles')}
                </Typography>
                <Grid container spacing={1} direction="column">
                  {formData.resourceIDs.split(',').map((id) => {
                    const file = lesson?.fileLessonRelation?.find((f) => f.fileResourceId === id)?.fileResources;
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

            {resourceFiles.length > 0 && resourceSource === 'upload' && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  {t('uploadedFiles')}
                </Typography>
                <Grid container spacing={1} direction="column">
                  {resourceFiles.map((file, index) => (
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
            disabled={isSubmitting || !formData.id || !formData.name}
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
