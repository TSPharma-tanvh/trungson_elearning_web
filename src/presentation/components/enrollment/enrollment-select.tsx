'use client';

import { useEffect, useState } from 'react';
import { EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { useEnrollmentSelectLoader } from '@/presentation/hooks/enrollment/use-enrollment-select-loader';
import { CategoryEnum, StatusEnum, StatusEnumUtils } from '@/utils/enum/core-enum';
import { Tag } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  SelectChangeEvent,
  SelectProps,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { CustomSearchInput } from '../core/text-field/custom-search-input';

interface EnrollmentSelectProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  enrollmentUsecase: EnrollmentUsecase;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
  categoryEnum: CategoryEnum;
}
export function EnrollmentSelect({
  enrollmentUsecase,
  value,
  onChange,
  label = 'Enrollment Criteria',
  disabled = false,
  categoryEnum,
}: EnrollmentSelectProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedEnrollmentMap, setSelectedEnrollmentMap] = useState<Record<string, EnrollmentCriteriaDetailResponse>>(
    {}
  );

  const {
    enrollments,
    loadingEnrollments,
    pageNumber,
    totalPages,
    setSearchText,
    disableStatus,
    setDisableStatus,
    listRef,
    loadEnrollments,
  } = useEnrollmentSelectLoader({
    enrollmentUsecase,
    isOpen: dialogOpen,
    categoryEnum,
  });

  const isFull = isSmallScreen || isFullscreen;

  useEffect(() => {
    const fetch = async () => {
      const newMap = { ...selectedEnrollmentMap };
      let updated = false;

      for (const id of value) {
        if (!newMap[id]) {
          try {
            const detail = await enrollmentUsecase.getEnrollmentById(id);
            newMap[id] = detail;
            updated = true;
          } catch (err) {
            console.error(`Failed to load enrollment ID ${id}`, err);
          }
        }
      }

      if (updated) setSelectedEnrollmentMap(newMap);
    };

    if (value.length > 0) fetch();
  }, [value, enrollmentUsecase]);

  // Keep localValue in sync on prop change
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleOpen = () => !disabled && setDialogOpen(true);
  const handleClose = () => {
    setDialogOpen(false);
    setLocalValue(value); // Reset
  };
  const handleSave = () => {
    onChange(localValue);
    console.error(localValue);
    setDialogOpen(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    loadEnrollments(newPage);
    listRef.current?.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    setLocalSearchText('');
    setDisableStatus(undefined);
  };

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="enrollment-select-label">{label}</InputLabel>
        <Select
          multiple
          labelId="enrollment-select-label"
          value={value}
          input={
            <OutlinedInput label={label} startAdornment={<Tag sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            selected.map((id: string) => selectedEnrollmentMap[id]?.name || id).join(', ') || 'No Criteria Selected'
          }
          open={false}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Enrollment Criteria</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen(!isFullscreen)} size="small">
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <CustomSearchInput
            value={localSearchText}
            onChange={(val) => {
              setLocalSearchText(val);
              setSearchText(val);
            }}
            placeholder="Search enrollment..."
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Disable Status</InputLabel>
              <Select
                value={disableStatus !== undefined ? String(disableStatus) : ''}
                onChange={(e: SelectChangeEvent<string>) =>
                  setDisableStatus(e.target.value !== '' ? (Number(e.target.value) as StatusEnum) : undefined)
                }
                label="Disable Status"
              >
                {[undefined, StatusEnum.Enable, StatusEnum.Disable].map((opt) => (
                  <MenuItem key={opt ?? 'all'} value={opt !== undefined ? String(opt) : ''}>
                    {opt != null ? StatusEnumUtils.getStatusKeyFromValue(opt) : 'All'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              Clear Filters
            </Button>
          </Box>
        </DialogTitle>

        <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
          {enrollments.map((item) => {
            const checked = localValue.includes(item.id);
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                onClick={() => {
                  setLocalValue((prev) => (checked ? prev.filter((id) => id !== item.id) : [...prev, item.id]));
                }}
              >
                <Checkbox checked={checked} />
                <ListItemText primary={item.name} />
              </MenuItem>
            );
          })}

          {loadingEnrollments && (
            <Typography variant="body2" sx={{ p: 2 }}>
              Loading...
            </Typography>
          )}
          {!loadingEnrollments && enrollments.length === 0 && (
            <Typography variant="body2" sx={{ p: 2 }}>
              No enrollment criteria found
            </Typography>
          )}
        </Box>

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
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
