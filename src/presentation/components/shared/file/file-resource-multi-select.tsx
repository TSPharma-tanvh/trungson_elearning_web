'use client';

import { useEffect, useMemo, useState } from 'react';
import { type FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { type FileResourcesUsecase } from '@/domain/usecases/file/file-usecase';
import { useResourceSelectLoader } from '@/presentation/hooks/file/file-resouce-select-loader';
import { type StatusEnum } from '@/utils/enum/core-enum';
import { FileResourceEnum } from '@/utils/enum/file-resource-enum';
import { InsertDriveFile, PlayArrow, Visibility } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
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

import CustomSnackBar from '../../core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '../../core/text-field/custom-search-input';
import ImagePreviewDialog from './image-preview-dialog';
import VideoPreviewDialog from './video-preview-dialog';

interface FileResourcesMultiSelectProps {
  fileUsecase: FileResourcesUsecase;
  type?: FileResourceEnum;
  status?: StatusEnum;
  value?: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  disabled?: boolean;
  showTypeSwitcher?: boolean;
  allowAllTypes?: boolean;
  defaultType?: FileResourceEnum;
}

export function FileResourceMultiSelect({
  fileUsecase,
  type,
  status,
  value = [],
  onChange,
  label = 'File Resources',
  disabled = false,
  showTypeSwitcher = false,
  allowAllTypes = false,
  defaultType,
}: FileResourcesMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileResourcesResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [previewImageOpen, setPreviewImageOpen] = useState(false);
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileResourcesResponse | null>(null);

  const [selectedType, setSelectedType] = useState<FileResourceEnum | undefined>(allowAllTypes ? defaultType : type);
  const [filterTypeEnabled, setFilterTypeEnabled] = useState<boolean>(!allowAllTypes);
  const [searchText, setSearchText] = useState('');

  const effectiveType = useMemo(
    () => (filterTypeEnabled ? selectedType : undefined),
    [selectedType, filterTypeEnabled]
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { files, pageNumber, totalPages, loadingFiles, loadFileResources, listRef } = useResourceSelectLoader({
    fileUsecase,
    isOpen: open,
    type: effectiveType,
    status,
    searchText,
  });

  useEffect(() => {
    const selectedIdsSet = new Set(selectedFiles.map((f) => f.id));
    const missingIds = value.filter((id) => !selectedIdsSet.has(id));

    if (missingIds.length > 0) {
      void Promise.all(
        missingIds.map(async (id) =>
          fileUsecase.getFileResouceById(id).catch((error: unknown) => {
            const message = error instanceof Error ? error.message : 'An error has occurred.';
            CustomSnackBar.showSnackbar(message, 'error');
            return null;
          })
        )
      ).then((newFiles) => {
        const validNewFiles = newFiles.filter((f): f is FileResourcesResponse => Boolean(f));
        setSelectedFiles((prev) => [...prev, ...validNewFiles]);
      });
    }
  }, [value]);

  useEffect(() => {
    if (open) {
      setSelectedIds(value);
    }
  }, [open, value]);

  useEffect(() => {
    if (open) {
      void loadFileResources(1, true);
    }
  }, [selectedType, filterTypeEnabled, searchText]);

  const handleConfirm = () => {
    const newSelectedFiles = files.filter((f) => selectedIds.includes(f.id ?? ''));
    onChange(selectedIds);
    setSelectedFiles(newSelectedFiles);
    setOpen(false);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handlePageChange = async (_: unknown, page: number) => {
    await loadFileResources(page, true);
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  const handleViewFile = (file: FileResourcesResponse) => {
    if (!file.resourceUrl) return;
    setPreviewFile(file);
    if (file.type?.startsWith('image/')) setPreviewImageOpen(true);
    else if (file.type?.startsWith('video/')) setPreviewVideoOpen(true);
    else window.open(file.resourceUrl, '_blank');
  };

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="file-multi-select-label" shrink>
          {label}
        </InputLabel>
        <Select
          labelId="file-multi-select-label"
          multiple
          value={value}
          onClick={() => {
            setOpen(true);
          }}
          input={<OutlinedInput label={label} />}
          renderValue={() => (selectedFiles.length ? selectedFiles.map((f) => f.name).join(', ') : 'No files selected')}
          open={false}
          displayEmpty
        >
          <MenuItem disabled value="">
            {selectedFiles.length ? selectedFiles.map((f) => f.name).join(', ') : 'No files selected'}
          </MenuItem>
        </Select>
      </FormControl>

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
          Select File Resources
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
          <CustomSearchInput placeholder="Search..." value={searchText} onChange={setSearchText} />

          <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
            {showTypeSwitcher ? (
              <>
                <FormControl fullWidth>
                  <InputLabel id="filter-type-label">File Type</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    value={selectedType ?? ''}
                    label="File Type"
                    disabled={!filterTypeEnabled}
                    onChange={(e) => {
                      setSelectedType(e.target.value as FileResourceEnum);
                    }}
                  >
                    {Object.values(FileResourceEnum).map((fileType) => (
                      <MenuItem key={fileType} value={fileType}>
                        {fileType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {allowAllTypes ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterTypeEnabled}
                        onChange={(e) => {
                          setFilterTypeEnabled(e.target.checked);
                        }}
                      />
                    }
                    label="Enable Type Filter"
                  />
                ) : null}
              </>
            ) : null}
          </Box>

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
                  onClick={() => {
                    handleToggleSelect(file.id ?? '');
                  }}
                  selected={selectedIds.includes(file.id ?? '')}
                >
                  <Checkbox edge="start" checked={selectedIds.includes(file.id ?? '')} tabIndex={-1} disableRipple />
                  <ListItemAvatar>{icon}</ListItemAvatar>
                  <ListItemText primary={file.name} secondary={file.type} />
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
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="contained">
              Confirm
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {previewFile?.resourceUrl && previewFile.type?.startsWith('image/') ? (
        <ImagePreviewDialog
          open={previewImageOpen}
          onClose={() => {
            setPreviewImageOpen(false);
          }}
          imageUrl={previewFile.resourceUrl}
          title={previewFile.name}
          fullscreen={fullscreen}
          onToggleFullscreen={() => {
            setFullscreen((prev) => !prev);
          }}
        />
      ) : null}

      {previewFile?.resourceUrl && previewFile.type?.startsWith('video/') ? (
        <VideoPreviewDialog
          open={previewVideoOpen}
          onClose={() => {
            setPreviewVideoOpen(false);
          }}
          videoUrl={previewFile.resourceUrl}
          title={previewFile.name}
          fullscreen={fullscreen}
          onToggleFullscreen={() => {
            setFullscreen((prev) => !prev);
          }}
        />
      ) : null}
    </>
  );
}
