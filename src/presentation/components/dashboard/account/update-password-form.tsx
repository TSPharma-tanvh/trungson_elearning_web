'use client';

import * as React from 'react';
import { ChangePasswordRequest } from '@/domain/models/user/request/change-password-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

export function UpdatePasswordForm(): React.JSX.Element {
  const { t } = useTranslation();
  const { userUsecase } = useDI();
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userId = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';
    const request = new ChangePasswordRequest({
      userId,
      oldPassword,
      newPassword,
      passwordConfirm: confirmPassword,
    });

    try {
      await userUsecase.changePassword(request);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      return undefined;
    }
  };

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
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>{t('oldPassword')}</InputLabel>
              <OutlinedInput
                label={t('oldPassword')}
                name="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('newPassword')}</InputLabel>
              <OutlinedInput
                label={t('newPassword')}
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('confirmPassword')}</InputLabel>
              <OutlinedInput
                label={t('confirmPassword')}
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            {t('update')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
