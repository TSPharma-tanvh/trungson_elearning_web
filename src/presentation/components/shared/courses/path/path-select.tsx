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

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';

interface PathSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  pathUsecase: PathUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
}

export function PathSelectDialog({
  pathUsecase,
  value,
  onChange,
  label = 'Paths',
  disabled = false,
  pathID,
  ...selectProps
}: PathSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
    // setScheduleStatus(undefined);
    // setDisableStatus(undefined);
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
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="path-select-label">{label}</InputLabel>
        <Select
          labelId="path-select-label"
          value={value}
          input={
            <OutlinedInput label={label} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedPathMap[selected]?.name || 'No Path Selected'}
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Path</Typography>
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
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder="Search paths..." />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Path Type</InputLabel>
              {/* <Select
                value={pathType !== undefined ? String(pathType) : ''}
                onChange={(e: SelectChangeEvent<string>) =>
                  setPathType(e.target.value !== '' ? (Number(e.target.value) as LearningModeEnum) : undefined)
                }
                label="Path Type"
              >
                {filterOptions.pathType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {opt !== undefined ? LearningModeDisplayNames[opt] : 'All'}
                  </MenuItem>
                ))}
              </Select> */}
            </FormControl>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              Clear Filters
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
                Loading...
              </Typography>
            ) : null}
            {!loadingPaths && paths.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No paths found
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={!localValue}>
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
