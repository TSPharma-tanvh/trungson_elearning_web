'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { useRoleOptions } from '@/presentation/hooks/role/use-role-options';
import { useDI } from '@/presentation/hooks/use-dependency-container';
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
  CheckCircle,
  Envelope,
  Eye,
  EyeClosed,
  IdentificationCard,
  Image as ImageIcon,
  Person,
  Phone,
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { EmployeeSelectDialog } from '@/presentation/components/shared/management/employee/employee-select';

import CustomSnackBar from '../../../core/snack-bar/custom-snack-bar';

interface EditUserDialogProps {
  open: boolean;
  user: UserResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserInfoRequest) => void;
}

export function EditUserDialog({ open, user, onClose, onSubmit }: EditUserDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<UpdateUserInfoRequest>(new UpdateUserInfoRequest());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const { roleUseCase, employeeUsecase } = useDI();
  const { roleOptions, loadMoreRoles, hasMore, loading } = useRoleOptions(roleUseCase);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (open && user) {
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
    }

    if (!open) {
      setFormData(new UpdateUserInfoRequest());
      setPreviewUrl(null);
      setConfirmPassword('');
    }
  }, [open, user]);

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
      onSubmit(formData);
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
      void loadMoreRoles();
    }
  };

  const selectedRoles = formData.roles?.split(',') ?? [];

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
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
        <Typography variant="h6">{t('userDetails')}</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
          >
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
            {t('userId')}: {user?.id ?? ''}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label={t('userName')}
                value={formData.userName || ''}
                onChange={(e) => {
                  handleChange('userName', e.target.value);
                }}
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

            {/* <Grid item xs={12} sm={6}>
              <TextField
                label={t('firstName')}
                value={formData.firstName || ''}
                onChange={(e) => {
                  handleChange('firstName', e.target.value);
                }}
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
                label={t('lastName')}
                value={formData.lastName || ''}
                onChange={(e) => {
                  handleChange('lastName', e.target.value);
                }}
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
            </Grid> */}

            <Grid item xs={12}>
              <EmployeeSelectDialog
                employeeUsecase={employeeUsecase}
                value={formData.employeeId ?? ''}
                onChange={(value: string) => {
                  handleChange('employeeId', value);
                }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel id="edit-role-select-label">{t('roles')}</InputLabel>
                <Select
                  multiple
                  labelId="edit-role-select-label"
                  value={selectedRoles}
                  onChange={(e) => {
                    handleChange('roles', (e.target.value as string[]).join(','));
                  }}
                  input={<OutlinedInput label="Roles" />}
                  renderValue={(selected) =>
                    selected.length === 0
                      ? t('selectRole')
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
                        scrollbarColor: theme.palette.mode === 'dark' ? '#4A5568 #2D3748' : '#CBD5E0 #F7FAFC',
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
                  {loading ? (
                    <Box textAlign="center" py={1}>
                      <CircularProgress size={20} />
                    </Box>
                  ) : null}
                </Select>
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={12}>
              <TextField
                label={t('phoneNumber')}
                value={formData.phoneNumber || ''}
                onChange={(e) => {
                  handleChange('phoneNumber', e.target.value);
                }}
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
                label={t('email')}
                value={formData.email || ''}
                onChange={(e) => {
                  handleChange('email', e.target.value);
                }}
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
            </Grid> */}

            <Grid item xs={12} sm={12}>
              <TextField
                label={t('password')}
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => {
                  handleChange('password', e.target.value);
                }}
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
                      <IconButton
                        onClick={() => {
                          setShowPassword((prev) => !prev);
                        }}
                        edge="end"
                      >
                        {showPassword ? <EyeClosed {...iconStyle} /> : <Eye {...iconStyle} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label={t('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                fullWidth
                disabled={isSubmitting}
                error={Boolean(formData.password) && Boolean(confirmPassword) && formData.password !== confirmPassword}
                helperText={
                  formData.password && confirmPassword && formData.password !== confirmPassword
                    ? t('passwordDoNotMatch')
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
                      <IconButton
                        onClick={() => {
                          setShowPassword((prev) => !prev);
                        }}
                        edge="end"
                      >
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
                    checked={Boolean(formData.isActive)}
                    onChange={(e) => {
                      handleChange('isActive', e.target.checked);
                    }}
                    disabled={isSubmitting}
                  />
                }
                label={t('isActive')}
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
                {t('uploadThumbnail')}
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
              {previewUrl ? (
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
              ) : null}
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
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
