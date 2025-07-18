'use client';

import { useEffect, useState } from 'react';
import { GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { EmployeeUsecase } from '@/domain/usecases/employee/employee-usecase';
import { useEmployeeSelectLoader } from '@/presentation/hooks/employee/use-employee-select-loader';
import { useEmployeeSelectDebounce } from '@/presentation/hooks/employee/user-course-select-debounce';
import {
  DisplayTypeDisplayNames,
  DisplayTypeEnum,
  LearningModeDisplayNames,
  LearningModeEnum,
  ScheduleStatusDisplayNames,
  ScheduleStatusEnum,
  StatusDisplayNames,
  StatusEnum,
} from '@/utils/enum/core-enum';
import { Book, BookOutlined } from '@mui/icons-material';
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
  SelectChangeEvent,
  SelectProps,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';

interface EmployeeSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  employeeUsecase: EmployeeUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
}

const filterOptions = {
  employeeType: [LearningModeEnum.Online, LearningModeEnum.Offline, undefined],
  displayType: [DisplayTypeEnum.Public, DisplayTypeEnum.Private, undefined],
  scheduleStatus: [ScheduleStatusEnum.Schedule, ScheduleStatusEnum.Ongoing, ScheduleStatusEnum.Cancelled, undefined],
  disableStatus: [StatusEnum.Enable, StatusEnum.Disable, undefined],
};

export function EmployeeSelectDialog({
  employeeUsecase,
  value,
  onChange,
  label = 'Employees',
  disabled = false,
  pathID,
  ...selectProps
}: EmployeeSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useEmployeeSelectDebounce(localSearchText, 300);
  const [selectedEmployeeMap, setSelectedEmployeeMap] = useState<Record<string, EmployeeResponse>>({});

  const { employees, loadingEmployees, pageNumber, totalPages, setSearchText, listRef, loadEmployees } =
    useEmployeeSelectLoader({
      employeeUsecase,
      isOpen: dialogOpen,

      searchText: debouncedSearchText,
    });

  const isFull = isSmallScreen || isFullscreen;

  // Handlers
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
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (employeeUsecase && !loadingEmployees) {
      loadEmployees(newPage, true);
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
    if (employeeUsecase && value) {
      const fetchSelectedEmployees = async () => {
        try {
          const request = new GetEmployeeRequest({});
          const result = await employeeUsecase.getEmployeeListInfo(request);
          const newMap = { ...selectedEmployeeMap };
          let updated = false;
          for (const employee of result.employees) {
            if (!newMap[employee.id ?? '']) {
              newMap[employee.id ?? ''] = employee;
              updated = true;
            }
          }
          if (updated) {
            setSelectedEmployeeMap(newMap);
          }
        } catch (error) {
          console.error('Error fetching selected employees:', error);
        }
      };
      fetchSelectedEmployees();
    }
  }, [employeeUsecase, value, pathID, selectedEmployeeMap]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedEmployeeMap };
      let updated = false;
      for (const employee of employees) {
        if (employee.id && !newMap[employee.id]) {
          newMap[employee.id] = employee;
          updated = true;
        }
      }
      if (updated) {
        setSelectedEmployeeMap(newMap);
      }
    }
  }, [employees, dialogOpen, selectedEmployeeMap]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="employee-select-label">{label}</InputLabel>
        <Select
          labelId="employee-select-label"
          value={value}
          input={
            <OutlinedInput label={label} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedEmployeeMap[selected]?.name || 'No Employee Selected'}
          open={false}
          {...selectProps}
        />
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Employee</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen((prev) => !prev)} size="small">
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder="Search employees..." />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Employee Type</InputLabel>
              <Select
                value={employeeType !== undefined ? String(employeeType) : ''}
                onChange={(e: SelectChangeEvent<string>) =>
                  setEmployeeType(e.target.value !== '' ? (Number(e.target.value) as LearningModeEnum) : undefined)
                }
                label="Employee Type"
              >
                {filterOptions.employeeType.map((opt) => (
                  <MenuItem key={opt ?? 'none'} value={opt !== undefined ? String(opt) : ''}>
                    {opt != null ? LearningModeDisplayNames[opt] : 'All'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              Clear Filters
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {employees.map((employee) => (
              <MenuItem
                key={employee.id}
                value={employee.id}
                selected={localValue === employee.id}
                onClick={() => setLocalValue(employee.id ?? '')}
              >
                <Checkbox checked={localValue === employee.id} />
                <ListItemText primary={employee.name} />
              </MenuItem>
            ))}
            {loadingEmployees && (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            )}
            {!loadingEmployees && employees.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                No employees found
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
