import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';

interface ImagePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function ImagePreviewDialog({
  open,
  onClose,
  imageUrl,
  title,
  fullscreen = false,
  onToggleFullscreen,
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullscreen} maxWidth="md" fullWidth>
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <Box>
            {onToggleFullscreen && (
              <IconButton onClick={onToggleFullscreen} title="Toggle Fullscreen">
                <FullscreenIcon />
              </IconButton>
            )}
            <IconButton onClick={onClose} title="Close">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <img src={imageUrl} alt={title} style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain' }} />
      </DialogContent>
    </Dialog>
  );
}
