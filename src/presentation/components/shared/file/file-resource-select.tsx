import { useEffect, useState } from 'react';
import { type FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { type FileResourcesUsecase } from '@/domain/usecases/file/file-usecase';
import { useResourceSelectLoader } from '@/presentation/hooks/file/file-resouce-select-loader';
import { type StatusEnum } from '@/utils/enum/core-enum';
import { type FileResourceEnum } from '@/utils/enum/file-resource-enum';
import { Image as ImageIcon, InsertDriveFile, PlayArrow, Visibility } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSearchInput } from '../../core/text-field/custom-search-input';
import ImagePreviewDialog from './image-preview-dialog';
import VideoPreviewDialog from './video-preview-dialog';

interface FileResourceSelectProps {
  fileUsecase: FileResourcesUsecase;
  type: FileResourceEnum;
  status?: StatusEnum;
  value?: string;
  onChange: (id: string) => void;
  label?: string;
  disabled?: boolean;
}

export function FileResourceSelect({
  fileUsecase,
  type,
  status,
  value,
  onChange,
  label = 'fileResource',
  disabled = false,
}: FileResourceSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileResourcesResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [previewImageOpen, setPreviewImageOpen] = useState(false);
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { files, pageNumber, totalPages, loadingFiles, loadFileResources, listRef, setSearchText, searchText } =
    useResourceSelectLoader({ fileUsecase, isOpen: open, type, status });

  useEffect(() => {
    if (value && !selectedFile) {
      fileUsecase
        .getFileResouceById(value)
        .then(setSelectedFile)
        .catch(() => {
          undefined;
        });
    }
  }, [value]);

  useEffect(() => {
    if (open) {
      setSelectedId(value ?? null);
      void loadFileResources(1, true);
    }
  }, [open]);

  const handleConfirm = () => {
    const file = files.find((f) => f.id === selectedId);
    if (file) {
      onChange(file.id ?? '');
      setSelectedFile(file);
      setOpen(false);
    }
  };

  const handlePageChange = async (_: unknown, page: number) => {
    await loadFileResources(page, true);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  };

  const handleViewFile = (file: FileResourcesResponse) => {
    if (!file.resourceUrl) return;
    if (file.type?.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewImageOpen(true);
    } else if (file.type?.startsWith('video/')) {
      setSelectedFile(file);
      setPreviewVideoOpen(true);
    } else {
      window.open(file.resourceUrl, '_blank');
    }
  };

  return (
    <>
      {/* Select dropdown (readonly, fake trigger) */}
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="file-select-label">{label}</InputLabel>
        <Select
          labelId="file-select-label"
          value={value || ''}
          onClick={() => {
            setOpen(true);
          }}
          input={
            <OutlinedInput
              label={t(label)}
              sx={{
                pr: selectedFile?.resourceUrl ? 5 : undefined,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                flex: 1,
                mr: 1,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <ImageIcon fontSize="small" sx={{ mr: 1 }} />
                </InputAdornment>
              }
              endAdornment={
                selectedFile?.resourceUrl ? (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewFile(selectedFile);
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          }
          renderValue={() => selectedFile?.name || ''}
          open={false}
          displayEmpty
        >
          <MenuItem value="" disabled>
            {selectedFile?.name || t('noFileSelected')}
          </MenuItem>
        </Select>
      </FormControl>

      {/* Dialog select list */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        fullScreen={fullscreen}
      >
        <DialogTitle>
          {t('selectFileResources')}

          <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
            <IconButton
              onClick={() => {
                setFullscreen((prev) => !prev);
              }}
            >
              {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <CustomSearchInput placeholder={t('search')} value={searchText} onChange={setSearchText} />
          <List sx={{ overflow: 'auto' }} ref={listRef}>
            {files.map((file) => {
              const isImage = file.type?.startsWith('image/');
              const isVideo = file.type?.startsWith('video/');
              const icon = isImage ? (
                <Avatar variant="square" src={file.resourceUrl} sx={{ width: 40, height: 40 }} />
              ) : isVideo ? (
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PlayArrow />
                </Avatar>
              ) : (
                <Avatar sx={{ bgcolor: 'grey.300' }}>
                  <InsertDriveFile />
                </Avatar>
              );

              return (
                <ListItem
                  key={file.id}
                  selected={file.id === selectedId}
                  onClick={() => {
                    setSelectedId(file.id ?? null);
                  }}
                  secondaryAction={
                    file.resourceUrl ? (
                      <IconButton
                        edge="end"
                        onClick={() => {
                          handleViewFile(file);
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    ) : null
                  }
                  button
                >
                  <ListItemAvatar>{icon}</ListItemAvatar>
                  <ListItemText
                    primary={file.name}
                    secondary={file.type}
                    sx={{ flexGrow: 1 }}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: {
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  />
                </ListItem>
              );
            })}

            {loadingFiles ? (
              <Box textAlign="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : null}
          </List>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
                color="primary"
                size={isSmallScreen ? 'small' : 'medium'}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleConfirm} variant="contained">
              {t('confirm')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Image Viewer */}
      {selectedFile?.resourceUrl && selectedFile.type?.startsWith('image/') ? (
        <ImagePreviewDialog
          open={previewImageOpen}
          onClose={() => {
            setPreviewImageOpen(false);
          }}
          imageUrl={selectedFile.resourceUrl}
          title={selectedFile.name}
          fullscreen={fullscreen}
          onToggleFullscreen={() => {
            setFullscreen((prev) => !prev);
          }}
        />
      ) : null}

      {/* Video Viewer */}
      {selectedFile?.resourceUrl && selectedFile.type?.startsWith('video/') ? (
        <VideoPreviewDialog
          open={previewVideoOpen}
          onClose={() => {
            setPreviewVideoOpen(false);
          }}
          videoUrl={selectedFile.resourceUrl}
          title={selectedFile.name}
          fullscreen={fullscreen}
          onToggleFullscreen={() => {
            setFullscreen((prev) => !prev);
          }}
        />
      ) : null}
    </>
  );
}
