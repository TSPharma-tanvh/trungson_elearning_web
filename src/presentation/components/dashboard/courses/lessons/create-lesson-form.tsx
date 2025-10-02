import React, { useEffect, useState } from 'react';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
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
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { Article, Image as ImageIcon, Tag } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';

import { CustomButton } from '../../../core/button/custom-button';
import CustomSnackBar from '../../../core/snack-bar/custom-snack-bar';
import { CustomTextField } from '../../../core/text-field/custom-textfield';

interface CreateLessonFormProps {
  disabled?: boolean;
  onSubmit: (data: CreateLessonRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateLessonDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateLessonFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const { fileUsecase, categoryUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');
  const [videoSource, setVideoSource] = useState<'upload' | 'select'>('select');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [_currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<CreateLessonRequest>(
    new CreateLessonRequest({
      name: '',
      detail: '',
      enablePlay: true,
      isRequired: true,
      status: StatusEnum.Enable,
      lessonType: LearningModeEnum.Online,
      categoryEnum: CategoryEnum.Lesson,
    })
  );

  const handleChange = <K extends keyof CreateLessonRequest>(key: K, value: CreateLessonRequest[K]) => {
    setForm((prev) => new CreateLessonRequest({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const updateRows = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const aspectRatio = windowWidth / windowHeight;

      let otherElementsHeight = 300;
      if (windowHeight < 600) otherElementsHeight = 250;
      else if (windowHeight > 1000) otherElementsHeight = 350;

      const rowHeight = aspectRatio > 1.5 ? 22 : 24;
      const availableHeight = windowHeight - otherElementsHeight;
      const calculatedRows = Math.max(3, Math.floor(availableHeight / rowHeight));

      setDetailRows(fullScreen ? calculatedRows : 3);
    };

    updateRows();
    window.addEventListener('resize', updateRows);
    return () => {
      window.removeEventListener('resize', updateRows);
    };
  }, [fullScreen]);

  const handleThumbnailSourceChange = (_: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (!newSource) return;
    setThumbnailSource(newSource);

    if (newSource === 'upload') {
      if (thumbnailFile) {
        setPreviewUrl(URL.createObjectURL(thumbnailFile));
      } else {
        setPreviewUrl(null);
      }
    } else if (form.thumbnailID) {
      fileUsecase
        .getFileResouceById(form.thumbnailID)
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
      setSelectedVideoId(form.videoID ?? null);

      // Khi chuyển sang upload, bỏ videoID khỏi formData
      setForm((prev) => new CreateLessonRequest({ ...prev, videoID: undefined }));

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
      setForm(
        (prev) => new CreateLessonRequest({ ...prev, videoChunk: undefined, videoID: selectedVideoId ?? undefined })
      );

      if (selectedVideoId) {
        fileUsecase
          .getFileResouceById(selectedVideoId)
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

  const handleSubmit = async () => {
    if (!form.name) {
      CustomSnackBar.showSnackbar(t('missingLessonName'), 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare thumbnail payload
      const thumbnailPayload =
        thumbnailSource === 'upload'
          ? { ...form, thumbnailID: undefined, thumbnail: thumbnailFile ?? undefined }
          : { ...form, thumbnail: undefined };

      // Handle video submission
      if (videoSource === 'upload' && videoFile) {
        // Upload video by chunk
        const chunkSize = 5 * 1024 * 1024; // 5 MB
        const totalChunksCount = Math.ceil(videoFile.size / chunkSize);

        for (let chunkIndex = 0; chunkIndex < totalChunksCount; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize, videoFile.size);
          const chunk = videoFile.slice(start, end);
          const chunkFile = new File([chunk], videoFile.name, { type: videoFile.type });

          const chunkRequest = new CreateLessonRequest({
            ...thumbnailPayload,
            videoChunk: chunkFile,
            chunkIndex,
            totalChunks: totalChunksCount,
          });

          await onSubmit(chunkRequest);
          setCurrentChunkIndex(chunkIndex + 1);
          setUploadProgress(((chunkIndex + 1) / totalChunksCount) * 100);

          if (chunkIndex === totalChunksCount - 1) {
            setUploadProgress(0);
            setTotalChunks(0);
            setCurrentChunkIndex(0);
            onClose();
          }
        }
      } else {
        // Select video
        const request = new CreateLessonRequest({
          ...thumbnailPayload,
          videoChunk: undefined,
          videoID: videoSource === 'select' ? form.videoID : undefined,
        });

        await onSubmit(request);

        setUploadProgress(0);
        setTotalChunks(0);
        setCurrentChunkIndex(0);
        onClose();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('createLesson')}</Typography>
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

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} mt={1}>
            <CustomTextField
              label={t('name')}
              value={form.name}
              onChange={(val) => {
                handleChange('name', val);
              }}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label={t('detail')}
              value={form.detail}
              onChange={(val) => {
                handleChange('detail', val);
              }}
              disabled={disabled}
              multiline
              rows={detailRows}
              sx={{ '& .MuiInputBase-root': { height: fullScreen ? '100%' : 'auto' } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown
              label={t('required')}
              value={String(form.isRequired ?? '')}
              onChange={(value) => {
                handleChange('isRequired', value === 'true');
              }}
              disabled={false}
              options={booleanOptions}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown
              label={t('lessonType')}
              value={form.lessonType ?? ''}
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
              value={form.status ?? ''}
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
              value={form.categoryID}
              onChange={(value) => {
                handleChange('categoryID', value);
              }}
              categoryEnum={CategoryEnum.Lesson}
              disabled={isSubmitting}
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
                value={form.thumbnailID}
                onChange={handleThumbnailSelectChange}
                label={t('thumbnail')}
                disabled={isSubmitting}
              />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label={t('thumbnailDocumentNo')}
                    value={form.thumbDocumentNo}
                    onChange={(value) => {
                      handleChange('thumbDocumentNo', value);
                    }}
                    disabled={isSubmitting}
                    icon={<ImageIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label={t('thumbnailPrefixName')}
                    value={form.thumbPrefixName}
                    onChange={(value) => {
                      handleChange('thumbPrefixName', value);
                    }}
                    disabled={isSubmitting}
                    icon={<ImageIcon />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={<ImageIcon />}
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
                        checked={Boolean(form.isDeleteOldThumbnail)}
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
                  src={previewUrl ?? ''}
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
                value={form.videoID}
                onChange={handleVideoSelectChange}
                label={t('video')}
                disabled={isSubmitting}
              />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label={t('videoDocumentNo')}
                    value={form.videoDocumentNo}
                    onChange={(value) => {
                      handleChange('videoDocumentNo', value);
                    }}
                    disabled={isSubmitting}
                    icon={<ImageIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label={t('videoPrefixName')}
                    value={form.videoPrefixName}
                    onChange={(value) => {
                      handleChange('videoPrefixName', value);
                    }}
                    disabled={isSubmitting}
                    icon={<ImageIcon />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={<ImageIcon />}
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
          {videoPreviewUrl ? (
            <Grid item xs={12}>
              <CustomVideoPlayer src={videoPreviewUrl ?? ''} fullscreen />
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <CustomButton
              label={t('create')}
              onClick={handleSubmit}
              loading={isSubmitting || loading}
              disabled={isSubmitting || disabled || !form.name}
            />{' '}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
