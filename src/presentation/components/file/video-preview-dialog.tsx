import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';

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
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <Box>
            {onToggleFullscreen && (
              <IconButton onClick={onToggleFullscreen} title="Toggle Fullscreen">
                {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            )}
            <IconButton onClick={onClose} title="Close">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <video src={videoUrl} controls style={{ width: '100%', maxHeight: '90vh' }} />
      </DialogContent>
    </Dialog>
  );
}
