import React, { useEffect, useState } from 'react';
import { UpdateCategoryRequest } from '@/domain/models/category/request/update-category-request';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, StatusEnum } from '@/utils/enum/core-enum';
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

import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';

interface EditCategoryDialogProps {
  open: boolean;
  data: CategoryDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateCategoryRequest) => void;
}

export function UpdateCategoryFormDialog({ open, data: category, onClose, onSubmit }: EditCategoryDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { fileUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateCategoryRequest>(new UpdateCategoryRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    if (category && open) {
      const categoryValue =
        typeof category.category === 'string'
          ? CategoryEnum[category.category as keyof typeof CategoryEnum]
          : category.category;

      const newFormData = new UpdateCategoryRequest({
        id: category.id || '',
        categoryName: category.categoryName || '',
        description: category.description || undefined,
        category: categoryValue,
        thumbnailID: category.thumbnail?.id || undefined,
        isDeleteOldThumbnail: false,
      });
      setPreviewUrl(category.thumbnail?.resourceUrl ?? null);
      setFormData(newFormData);
    }
  }, [category, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateCategoryRequest>(field: K, value: UpdateCategoryRequest[K]) => {
    setFormData((prev) => new UpdateCategoryRequest({ ...prev, [field]: value }));
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
          const file = await fileUsecase.getFileResouceById(formData.thumbnailID);
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
        const file = await fileUsecase.getFileResouceById(id);
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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (thumbnailSource === 'upload') {
        onSubmit(
          new UpdateCategoryRequest({
            ...formData,
            thumbnailID: undefined,
          })
        );
      } else {
        onSubmit(
          new UpdateCategoryRequest({
            ...formData,
            thumbnail: undefined,
          })
        );
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData(new UpdateCategoryRequest({}));
      setPreviewUrl(null);
      setThumbnailSource('select');
      setThumbnailFile(null);
    }
  }, [open]);

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  if (!category) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateCategory')}
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
            {t('id')}: {category?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label={t('name')}
                value={formData.categoryName ?? ''}
                onChange={(value) => {
                  handleChange('categoryName', value);
                }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('description')}
                value={formData.description ?? 'z'}
                onChange={(value) => {
                  handleChange('description', value);
                }}
                disabled={isSubmitting}
                icon={<Article {...iconStyle} />}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <CustomSelectDropDown<CategoryEnum>
                label="Enrollment Criteria Type"
                value={formData.category ?? CategoryEnum.Path}
                onChange={(val) => {
                  handleChange('category', val);
                }}
                options={[
                  { value: CategoryEnum.Path, label: 'Lộ trình' },
                  { value: CategoryEnum.Course, label: 'Khóa học' },
                  { value: CategoryEnum.Lesson, label: 'Bài học' },
                  { value: CategoryEnum.Class, label: 'Lớp học' },
                  { value: CategoryEnum.Quiz, label: 'Bài kiểm tra' },
                  { value: CategoryEnum.Question, label: 'Câu hỏi' },
                  { value: CategoryEnum.Answer, label: 'Câu trả lời' },
                  { value: CategoryEnum.Criteria, label: 'Tiêu chí' },
                ]}
              />
            </Grid> */}

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
                <ToggleButton value="select" aria-label="select from resources">
                  {t('selectFromResources')}
                </ToggleButton>
                <ToggleButton value="upload" aria-label="upload file">
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
                  value={formData.thumbnailID ?? ''}
                  onChange={handleFileSelectChange}
                  label={t('thumbnail')}
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label={t('thumbnailDocumentNo')}
                      value={formData.thumbDocumentNo ?? ''}
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
                      value={formData.thumbPrefixName ?? ''}
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
