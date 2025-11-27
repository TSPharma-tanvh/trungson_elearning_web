import React, { useEffect, useState } from 'react';
import { CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, LearningModeEnum, LessonContentEnum, StatusEnum } from '@/utils/enum/core-enum';
import { FileTypeEnum } from '@/utils/enum/file-resource-enum';
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Image as ImageIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';

import { CustomButton } from '../../../core/button/custom-button';
import CustomSnackBar from '../../../core/snack-bar/custom-snack-bar';
import { CustomTextField } from '../../../core/text-field/custom-textfield';

interface CreateLessonFormProps {
  disabled?: boolean;
  onSubmit: (data: CreateLessonRequest) => Promise<void> | void;
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

  const { fileUsecase, categoryUsecase } = useDI();
  const [detailRows, setDetailRows] = useState(3);

  const [fullScreen, setFullScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //video
  const [_currentChunkIndex, setCurrentChunkIndex] = useState(0);

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

  const [form, setForm] = useState<CreateLessonRequest>(
    new CreateLessonRequest({
      name: '',
      detail: '',
      enablePlay: true,
      isRequired: true,
      status: StatusEnum.Enable,
      lessonType: LearningModeEnum.Online,
      categoryEnum: CategoryEnum.Lesson,
      contentType: LessonContentEnum.PDF,
      resources: resourceFiles ?? undefined,
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
        .getFileResourceById(form.thumbnailID)
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

  const handleThumbnailSelectChange = async (id: string) => {
    handleChange('thumbnailID', id);
    if (id) {
      try {
        const file = await fileUsecase.getFileResourceById(id);
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

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
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

      // Select video
      const request = new CreateLessonRequest({
        ...thumbnailPayload,
        videoChunk: undefined,
      });

      await onSubmit(request);

      setCurrentChunkIndex(0);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) {
      // Reset all form fields
      setForm(
        new CreateLessonRequest({
          name: '',
          detail: '',
          enablePlay: true,
          isRequired: true,
          status: StatusEnum.Enable,
          lessonType: LearningModeEnum.Online,
          categoryEnum: CategoryEnum.Lesson,
          contentType: LessonContentEnum.PDF,
          resources: [],
        })
      );

      setThumbnailFile(null);
      setPreviewUrl(null);
      setThumbnailSource('select');

      setResourceSource('select');
      setResourceFiles([]);
      setSelectedResourceIds([]);

      setFilePreviewData(null);
    }
  }, [open]);

  // const lessonTypeOptions = [
  //   { value: LearningModeEnum.Online, label: 'online' },
  //   { value: LearningModeEnum.Offline, label: 'offline' },
  // ];

  // const statusTypeOptions = [
  //   { value: StatusEnum.Enable, label: 'enable' },
  //   { value: StatusEnum.Disable, label: 'disable' },
  //   { value: StatusEnum.Deleted, label: 'deleted' },
  // ];

  // const booleanOptions = [
  //   { value: 'true', label: 'yes' },
  //   { value: 'false', label: 'no' },
  // ];

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

          <Grid item xs={12}>
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

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown<boolean>
              label={t('isRequired')}
              value={form.isRequired}
              onChange={(v) => {
                handleChange('isRequired', v);
              }}
              options={[
                { value: true, label: 'yes' },
                { value: false, label: 'no' },
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <CustomSelectDropDown
              label={t('lessonType')}
              value={form.lessonType ?? ''}
              onChange={(value) => {
                handleChange('lessonType', value);
              }}
              disabled={isSubmitting}
              options={lessonTypeOptions}
            />
          </Grid> */}

          {/* <Grid item xs={12} sm={6}>
            <CustomSelectDropDown
              label={t('status')}
              value={form.status ?? ''}
              onChange={(value) => {
                handleChange('status', value);
              }}
              disabled={isSubmitting}
              options={statusTypeOptions}
            />
          </Grid> */}

          {/* <Grid item xs={12} sm={6}>
            <CustomSelectDropDown
              label={t('enablePlay')}
              value={String(form.enablePlay ?? '')}
              onChange={(value) => {
                handleChange('enablePlay', value === 'true');
              }}
              disabled={false}
              options={booleanOptions}
            />
          </Grid> */}

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown<LessonContentEnum>
              label={t('contentType')}
              value={form.contentType ?? ''}
              onChange={(val) => {
                handleChange('contentType', val);
              }}
              options={[
                { value: LessonContentEnum.PDF, label: 'pdf' },
                { value: LessonContentEnum.Video, label: 'video' },
              ]}
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
            <Typography variant="h6">{t('updateResources')}</Typography>
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
                // type={FileTypeEnum.Document}
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
                    value={form.resourceDocumentNo}
                    onChange={(value) => {
                      handleChange('resourceDocumentNo', value);
                    }}
                    disabled={isSubmitting}
                    icon={<ImageIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label={t('resourcePrefixName')}
                    value={form.resourcePrefixName}
                    onChange={(value) => {
                      handleChange('resourcePrefixName', value);
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

          {/* {form.contentType === LessonContentEnum.Video ? (
            <>
              <Grid item xs={12} sm={12}>
                <FileResourceSelect
                  fileUsecase={fileUsecase}
                  type={FileTypeEnum.Video}
                  status={StatusEnum.Enable}
                  value={form.videoID}
                  onChange={handleVideoSelectChange}
                  label={t('video')}
                  disabled={isSubmitting}
                />
              </Grid>
              {videoPreviewUrl ? (
                <Grid item xs={12}>
                  <CustomVideoPlayer src={videoPreviewUrl ?? ''} fullscreen />
                </Grid>
              ) : null}
            </>
          ) : (
            <></>
          )} */}

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
