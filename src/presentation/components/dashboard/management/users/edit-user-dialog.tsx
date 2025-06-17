'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { UserResponse } from '@/domain/models/user/response/user-response';
import { useRoleOptions } from '@/presentation/hooks/role/use-role-options';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
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
  IconButton,
  InputAdornment,
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
import {
  BagSimple,
  CheckCircle,
  Envelope,
  Eye,
  EyeClosed,
  IdentificationCard,
  Image as ImageIcon,
  Person,
  Phone,
} from '@phosphor-icons/react';

import CustomSnackBar from '../../../core/snack-bar/custom-snack-bar';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

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
          phoneNumber: user.phoneNumber,
          isActive: user.isActive,
          roles: user.roles?.join(','),
          employeeId: user.employeeId,
        })
      );
      setPreviewUrl(user.thumbnail?.resourceUrl || null);
      setConfirmPassword('');
    } else {
      setFormData(new UpdateUserInfoRequest());
      setPreviewUrl(null);
      setConfirmPassword('');
    }
  }, [user]);

  useEffect(() => {
    if (!open) {
      setFormData(new UpdateUserInfoRequest());
      setPreviewUrl(null);
      setConfirmPassword('');
    }
  }, [open]);

  const handleChange = <K extends keyof UpdateUserInfoRequest>(field: K, value: UpdateUserInfoRequest[K]) => {
    setFormData((prev) => new UpdateUserInfoRequest({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== confirmPassword) {
      CustomSnackBar.showSnackbar('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
      loadMoreRoles();
    }
  };

  if (!user) return null;

  const selectedRoles = formData.roles?.split(',') ?? [];

  // Define icon style for bold, filled, and gray appearance
  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161', // Medium-dark gray color
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pr: 1,
        }}
      >
        <Typography variant="h6">User Details</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>{' '}
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
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IdentificationCard {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IdentificationCard {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                value={formData.employeeId || ''}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BagSimple {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth disabled={isSubmitting}>
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
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#2D3748' : '#F7FAFC',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#4A5568' : '#CBD5E0',
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#718096' : '#A0AEC0',
                          },
                        },
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${theme.palette.mode === 'dark' ? '#4A5568 #2D3748' : '#CBD5E0 #F7FAFC'}`,
                      },
                    },
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

            <Grid item xs={12} sm={12}>
              <TextField
                label="Phone Number"
                value={formData.phoneNumber || ''}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Envelope {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CheckCircle {...iconStyle} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                        {showPassword ? <EyeClosed {...iconStyle} /> : <Eye {...iconStyle} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                disabled={isSubmitting}
                error={!!formData.password && !!confirmPassword && formData.password !== confirmPassword}
                helperText={
                  formData.password && confirmPassword && formData.password !== confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CheckCircle {...iconStyle} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                        {showPassword ? <EyeClosed {...iconStyle} /> : <Eye {...iconStyle} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    disabled={isSubmitting}
                  />
                }
                label="Is Active"
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={isSubmitting}
                startIcon={<ImageIcon {...iconStyle} />}
              >
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
              {previewUrl && (
                <Box
                  sx={{
                    width: fullScreen ? 300 : 150,
                    height: fullScreen ? 300 : 150,
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    overflow: 'hidden',
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mx: 'auto',
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
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
