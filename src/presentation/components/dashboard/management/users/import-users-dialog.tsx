'use client';

import React, { useEffect, useState } from 'react';
import { CreateUsersFromExcelRequest } from '@/domain/models/user/request/import-user-request';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { Image as ImageIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';

interface ImportUsersDialogProps {
  disabled?: boolean;
  onSubmit: (data: CreateUsersFromExcelRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function ImportUsersDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: ImportUsersDialogProps) {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<CreateUsersFromExcelRequest>(new CreateUsersFromExcelRequest());
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewData, setFilePreviewData] = useState<{
    url: string;
    title?: string;
    type?: string;
  } | null>(null);

  const handleChange = <K extends keyof CreateUsersFromExcelRequest>(key: K, value: CreateUsersFromExcelRequest[K]) => {
    setForm((prev) => new CreateUsersFromExcelRequest({ ...prev, [key]: value }));
  };

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

  const handleFileUpload = (file: File | null) => {
    if (file === null) {
      CustomSnackBar.showSnackbar(t('fileIsRequired'), 'error');
      return;
    }
    handleChange('excelFile', file);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (!form.excelFile) {
        CustomSnackBar.showSnackbar(t('fileIsRequired'), 'error');
        return;
      }
      await onSubmit(form);
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setForm(new CreateUsersFromExcelRequest());
    }
  }, [open]);

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="subtitle1" component="div">
          {t('importUsers')}
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

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: fullScreen ? '100%' : 'auto',
          padding: 0,
        }}
      >
        <Box component="form" noValidate autoComplete="off" p={2}>
          <Grid container spacing={3}>
            {/* upload file */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={isSubmitting}
                startIcon={<ImageIcon {...iconStyle} />}
              >
                {t('uploadFile')}
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    handleFileUpload(e.target.files?.[0] || null);
                  }}
                />
              </Button>
            </Grid>

            {form.excelFile ? (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={1}>
                  {t('uploadedFiles')}
                </Typography>
                <Button
                  variant="text"
                  fullWidth
                  onClick={() =>
                    handleFilePreview(
                      URL.createObjectURL(form.excelFile as File),
                      (form.excelFile as File).name,
                      (form.excelFile as File).type
                    )
                  }
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {(form.excelFile as File).name}
                </Button>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {t('noFileUploadedYet')}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomButton
                label={t('import')}
                onClick={() => handleSave()}
                loading={loading || isSubmitting}
                disabled={disabled || loading || isSubmitting}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {filePreviewData?.url ? (
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
      ) : null}
    </Dialog>
  );
}
