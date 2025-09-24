import React, { useEffect, useState } from 'react';
import { ApiResponse } from '@/domain/models/core/api-response';
import { UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, LearningModeEnum, StatusEnum } from '@/utils/enum/core-enum';
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
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Article, Image as ImageIcon, Tag } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import { QuizMultiSelect } from '@/presentation/components/shared/quiz/quiz/quiz-multi-select';

import { CustomSelectDropDown } from '../../../core/drop-down/custom-select-drop-down';
import CustomSnackBar from '../../../core/snack-bar/custom-snack-bar';
import { CustomTextField } from '../../../core/text-field/custom-textfield';

interface EditLessonDialogProps {
  open: boolean;
  data: LessonDetailResponse | null;
  onClose: () => void;
  onSubmit: (request: UpdateLessonRequest, options?: { suppressSuccessMessage?: boolean }) => Promise<ApiResponse>;
  onSuccess?: () => void;
}

export function UpdateLessonFormDialog({ open, data: lesson, onClose, onSubmit, onSuccess }: EditLessonDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryUsecase, fileUsecase, quizUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateLessonRequest>(new UpdateLessonRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');
  const [videoSource, setVideoSource] = useState<'upload' | 'select'>('select');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    async function setupFormData() {
      if (lesson && open) {
        let videoFile: File | undefined;

        if (lesson.video?.resourceUrl && !formData.videoChunk) {
          try {
            const fetchedFile = await urlToFile(lesson.video.resourceUrl, lesson.video.name ?? '');
            if (fetchedFile) {
              videoFile = fetchedFile;
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
              ? LearningModeEnum[lesson.lessonType as keyof typeof LearningModeEnum]
              : undefined,
          quizIDs: lesson?.quizzes !== undefined ? lesson?.quizzes?.map((quiz) => quiz.id).join(',') : undefined,
          categoryID: lesson.categoryID,
          thumbnailID: lesson.thumbnailID,
          categoryEnum: CategoryEnum[CategoryEnum.Lesson],
          isDeleteOldThumbnail: false,
          videoID: lesson.videoID,
          videoChunk: videoFile,
          uploadID: lesson.id,
        });

        setFormData(newFormData);
        setPreviewUrl(lesson.thumbnail?.resourceUrl ?? null);
        setVideoPreviewUrl(lesson.video?.resourceUrl ?? null);
        setSelectedVideoId(lesson.video?.id ?? null);
        setUploadProgress(0);
        setTotalChunks(0);
        setCurrentChunkIndex(0);
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
    } else {
      if (formData.thumbnailID) {
        fileUsecase
          .getFileResouceById(formData.thumbnailID)
          .then((file) => setPreviewUrl(file.resourceUrl || null))
          .catch(() => setPreviewUrl(null));
      } else {
        setPreviewUrl(null);
      }
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
        setCurrentChunkIndex(0);
        setUploadProgress(0);
      }
    } else {
      // Khi quay lại select, restore lại videoID từ selectedVideoId
      setFormData(
        (prev) => new UpdateLessonRequest({ ...prev, videoChunk: undefined, videoID: selectedVideoId ?? undefined })
      );

      if (selectedVideoId) {
        fileUsecase
          .getFileResouceById(selectedVideoId)
          .then((file) => setVideoPreviewUrl(file.resourceUrl || null))
          .catch(() => setVideoPreviewUrl(null));
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
      setCurrentChunkIndex(0);
      setUploadProgress(0);
      setVideoPreviewUrl(URL.createObjectURL(file));
    } else {
      setVideoPreviewUrl(null);
      setTotalChunks(0);
      setUploadProgress(0);
      setCurrentChunkIndex(0);
    }
  };

  const handleThumbnailSelectChange = async (id: string) => {
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

  const handleVideoSelectChange = async (id: string) => {
    handleChange('videoID', id);
    if (id) {
      try {
        const file = await fileUsecase.getFileResouceById(id);
        setVideoPreviewUrl(file.resourceUrl || null);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error has occurred.';
        CustomSnackBar.showSnackbar(message, 'error');
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
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSave = async () => {
    if (!formData || !formData.id || !formData.name) {
      CustomSnackBar.showSnackbar(!formData ? t('formDataMissing') : t('requiredFieldsMissing'), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      let lastResponse: ApiResponse | null = null;

      // thumbnail
      const thumbnailPayload =
        thumbnailSource === 'upload'
          ? { ...formData, thumbnailID: undefined, thumbnail: thumbnailFile ?? undefined }
          : { ...formData, thumbnail: undefined };

      // video
      if (videoSource === 'upload' && videoFile) {
        // upload video by chunk
        const chunkSize = 5 * 1024 * 1024;
        const totalChunks = Math.ceil(videoFile.size / chunkSize);

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize, videoFile.size);
          const chunk = videoFile.slice(start, end);
          const chunkFile = new File([chunk], videoFile.name, { type: videoFile.type });

          const chunkRequest = new UpdateLessonRequest({
            ...thumbnailPayload,
            videoChunk: chunkFile,
            chunkIndex,
            totalChunks,
          });

          const response = await onSubmit(chunkRequest, {
            suppressSuccessMessage: chunkIndex < totalChunks - 1,
          });

          setCurrentChunkIndex(chunkIndex + 1);
          setUploadProgress(((chunkIndex + 1) / totalChunks) * 100);
          lastResponse = response;

          if (chunkIndex === totalChunks - 1 && lastResponse) {
            setUploadProgress(0);
            setTotalChunks(0);
            setCurrentChunkIndex(0);
            onClose();
          }
        }
      } else {
        // select video
        const request = new UpdateLessonRequest({
          ...thumbnailPayload,
          videoChunk: undefined,
          videoID: videoSource === 'select' ? formData.videoID : undefined,
        });

        const response = await onSubmit(request, { suppressSuccessMessage: false });
        lastResponse = response;

        if (lastResponse) {
          setUploadProgress(0);
          setTotalChunks(0);
          setCurrentChunkIndex(0);
          onClose();
        }
      }
    } catch (error) {
      console.error(error);
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
      setCurrentChunkIndex(0);
      setThumbnailSource('select');
      setVideoSource('select');
    }
  }, [open]);

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  const lessonTypeOptions = [
    { value: LearningModeEnum.Online, label: 'online' },
    { value: LearningModeEnum.Offline, label: 'offline' },
  ];

  const statusTypeOptions = [
    { value: StatusEnum.Enable, label: 'enable' },
    { value: StatusEnum.Disable, label: 'disable' },
    { value: StatusEnum.Deleted, label: 'deleted' },
  ];

  const booleanOptions = [
    { value: 'true', label: 'yes' },
    { value: 'false', label: 'no' },
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
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('lessonType')}
                value={formData.lessonType ?? ''}
                onChange={(value) => {
                  handleChange('lessonType', value);
                }}
                disabled={isSubmitting}
                options={lessonTypeOptions}
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
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Lesson}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <QuizMultiSelect
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
                label={t('required')}
                value={String(formData.isRequired ?? '')}
                onChange={(value) => {
                  handleChange('isRequired', value === 'true');
                }}
                disabled={isSubmitting}
                options={booleanOptions}
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
                  type={FileResourceEnum.Image}
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
                  type={FileResourceEnum.Video}
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
            disabled={isSubmitting || !formData.id || !formData.name} // Disable if required fields are missing
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
