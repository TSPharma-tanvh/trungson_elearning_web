'use client';

import React, { useEffect, useState } from 'react';
import { GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { type EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { type EmployeeUsecase } from '@/domain/usecases/employee/employee-usecase';
import { useEmployeeSelectLoader } from '@/presentation/hooks/employee/use-employee-select-loader';
import { useEmployeeSelectDebounce } from '@/presentation/hooks/employee/user-course-select-debounce';
import { Book, InfoOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
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
import EmployeeDetailForm from '@/presentation/components/dashboard/management/employee/employee-detail-form';

interface EmployeeSelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  employeeUsecase: EmployeeUsecase | null;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  pathID?: string;
}

export function EmployeeSelectDialog({
  employeeUsecase,
  value,
  onChange,
  label = 'employee',
  disabled = false,
  pathID,
  ...selectProps
}: EmployeeSelectDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useEmployeeSelectDebounce(localSearchText, 300);
  const [selectedEmployeeMap, setSelectedEmployeeMap] = useState<Record<string, EmployeeResponse>>({});
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeResponse | null>(null);

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
      void loadEmployees(newPage, true);
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
    if (employeeUsecase && value && !selectedEmployeeMap[value]) {
      const fetchEmployee = async () => {
        try {
          const employee = await employeeUsecase.getEmployeeById(value);
          setSelectedEmployeeMap((prevMap) => ({
            ...prevMap,
            [employee.id ?? '']: employee,
          }));
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      };
      void fetchEmployee();
    }
  }, [employeeUsecase, value, selectedEmployeeMap]);

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
        <InputLabel id="employee-select-label">{t(label)}</InputLabel>
        <Select
          labelId="employee-select-label"
          value={value}
          input={
            <OutlinedInput label={t(label)} startAdornment={<Book sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />} />
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
            <Typography>{t('searchEmployee')}</Typography>
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
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder="Search employees..." />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button size="small" onClick={handleClearFilters} variant="outlined">
              {t('clearFilters')}
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
                onClick={() => {
                  setLocalValue(employee.id ?? '');
                }}
              >
                <Checkbox checked={localValue === employee.id} />
                <Avatar src={employee.avatar} alt={employee.name} sx={{ width: 32, height: 32, marginRight: 2 }} />

                <ListItemText primary={employee.name} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEmployee(employee);
                    setViewOpen(true);
                  }}
                  aria-label="Show Details"
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}
            {loadingEmployees ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : null}
            {!loadingEmployees && employees.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('noEmployeeFound')}
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

        {selectedEmployee ? (
          <EmployeeDetailForm
            open={viewOpen}
            employeeId={selectedEmployee.id ?? null}
            onClose={() => {
              setViewOpen(false);
            }}
          />
        ) : null}
      </Dialog>
    </>
  );
}
