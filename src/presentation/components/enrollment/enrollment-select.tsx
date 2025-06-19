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
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { CustomSearchInput } from '../core/text-field/custom-search-input';

interface EnrollmentSelectProps {
  enrollmentUsecase: EnrollmentUsecase;
  value: string;
  onChange: (value: string) => void;
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
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentCriteriaDetailResponse | undefined>(undefined);

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
    const fetchEnrollment = async () => {
      if (!value || !enrollmentUsecase) return;

      const exists = enrollments.find((e) => e.id === value);
      if (exists) {
        const mapped: EnrollmentCriteriaDetailResponse = {
          ...exists,
          toJson: () => ({
            ...exists,
          }),
        };
        setSelectedEnrollment(mapped);
        return;
      }

      try {
        const detail = await enrollmentUsecase.getEnrollmentById(value);
        setSelectedEnrollment(detail);
      } catch (e) {
        console.error('Failed to fetch enrollment:', e);
      }
    };

    fetchEnrollment();
  }, [value, enrollmentUsecase, enrollments]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
    loadEnrollments(newPage);
  };

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="enrollment-select-label">{label}</InputLabel>
        <Select
          labelId="enrollment-select-label"
          value={value}
          input={<OutlinedInput label={label} startAdornment={<Tag sx={{ mr: 1 }} />} />}
          onClick={handleOpen}
          renderValue={() =>
            selectedEnrollment?.name || enrollments.find((e) => e.id === value)?.name || value || 'No Selection'
          }
          open={false}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm">
        <DialogTitle>
          Select Enrollment Criteria
          <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
            <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box px={2} py={1} display="flex" gap={2} flexDirection={isSmallScreen ? 'column' : 'row'}>
          <CustomSearchInput
            value={localSearchText}
            onChange={(value) => {
              setLocalSearchText(value);
              setSearchText(value);
            }}
            placeholder="Search enrollment..."
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Disable Status</InputLabel>
            <Select
              value={disableStatus !== undefined ? String(disableStatus) : ''}
              label="Disable Status"
              onChange={(e: SelectChangeEvent<string>) => {
                const val = e.target.value;
                setDisableStatus(val !== '' ? (Number(val) as StatusEnum) : undefined);
              }}
            >
              {[undefined, StatusEnum.Enable, StatusEnum.Disable].map((opt) => (
                <MenuItem key={opt ?? 'all'} value={opt !== undefined ? String(opt) : ''}>
                  {opt != null ? StatusEnumUtils.getStatusKeyFromValue(opt) : 'All'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box px={2} pb={2}>
          <List ref={listRef} sx={{ maxHeight: 300, overflow: 'auto' }}>
            {enrollments.map((item) => (
              <ListItem key={item.id} button selected={localValue === item.id} onClick={() => setLocalValue(item.id)}>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
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
            <Button onClick={handleSave} variant="contained" disabled={!localValue}>
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
