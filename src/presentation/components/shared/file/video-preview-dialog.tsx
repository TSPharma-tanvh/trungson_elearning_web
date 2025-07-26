import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';

import { CustomVideoPlayer } from './custom-video-player';

interface VideoPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function VideoPreviewDialog({
  open,
  onClose,
  videoUrl,
  title,
  fullscreen = false,
  onToggleFullscreen,
}: VideoPreviewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullscreen} maxWidth="md" fullWidth>
      <DialogContent
        sx={{
          height: '100%',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          boxSizing: 'border-box',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="nowrap">
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              pr: 2,
            }}
          >
            {title}
          </Typography>

          <Box display="flex" flexDirection="row" alignItems="center" flexShrink={0}>
            {onToggleFullscreen ? (
              <IconButton onClick={onToggleFullscreen} title="Toggle Fullscreen">
                {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            ) : null}
            <IconButton onClick={onClose} title="Close">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <CustomVideoPlayer src={videoUrl} fullscreen={fullscreen} />
      </DialogContent>
    </Dialog>
  );
}
