'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { UserResponse } from '@/domain/models/user/response/user-response';
import { useRoleOptions } from '@/presentation/hooks/role/use-role-options';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import {
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
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface EditUserDialogProps {
  open: boolean;
  user: UserResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserInfoRequest) => void;
}

export function EditUserDialog({ open, user, onClose, onSubmit }: EditUserDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<UpdateUserInfoRequest>(new UpdateUserInfoRequest());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const roleUsecase = useDI().roleUseCase;
  const { roleOptions, loadMoreRoles, hasMore, loading } = useRoleOptions(roleUsecase);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(
        new UpdateUserInfoRequest({
          userName: user.userName,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          roles: user.roles?.join(','),
          employeeId: user.employeeId,
        })
      );

      if (user.thumbnail?.resourceUrl) {
        setPreviewUrl(user.thumbnail.resourceUrl);
      }
    }
  }, [user]);

  const handleChange = <K extends keyof UpdateUserInfoRequest>(field: K, value: UpdateUserInfoRequest[K]) => {
    setFormData((prev) => new UpdateUserInfoRequest({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
    onClose();
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
      loadMoreRoles();
    }
  };

  if (!user) return null;

  const selectedRoles = formData.roles?.split(',') ?? [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <Typography variant="body2" mb={2}>
            ID: {user.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="User Name"
                value={formData.userName || ''}
                onChange={(e) => handleChange('userName', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                value={formData.employeeId || ''}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="edit-role-select-label">Roles</InputLabel>
                <Select
                  multiple
                  labelId="edit-role-select-label"
                  value={selectedRoles}
                  onChange={(e) => handleChange('roles', (e.target.value as string[]).join(','))}
                  input={<OutlinedInput label="Roles" />}
                  renderValue={(selected) =>
                    selected.length === 0
                      ? 'Select Roles'
                      : roleOptions
                          .filter((opt) => selected.includes(opt.value))
                          .map((opt) => opt.label)
                          .join(', ')
                  }
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                    MenuListProps: {
                      ref: listRef,
                      onScroll: handleScroll,
                    },
                  }}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox checked={selectedRoles.includes(option.value)} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                  {loading && (
                    <Box textAlign="center" py={1}>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                  />
                }
                label="Is Active"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleChange('thumbnail', file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              {previewUrl && (
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Thumbnail Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            m: 2,
          }}
        >
          <Button onClick={onClose} variant="outlined" sx={{ width: isMobile ? '100%' : '180px' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ width: isMobile ? '100%' : '180px' }}>
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
