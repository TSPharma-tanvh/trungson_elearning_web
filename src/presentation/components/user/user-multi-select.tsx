'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { type UserListResult } from '@/domain/models/user/response/user-list-result';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { type UserUsecase } from '@/domain/usecases/user/user-usecase';
import { useUserSelectDebounce } from '@/presentation/hooks/user/use-user-select-debounced';
import { AccountCircle, InfoOutlined } from '@mui/icons-material';
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

import CustomSnackBar from '../core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '../core/text-field/custom-search-input';
import { ViewUserDialog } from '../dashboard/management/users/view-user-detail-dialog';

interface UserSelectDialogProps extends Omit<SelectProps<string[]>, 'value' | 'onChange'> {
  userUsecase: UserUsecase | null;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function UserMultiSelectDialog({
  userUsecase,
  value,
  onChange,
  label = 'users',
  disabled = false,
  ...selectProps
}: UserSelectDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useUserSelectDebounce(localSearchText, 300);
  const [selectedUserMap, setSelectedUserMap] = useState<Record<string, UserResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isFull = isSmallScreen || isFullscreen;

  const loadUsers = async (page: number, reset = false) => {
    if (!userUsecase || loadingUsers || !dialogOpen) return;

    setLoadingUsers(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetUserRequest({
        searchTerm: debouncedSearchText || undefined,
        pageNumber: page,
        pageSize: 10,
        isActive: true,
      });

      const result: UserListResult = await userUsecase.getUserListInfo(request);
      if (dialogOpen) {
        setUsers((prev) => (reset || page === 1 ? result.users : [...prev, ...result.users]));
        setHasMore(result.users.length > 0 && result.totalRecords > users.length + result.users.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      if (dialogOpen) setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      setUsers([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      void loadUsers(1, true);
    }
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, [dialogOpen, debouncedSearchText]);

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
          if (updated) setSelectedUserMap(newMap);
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
  }, [userUsecase, value]);

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
        <InputLabel id="user-select-label">{t(label)}</InputLabel>
        <Select
          labelId="user-select-label"
          multiple
          value={loading ? [] : value || []}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={<AccountCircle sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(selected) =>
            loading
              ? 'loading'
              : selected
                  .map((id) => {
                    const user = selectedUserMap[id];
                    return user ? `${user.employee?.name} (${user.userName})` : id;
                  })
                  .join(', ')
          }
          open={false}
          {...selectProps}
        >
          {Object.values(selectedUserMap).map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {`${user.employee?.name} (${user.userName})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dialog chọn user */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography mb={1}>{t('selectUser')}</Typography>
            <Box>
              <IconButton onClick={() => setIsFullscreen((prev) => !prev)}>
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('searchUser')} />
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ listStyle: 'none', p: 0 }}>
            {users.map((user) => {
              const isSelected = localValue.includes(user.id);
              return (
                <MenuItem key={user.id} selected={isSelected} onClick={() => handleToggle(user.id)}>
                  <Checkbox checked={isSelected} />
                  <Avatar
                    src={user?.employee?.avatar}
                    alt={user?.employee?.name}
                    sx={{ width: 32, height: 32, mr: 2 }}
                  />
                  <ListItemText
                    primary={`${user.employee?.name} (${user.userName})`}
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      flex: 1,
                      mr: 1,
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                      setViewOpen(true);
                    }}
                    aria-label="Show Details"
                  >
                    <InfoOutlined />
                  </IconButton>
                </MenuItem>
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} />}
          <Box display="flex" gap={1}>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button onClick={handleSave} variant="contained">
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* View detail user */}
      {selectedUser && (
        <ViewUserDialog open={viewOpen} userId={selectedUser?.id ?? null} onClose={() => setViewOpen(false)} />
      )}
    </>
  );
}
