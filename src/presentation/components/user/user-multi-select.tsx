'use client';

import React, { useEffect, useState } from 'react';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { type UserUsecase } from '@/domain/usecases/user/user-usecase';
import { useUserSelectDebounce } from '@/presentation/hooks/user/use-user-select-debounced';
import { useUserSelectLoader } from '@/presentation/hooks/user/use-user-select-loader';
import { AccountCircle } from '@mui/icons-material';
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

import CustomSnackBar from '../core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '../core/text-field/custom-search-input';
import { ViewUserDialog } from '../dashboard/management/users/view-user-detail-dialog';

interface UserSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  userUsecase: UserUsecase | null;
  value: string[]; // changed from string to string[]
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function UserMultiSelectDialog({
  userUsecase,
  value,
  onChange,
  label = 'Users',
  disabled = false,
  ...selectProps
}: UserSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useUserSelectDebounce(localSearchText, 300);
  const [selectedUserMap, setSelectedUserMap] = useState<Record<string, UserResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { users, loadingUsers, pageNumber, totalPages, listRef, setSearchText, loadUsers } = useUserSelectLoader({
    userUsecase,
    isOpen: dialogOpen,
    roles: [],
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

  const handlePageChange = (_: unknown, newPage: number) => {
    if (userUsecase && !loadingUsers) {
      void loadUsers(newPage, true);
      listRef.current?.scrollTo(0, 0);
    }
  };

  const handleToggle = (userId: string) => {
    setLocalValue((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (userUsecase && value.length) {
      const fetchSelectedUsers = async () => {
        setLoading(true);
        try {
          const request = new GetUserRequest({});
          const result = await userUsecase.getUserListInfo(request);
          const newMap = { ...selectedUserMap };
          let updated = false;
          for (const user of result.users) {
            if (!newMap[user.id]) {
              newMap[user.id] = user;
              updated = true;
            }
          }
          if (updated) {
            setSelectedUserMap(newMap);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        } finally {
          setLoading(false);
        }
      };
      void fetchSelectedUsers();
    } else {
      setLoading(false);
    }
  }, [userUsecase, value, selectedUserMap]);

  useEffect(() => {
    if (dialogOpen) {
      const map = { ...selectedUserMap };
      users.forEach((u) => {
        if (u.id && !map[u.id]) {
          map[u.id] = u;
        }
      });
      setSelectedUserMap(map);
    }
  }, [users, dialogOpen]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="user-select-label">{label}</InputLabel>
        <Select
          labelId="user-select-label"
          multiple
          value={loading ? [] : value || []}
          input={
            <OutlinedInput
              label={label}
              startAdornment={<AccountCircle sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            loading
              ? 'Loading...'
              : selected
                  .map((id) => {
                    const user = selectedUserMap[id];
                    return user ? `${user.firstName} ${user.lastName}` : id;
                  })
                  .join(', ')
          }
          open={false}
          {...selectProps}
        >
          {Object.values(selectedUserMap).map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {`${user.firstName} ${user.lastName}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography mb={1}>Select Users</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen((prev) => !prev);
                }}
              >
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder="Search..." />
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ listStyle: 'none', p: 0 }}>
            {users.map((user) => {
              const isSelected = localValue.includes(user.id);
              return (
                <MenuItem
                  key={user.id}
                  selected={isSelected}
                  onClick={() => {
                    handleToggle(user.id);
                  }}
                >
                  <Checkbox checked={isSelected} />
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName}`}
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      flex: 1,
                      mr: 1,
                    }}
                  />
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                      setViewOpen(true);
                    }}
                  >
                    Show Detail
                  </Button>
                </MenuItem>
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} />}
          <Box display="flex" gap={1}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedUser ? (
        <ViewUserDialog
          open={viewOpen}
          userId={selectedUser?.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
