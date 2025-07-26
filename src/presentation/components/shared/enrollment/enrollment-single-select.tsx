'use client';

import React, { useEffect, useState } from 'react';
import { type EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { type EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { useEnrollmentSelectLoader } from '@/presentation/hooks/enrollment/use-enrollment-select-loader';
import { StatusEnum, StatusEnumUtils, type CategoryEnum } from '@/utils/enum/core-enum';
import { InfoOutlined, Tag } from '@mui/icons-material';
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
  type SelectChangeEvent,
  type SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import CustomSnackBar from '../../core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '../../core/text-field/custom-search-input';
import EnrollmentDetailForm from '../../dashboard/management/enrollment/enrollment-detail-form';

interface EnrollmentSelectProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  enrollmentUsecase: EnrollmentUsecase;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  categoryEnum: CategoryEnum;
}

export function EnrollmentSingleSelect({
  enrollmentUsecase,
  value,
  onChange,
  label = 'Enrollment Criteria',
  disabled = false,
  categoryEnum,
  ...selectProps
}: EnrollmentSelectProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedEnrollmentMap, setSelectedEnrollmentMap] = useState<Record<string, EnrollmentCriteriaDetailResponse>>(
    {}
  );
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = React.useState<EnrollmentCriteriaDetailResponse | null>(null);
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
    setSearchText(localSearchText);
  }, [localSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const fetch = async () => {
      if (value && !selectedEnrollmentMap[value]) {
        try {
          const detail = await enrollmentUsecase.getEnrollmentById(value);
          setSelectedEnrollmentMap((prev) => ({ ...prev, [value]: detail }));
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      }
    };
    void fetch();
  }, [value, enrollmentUsecase]);

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

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    void loadEnrollments(newPage);
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
          labelId="enrollment-select-label"
          value={value}
          input={
            <OutlinedInput label={label} startAdornment={<Tag sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedEnrollmentMap[selected]?.name || 'No Criteria Selected'}
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Enrollment Criteria</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen(!isFullscreen);
                }}
                size="small"
              >
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
            }}
            placeholder="Search enrollment..."
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Disable Status</InputLabel>
              <Select
                value={disableStatus !== undefined ? String(disableStatus) : ''}
                onChange={(e: SelectChangeEvent) => {
                  setDisableStatus(e.target.value !== '' ? (Number(e.target.value) as StatusEnum) : undefined);
                }}
                label="Disable Status"
              >
                {[undefined, StatusEnum.Enable, StatusEnum.Disable].map((opt) => (
                  <MenuItem key={opt ?? 'all'} value={opt !== undefined ? String(opt) : ''}>
                    {opt !== undefined ? StatusEnumUtils.getStatusKeyFromValue(opt) : 'All'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              Clear Filters
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {enrollments.map((item) => (
              <MenuItem
                key={item.id}
                value={item.id}
                selected={localValue === item.id}
                onClick={() => {
                  setLocalValue(item.id);
                }}
              >
                <Checkbox checked={localValue === item.id} />
                <ListItemText primary={item.name} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEnrollment(item);
                    setViewOpen(true);
                  }}
                  aria-label="Show Details"
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}

            {loadingEnrollments ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            ) : null}
            {!loadingEnrollments && enrollments.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No enrollment criteria found
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

      {selectedEnrollment ? (
        <EnrollmentDetailForm
          open={viewOpen}
          enrollmentId={selectedEnrollment.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
