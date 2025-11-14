'use client';

import { useEffect, useState } from 'react';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { CreateFileResourcesRequest } from '@/domain/models/file/request/create-file-resource-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import AppStrings from '@/utils/app-strings';
import { CategoryEnum } from '@/utils/enum/core-enum';
import { FileUploadAdminEnum } from '@/utils/enum/file-resource-enum';
import StoreLocalManager from '@/utils/store-manager';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Image as ImageIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassSelectDialog } from '@/presentation/components/shared/classes/class/class-select';
import { CourseSelectDialog } from '@/presentation/components/shared/courses/courses/courses-select';
import { LessonSingleSelectDialog } from '@/presentation/components/shared/courses/lessons/lesson-select';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';
import { QuestionSingleSelectDialog } from '@/presentation/components/shared/quiz/question/question-single-select';
import { QuizSingleSelect } from '@/presentation/components/shared/quiz/quiz/quiz-select';

interface CreateFileResourcesProps {
  disabled?: boolean;
  onSubmit: (request: CreateFileResourcesRequest) => Promise<ApiResponse>;
  onSuccess?: () => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateFileResourcesDialog({
  disabled,
  onSubmit,
  onSuccess,
  loading,
  open,
  onClose,
}: CreateFileResourcesProps) {
  //usecase
  const { categoryUsecase, classUsecase, courseUsecase, lessonUsecase, quizUsecase, questionUsecase } = useDI();

  //translate and theme
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);

  const userId = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';

  //form
  const [form, setForm] = useState<CreateFileResourcesRequest>(
    new CreateFileResourcesRequest({
      categoryEnum: CategoryEnum.Resource,
      userID: userId,
    })
  );

  //value
  const [contentType, setContentType] = useState<FileUploadAdminEnum>(FileUploadAdminEnum.Files);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //resource
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewData, setFilePreviewData] = useState<{
    url: string;
    title?: string;
    type?: string;
  } | null>(null);

  //video
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  const handleChange = <K extends keyof CreateFileResourcesRequest>(key: K, value: CreateFileResourcesRequest[K]) => {
    setForm((prev) => new CreateFileResourcesRequest({ ...prev, [key]: value }));
  };

  //video
  const handleVideoUpload = (file: File | null) => {
    setVideoFile(file);
    if (file) {
      const chunkSize = 5 * 1024 * 1024; // 5 MB
      const calculatedTotalChunks = Math.ceil(file.size / chunkSize);
      setTotalChunks(calculatedTotalChunks);
      setUploadProgress(0);
      setVideoPreviewUrl(URL.createObjectURL(file));
    } else {
      setVideoPreviewUrl(null);
      setTotalChunks(0);
      setUploadProgress(0);
    }
  };

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      let lastResponse: ApiResponse | null = null;

      // video
      if (contentType === FileUploadAdminEnum.Video) {
        //check video
        if (videoFile === null) {
          CustomSnackBar.showSnackbar(t('videoIsRequired'), 'error');
          return null;
        }

        //gen a fake uploadId
        const uploadId = crypto.randomUUID();
        form.uploadID = uploadId;
        // upload video by chunk
        const chunkSize = 5 * 1024 * 1024;
        const totalChunksCount = Math.ceil(videoFile.size / chunkSize);

        for (let chunkIndex = 0; chunkIndex < totalChunksCount; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize, videoFile.size);
          const chunk = videoFile.slice(start, end);
          const chunkFile = new File([chunk], videoFile.name, { type: videoFile.type });

          const chunkRequest = new CreateFileResourcesRequest({
            ...form,
            videoChunk: chunkFile,
            chunkIndex,
            totalChunks: totalChunksCount,
          });

          const response = await onSubmit(chunkRequest);

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
        //   videoID: videoSource === 'select' ? form.videoID : undefined,
        // });

        form.videoChunk = undefined;
        form.files = resourceFiles;
        const response = await onSubmit(form);
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

  //for open and close form
  useEffect(() => {
    if (!open) return;

    const userIdValue = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';

    setForm(
      new CreateFileResourcesRequest({
        categoryEnum: CategoryEnum.Resource,
        userID: userIdValue,
      })
    );
    setVideoPreviewUrl(null);
    setUploadProgress(0);
    setTotalChunks(0);
    setSelectedResourceIds([]);
    setResourceFiles([]);
    setVideoFile(null);
  }, [open]);

  //for update file review url
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

  //for bigger and smaller screen
  useEffect(() => {
    const updateRows = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const aspectRatio = windowWidth / windowHeight;

      let otherElementsHeight = 300;
      if (windowHeight < 600) {
        otherElementsHeight = 250;
      } else if (windowHeight > 1000) {
        otherElementsHeight = 350;
      }

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('createFileResource')}
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
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: fullScreen ? '100%' : 'auto', p: 2 }}>
        <Grid container spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}>
          <Grid item xs={12} mt={1}>
            <CustomSelectDropDown<FileUploadAdminEnum>
              label={t('contentType')}
              value={contentType}
              onChange={(val) => {
                setContentType(val);
              }}
              options={[
                { value: FileUploadAdminEnum.Files, label: 'files' },
                { value: FileUploadAdminEnum.Video, label: 'video' },
              ]}
            />
          </Grid>

          {/* upload file */}
          {contentType === FileUploadAdminEnum.Files ? (
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={<ImageIcon />}
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
              </Grid>{' '}
            </Grid>
          ) : (
            <div />
          )}

          {resourceFiles.length > 0 && (
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

          {/* upload video */}
          {contentType === FileUploadAdminEnum.Video ? (
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
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
                {videoPreviewUrl ? (
                  <Grid item xs={12}>
                    <CustomVideoPlayer src={videoPreviewUrl} fullscreen />
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          ) : (
            <div />
          )}

          <Grid item xs={12}>
            <CategorySelect
              categoryUsecase={categoryUsecase}
              value={form.categoryID}
              onChange={(value) => {
                handleChange('categoryID', value);
              }}
              categoryEnum={CategoryEnum.Resource}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12}>
            <ClassSelectDialog
              classUsecase={classUsecase}
              value={form.classID ?? ''}
              onChange={(value: string) => {
                handleChange('classID', value);
              }}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12}>
            <CourseSelectDialog
              courseUsecase={courseUsecase}
              value={form.courseID ?? ''}
              onChange={(value: string) => {
                handleChange('courseID', value);
              }}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12}>
            <LessonSingleSelectDialog
              lessonUsecase={lessonUsecase}
              value={form.lessonID ?? ''}
              onChange={(value: string) => {
                handleChange('lessonID', value);
              }}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12}>
            <QuizSingleSelect
              quizUsecase={quizUsecase}
              value={form.quizID ?? ''}
              onChange={(value: string | null) => {
                handleChange('quizID', value ?? '');
              }}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12}>
            <QuestionSingleSelectDialog
              questionUsecase={questionUsecase}
              value={form.questionID ?? ''}
              onChange={(value: string) => {
                handleChange('questionID', value);
              }}
              disabled={false}
            />
          </Grid>
        </Grid>
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
            disabled={isSubmitting || disabled}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting || disabled}
          >
            {isSubmitting || disabled ? <CircularProgress size={24} /> : t('save')}
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
