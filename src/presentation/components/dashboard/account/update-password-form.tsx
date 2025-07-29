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

export function UpdatePasswordForm(): React.JSX.Element {
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
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Old Password</InputLabel>
              <OutlinedInput
                label="Old Password"
                name="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>New Password</InputLabel>
              <OutlinedInput
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput
                label="Confirm Password"
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
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
