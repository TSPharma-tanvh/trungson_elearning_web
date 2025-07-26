import React, { useEffect, useState } from 'react';
import { CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { CategoryEnum, DisplayTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { Image as ImageIcon, VideoCamera } from '@phosphor-icons/react';

import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';

import { CustomButton } from '../../../core/button/custom-button';
import { CustomSelectDropDown } from '../../../core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '../../../core/picker/custom-date-picker';
import CustomSnackBar from '../../../core/snack-bar/custom-snack-bar';
import { CustomTextField } from '../../../core/text-field/custom-textfield';

interface Props {
  disabled?: boolean;
  onSubmit: (data: CreateLessonRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateLessonDialog({ disabled = false, onSubmit, loading = false, open, onClose }: Props) {
  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  const [form, setForm] = useState<CreateLessonRequest>(
    new CreateLessonRequest({
      name: '',
      detail: '',
      enablePlay: true,
      status: StatusEnum.Enable,
      lessonType: undefined,
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
    return () => { window.removeEventListener('resize', updateRows); };
  }, [fullScreen]);

  const handleSubmit = () => {
    if (!form.name) {
      CustomSnackBar.showSnackbar('Vui lòng nhập tên bài học.', 'error');
      return;
    }
    if (!form.video) {
      CustomSnackBar.showSnackbar('Vui lòng tải lên video.', 'error');
      return;
    }
    if (!form.video) {
      CustomSnackBar.showSnackbar('Vui lòng tải lên video.', 'error');
      return;
    }

    if (!form.thumbnail) {
      CustomSnackBar.showSnackbar('Vui lòng tải lên thumbnail.', 'error');
      return;
    }

    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Tạo mới bài học</Typography>
        <Box>
          <IconButton onClick={() => { setFullScreen((prev) => !prev); }}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              label="Tên bài học"
              value={form.name}
              onChange={(val) => { handleChange('name', val); }}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label="Chi tiết"
              value={form.detail}
              onChange={(val) => { handleChange('detail', val); }}
              disabled={disabled}
              multiline
              rows={detailRows}
              sx={{ '& .MuiInputBase-root': { height: fullScreen ? '100%' : 'auto' } }}
            />
          </Grid>

          {/* Video Upload */}
          <Grid item xs={12}>
            <Typography variant="h6">Video (bắt buộc)</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Video Document No"
              value={form.videoDocumentNo}
              onChange={(val) => { handleChange('videoDocumentNo', val); }}
              disabled={disabled}
              icon={<VideoCamera size={20} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Video Prefix Name"
              value={form.videoPrefixName}
              onChange={(val) => { handleChange('videoPrefixName', val); }}
              disabled={disabled}
              icon={<VideoCamera size={20} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={disabled}
              startIcon={<VideoCamera size={20} />}
            >
              Upload Video
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleChange('video', file);
                    setVideoPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </Button>
          </Grid>
          {videoPreviewUrl ? <Grid item xs={12}>
              <CustomVideoPlayer src={videoPreviewUrl} fullscreen={fullScreen} />
            </Grid> : null}

          {/* Thumbnail Upload */}
          <Grid item xs={12}>
            <Typography variant="h6">Thumbnail (bắt buộc)</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Thumbnail Document No"
              value={form.thumbDocumentNo}
              onChange={(val) => { handleChange('thumbDocumentNo', val); }}
              disabled={disabled}
              icon={<ImageIcon size={20} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Thumbnail Prefix Name"
              value={form.thumbPrefixName}
              onChange={(val) => { handleChange('thumbPrefixName', val); }}
              disabled={disabled}
              icon={<ImageIcon size={20} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={disabled}
              startIcon={<ImageIcon size={20} />}
            >
              Upload Thumbnail
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleChange('thumbnail', file);
                    setThumbnailPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </Button>
          </Grid>
          {thumbnailPreviewUrl ? <Grid item xs={12}>
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
                  src={thumbnailPreviewUrl}
                  alt="Thumbnail Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid> : null}

          <Grid item xs={12}>
            <CustomButton label="Tạo mới" onClick={handleSubmit} loading={loading} disabled={disabled} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
