'use client';

import React, { useEffect, useState } from 'react';
import { GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { type CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { type PathUsecase } from '@/domain/usecases/path/path-usecase';
import { usePathSelectDebounce } from '@/presentation/hooks/path/use-path-select-debounce';
import { usePathSelectLoader } from '@/presentation/hooks/path/use-path-select-loader';
import { Book } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  type SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';

interface PathFilterDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  pathUsecase: PathUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
  maxWidth?: number;
}

export function PathSingleFilter({
  pathUsecase,
  value,
  onChange,
  label = 'path',
  disabled = false,
  pathID,
  maxWidth = 200,
  ...selectProps
}: PathFilterDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = usePathSelectDebounce(localSearchText, 300);
  const [selectedPathMap, setSelectedPathMap] = useState<Record<string, CoursePathResponse>>({});

  const {
    paths,
    loadingPaths,
    pageNumber,
    totalPages,
    listRef,
    setSearchText,
    setStatus: setPathType,
    setDisplayType,
    loadPaths,
  } = usePathSelectLoader({
    pathUsecase,
    isOpen: dialogOpen,
    searchText: debouncedSearchText,
  });

  const isFull = isSmallScreen || isFullscreen;

  const handleOpen = () => {
    if (!disabled) setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setLocalValue(value);
  };

  const handleSave = () => {
    onChange(localValue);
    setDialogOpen(false);
  };

  const handleClearFilters = () => {
    setLocalSearchText('');
    setPathType(undefined);
    setDisplayType(undefined);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (pathUsecase && !loadingPaths) {
      void loadPaths(newPage, true);
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
    }
  };

  // Effects
  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (pathUsecase && value) {
      const fetchSelectedPaths = async () => {
        try {
          const request = new GetPathRequest({});
          const result = await pathUsecase.getPathListInfo(request);
          const newMap = { ...selectedPathMap };
          let updated = false;
          for (const pathData of result.path) {
            if (!newMap[pathData.id ?? '']) {
              newMap[pathData.id ?? ''] = pathData;
              updated = true;
            }
          }
          if (updated) {
            setSelectedPathMap(newMap);
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      };
      void fetchSelectedPaths();
    }
  }, [pathUsecase, value, pathID, selectedPathMap]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedPathMap };
      let updated = false;
      for (const path of paths) {
        if (path.id && !newMap[path.id]) {
          newMap[path.id] = path;
          updated = true;
        }
      }
      if (updated) {
        setSelectedPathMap(newMap);
      }
    }
  }, [paths, dialogOpen, selectedPathMap]);

  return (
    <>
      <FormControl
        disabled={disabled}
        size="small"
        sx={{
          '& .MuiInputLabel-root': {
            color: 'var(--mui-palette-secondary-main)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--mui-palette-primary-main)',
          },
          '& .MuiInputLabel-shrink': {
            color: 'var(--mui-palette-primary-main)',
          },
          '& .MuiInputLabel-shrink.Mui-focused': {
            color: 'var(--mui-palette-secondary-main)',
          },
          maxWidth,
          width: '100%',
        }}
      >
        <InputLabel id="path-select-label">{t(label)}</InputLabel>
        <Select
          labelId="path-select-label"
          value={value || ''}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={<Book sx={{ mr: 1, color: 'var(--mui-palette-secondary-main)', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedPathMap[selected]?.name || t('noPathSelected')}
          open={false}
          sx={{
            '& .MuiSelect-select': {
              backgroundColor: 'var(--mui-palette-common-white)',
              color: 'var(--mui-palette-secondary-main)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-primary-main)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-secondary-main)',
            },
          }}
          {...selectProps}
        >
          <MenuItem value="" disabled>
            {t('selectPath')}
          </MenuItem>
        </Select>
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectPath')}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen((prev) => !prev);
                }}
                size="small"
              >
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('searchPaths')} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('pathType')}</InputLabel>
              {/* Thêm select filter pathType ở đây nếu cần */}
            </FormControl>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              {t('clearFilters')}
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {paths.map((path) => (
              <MenuItem
                key={path.id}
                value={path.id}
                selected={localValue === path.id}
                onClick={() => {
                  setLocalValue(path.id ?? '');
                }}
              >
                <Checkbox checked={localValue === path.id} />
                <ListItemText primary={path.name} />
              </MenuItem>
            ))}
            {loadingPaths ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : null}
            {!loadingPaths && paths.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('empty')}
              </Typography>
            )}
          </Box>
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
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button onClick={handleSave} variant="contained" disabled={!localValue}>
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
