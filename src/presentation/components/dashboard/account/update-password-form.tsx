'use client';

import * as React from 'react';
import { ChangePasswordRequest } from '@/domain/models/user/request/change-password-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { useUserInfo } from '@/presentation/hooks/user/use-user-info';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export function UpdatePasswordForm(): React.JSX.Element {
  const { t } = useTranslation();
  const { userUsecase } = useDI();
  const { user, loading } = useUserInfo();

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (loading || !user) return <div>Loading...</div>;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // prevent page reload

    if (!oldPassword || !newPassword || !confirmPassword) return;

    const userId = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';

    const request = new ChangePasswordRequest({
      userId,
      oldPassword,
      newPassword,
      passwordConfirm: confirmPassword,
    });

    setIsSubmitting(true);
    try {
      await userUsecase.changePassword(request);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarUrl = user?.thumbnail?.resourceUrl ?? user?.employee?.avatar;

  return (
    <form onSubmit={handleSubmit}>
      <Card
        sx={{
          p: 0,
          backgroundColor: 'var(--mui-palette-common-white)',
          color: 'var(--mui-palette-primary-main)',
          border: '1px solid var(--mui-palette-primary-main)',
          borderRadius: '16px',
        }}
      >
        <CardHeader subheader={t('updatePassword')} title={t('password')} />
        <Divider sx={{ color: 'var(--mui-palette-primary-main)' }} />
        <CardContent>
          <Grid container spacing={3}>
            {/* Left: Avatar and Name */}
            <Grid item lg={4} md={6} xs={12}>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar src={avatarUrl} sx={{ height: '80px', width: '80px' }} />
                <Stack spacing={1} sx={{ textAlign: 'center' }}>
                  <Typography variant="h5">{user?.employee?.name ?? user?.userName}</Typography>
                  {/* <Typography color="text.secondary" variant="body2">
                    {user?.employee?.address ?? ''}
                  </Typography> */}
                </Stack>
              </Stack>
            </Grid>

            {/* Right: Password Fields */}
            <Grid item lg={8} md={6} xs={12}>
              <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
                <FormControl fullWidth>
                  <InputLabel>{t('oldPassword')}</InputLabel>
                  <OutlinedInput
                    label={t('oldPassword')}
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setShowOldPassword((prev) => !prev);
                          }}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>{t('newPassword')}</InputLabel>
                  <OutlinedInput
                    label={t('newPassword')}
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setShowNewPassword((prev) => !prev);
                          }}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>{t('confirmPassword')}</InputLabel>
                  <OutlinedInput
                    label={t('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setShowConfirmPassword((prev) => !prev);
                          }}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ color: 'var(--mui-palette-primary-main)' }} />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" disabled={isSubmitting}>
            {t('update')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
