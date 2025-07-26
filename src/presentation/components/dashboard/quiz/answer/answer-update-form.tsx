import { useEffect, useState } from 'react';
import { UpdateAnswerRequest } from '@/domain/models/answer/request/update-answer-request';
import { type AnswerDetailResponse } from '@/domain/models/answer/response/answer-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, DisplayTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
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
import { Image as ImageIcon, Tag } from '@phosphor-icons/react';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { FileResourceMultiSelect } from '@/presentation/components/shared/file/file-resource-multi-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';
import { AnswerMultiSelectDialog } from '@/presentation/components/shared/quiz/answer/answer-multi-select';
import { QuestionMultiSelectDialog } from '@/presentation/components/shared/quiz/question/question-multi-select';
import { QuestionSingleSelectDialog } from '@/presentation/components/shared/quiz/question/question-single-select';

interface EditAnswerDialogProps {
  open: boolean;
  data: AnswerDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateAnswerRequest) => void;
}

export function UpdateAnswerFormDialog({ open, data: answer, onClose, onSubmit }: EditAnswerDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryUsecase, fileUsecase, questionUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateAnswerRequest>(new UpdateAnswerRequest({}));
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

  useEffect(() => {
    if (answer && open) {
      const newFormData = new UpdateAnswerRequest({
        id: answer.id || '',
        answerText: answer.answerText || '',
        questionID: answer.questionID,
        isCorrect: answer.isCorrect,
        status: answer.status !== undefined ? StatusEnum[answer.status as keyof typeof StatusEnum] : undefined,
        categoryID: answer.categoryID || undefined,
        thumbnailID: answer.thumbnailID || undefined,
        categoryEnum: CategoryEnum.Answer,
        isDeleteOldThumbnail: false,
      });
      setFormData(newFormData);
      console.error(newFormData);
    }
  }, [answer, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateAnswerRequest>(field: K, value: UpdateAnswerRequest[K]) => {
    setFormData((prev) => new UpdateAnswerRequest({ ...prev, [field]: value }));
  };

  const handleThumbnailSourceChange = (event: React.MouseEvent<HTMLElement>, newSource: 'upload' | 'select') => {
    if (newSource) {
      setThumbnailSource(newSource);
      if (newSource === 'upload') {
        setPreviewUrl(formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : null);
      } else {
        handleChange('thumbnail', undefined);
        if (formData.thumbnailID) {
          fileUsecase
            .getFileResouceById(formData.thumbnailID)
            .then((file) => { setPreviewUrl(file.resourceUrl || null); })
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

  const handleFileUpload = (file: File | null) => {
    handleChange('thumbnail', file ?? undefined);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      CustomSnackBar.showSnackbar('Failed to update answer', 'error');
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
    { value: StatusEnum.Enable, label: 'Enable' },
    { value: StatusEnum.Disable, label: 'Disable' },
    { value: StatusEnum.Deleted, label: 'Deleted' },
  ];

  const booleanOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ];

  if (!answer) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update Answer
        </Typography>
        <Box>
          <IconButton onClick={() => { setFullScreen((prev) => !prev); }}>
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
            ID: {answer?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label="answerText"
                value={formData.answerText}
                onChange={(value) => { handleChange('answerText', value); }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="isCorrect"
                value={String(formData.isCorrect ?? '')}
                onChange={(value) => { handleChange('isCorrect', value === 'true'); }}
                disabled={isSubmitting}
                options={booleanOptions}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label="Status"
                value={formData.status ?? 0}
                onChange={(value) => { handleChange('status', value as StatusEnum); }}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>

            <Grid item xs={12}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={formData.categoryID}
                onChange={(value) => { handleChange('categoryID', value); }}
                categoryEnum={CategoryEnum.Answer}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <QuestionSingleSelectDialog
                questionUsecase={questionUsecase}
                value={formData.questionID ?? ''}
                onChange={(value: string) => { handleChange('questionID', value); }}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Thumbnail */}

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
                  onChange={(ids) => { handleChange('thumbnailID', ids); }}
                  label="Thumbnail"
                  disabled={isSubmitting}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Thumbnail Document No"
                      value={formData.thumbDocumentNo}
                      onChange={(value) => { handleChange('thumbDocumentNo', value); }}
                      disabled={isSubmitting}
                      icon={<ImageIcon {...iconStyle} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Thumbnail Prefix Name"
                      value={formData.thumbPrefixName}
                      onChange={(value) => { handleChange('thumbPrefixName', value); }}
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
                        onChange={(e) => { handleFileUpload(e.target.files?.[0] || null); }}
                      />
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(formData.isDeleteOldThumbnail)}
                          onChange={(e) => { handleChange('isDeleteOldThumbnail', e.target.checked); }}
                          disabled={isSubmitting}
                        />
                      }
                      label="Delete Old Thumbnail"
                    />
                  </Grid>
                  {previewUrl ? <Grid item xs={12}>
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
                    </Grid> : null}
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

      {filePreviewData?.url ? <>
          {filePreviewData.type?.includes('image') ? (
            <ImagePreviewDialog
              open={filePreviewOpen}
              onClose={() => { setFilePreviewOpen(false); }}
              imageUrl={filePreviewData.url}
              title={filePreviewData.title}
              fullscreen={fullScreen}
              onToggleFullscreen={() => { setFullScreen((prev) => !prev); }}
            />
          ) : filePreviewData.type?.includes('video') ? (
            <VideoPreviewDialog
              open={filePreviewOpen}
              onClose={() => { setFilePreviewOpen(false); }}
              videoUrl={filePreviewData.url}
              title={filePreviewData.title}
              fullscreen={fullScreen}
              onToggleFullscreen={() => { setFullScreen((prev) => !prev); }}
            />
          ) : null}
        </> : null}
    </Dialog>
  );
}
