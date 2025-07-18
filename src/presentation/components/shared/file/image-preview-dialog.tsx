import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

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
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="nowrap">
          <Typography
            variant="h6"
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
      </DialogTitle>
      <DialogContent>
        <img src={imageUrl} alt={title} style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain' }} />
      </DialogContent>
    </Dialog>
  );
}
