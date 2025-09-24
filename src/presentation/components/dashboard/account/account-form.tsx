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
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTextField } from '../../core/text-field/custom-textfield';

export function AccountForm(): React.JSX.Element {
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
  const [isOldValid, setIsOldValid] = React.useState(true);
  const [isNewValid, setIsNewValid] = React.useState(true);
  const [isConfirmValid, setIsConfirmValid] = React.useState(true);

  if (loading || !user) return <div>Loading...</div>;

  const handleSubmit = async () => {
    if (!isOldValid || !isNewValid || !isConfirmValid) {
      console.warn('Password fields are invalid');
      return;
    }

    const userId = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      console.warn('Please fill all password fields');
      return;
    }

    const request = new ChangePasswordRequest({
      userId,
      oldPassword,
      newPassword,
      passwordConfirm: confirmPassword,
    });

    if (!userUsecase?.changePassword) {
      console.error('userUsecase.changePassword is undefined');
      return;
    }

    setIsSubmitting(true);
    try {
      await userUsecase.changePassword(request);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarUrl = user?.thumbnail?.resourceUrl ?? user?.employee?.avatar;

  return (
    <div>
      <Typography variant="h4" marginBottom={4} sx={{ color: 'var(--mui-palette-secondary-main)' }}>
        {t('account')}
      </Typography>

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
            <Grid item lg={4} md={6} xs={12}>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar src={avatarUrl} sx={{ height: '80px', width: '80px' }} />
                <Stack spacing={1} sx={{ textAlign: 'center' }}>
                  <Typography variant="h5">{user?.employee?.name ?? user?.userName}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {user?.employee?.address ?? ''}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item lg={8} md={6} xs={12}>
              <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
                <CustomTextField
                  label={t('oldPassword')}
                  value={oldPassword}
                  onChange={setOldPassword}
                  disabled={isSubmitting}
                  type={showOldPassword ? 'text' : 'password'}
                  icon={
                    <IconButton onClick={() => setShowOldPassword((prev) => !prev)} edge="end">
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  required
                  onValidationChange={setIsOldValid}
                />

                <CustomTextField
                  label={t('newPassword')}
                  value={newPassword}
                  onChange={setNewPassword}
                  disabled={isSubmitting}
                  type={showNewPassword ? 'text' : 'password'}
                  icon={
                    <IconButton onClick={() => setShowNewPassword((prev) => !prev)} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  required
                  onValidationChange={setIsNewValid}
                />

                <CustomTextField
                  label={t('confirmPassword')}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  disabled={isSubmitting}
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={
                    <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  required
                  onValidationChange={setIsConfirmValid}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ color: 'var(--mui-palette-primary-main)' }} />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" disabled={isSubmitting} onClick={handleSubmit}>
            {t('update')}
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
