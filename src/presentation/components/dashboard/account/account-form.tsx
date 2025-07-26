'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { useUserInfo } from '@/presentation/hooks/user/use-user-info';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';

import { UpdatePasswordForm } from './update-password-form';

export function AccountForm(): React.JSX.Element {
  const { userUsecase } = useDI();
  const { user, loading } = useUserInfo();
  const [formData, setFormData] = useState<UpdateUserInfoRequest>(new UpdateUserInfoRequest());
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => {
    if (user) {
      setFormData(
        new UpdateUserInfoRequest({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        })
      );
      setLocalUser(user);
    }
  }, [user]);

  if (loading || !user) return <div>Loading...</div>;

  const handleChange = (field: keyof UpdateUserInfoRequest, value: any) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: value };
      return new UpdateUserInfoRequest(updatedData);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleChange('thumbnail', file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userId = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';
      await userUsecase.updateUserInfo(userId, formData);

      const updatedUser = await userUsecase.getUserInfo();

      if (updatedUser.id != null) {
        const userJson = updatedUser.toJSON();
        StoreLocalManager.saveLocalData(AppStrings.USER_DATA, userJson);
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: AppStrings.USER_DATA,
            newValue: userJson,
          })
        );
      }

      setLocalUser(updatedUser);

      if (formData.thumbnail instanceof File) {
        setThumbnailPreview(URL.createObjectURL(formData.thumbnail));
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const avatarUrl = thumbnailPreview ?? user?.thumbnail?.resourceUrl ?? user?.employee?.avatar;

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* Left: Avatar */}
            <Grid item lg={4} md={6} xs={12}>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar src={avatarUrl} sx={{ height: '80px', width: '80px' }} />
                <Stack spacing={1} sx={{ textAlign: 'center' }}>
                  <Typography variant="h5">
                    {localUser?.firstName ?? '...'} {localUser?.lastName ?? ''}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {localUser?.employee?.city ?? ''}, {localUser?.employee?.country ?? ''}
                  </Typography>
                </Stack>
                <Button variant="text" component="label">
                  Upload picture
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Button>
              </Stack>
            </Grid>

            {/* Right: Info fields */}
            <Grid item lg={8} md={6} xs={12}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="first-name">First name</InputLabel>
                    <OutlinedInput
                      id="first-name"
                      label="First name"
                      value={formData.firstName || ''}
                      onChange={(e) => { handleChange('firstName', e.target.value); }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="last-name">Last name</InputLabel>
                    <OutlinedInput
                      id="last-name"
                      label="Last name"
                      value={formData.lastName || ''}
                      onChange={(e) => { handleChange('lastName', e.target.value); }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <OutlinedInput
                      id="email"
                      label="Email"
                      value={formData.email || ''}
                      onChange={(e) => { handleChange('email', e.target.value); }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
                    <OutlinedInput
                      id="phoneNumber"
                      label="Phone Number"
                      value={formData.phoneNumber || ''}
                      onChange={(e) => { handleChange('phoneNumber', e.target.value); }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Save details
          </Button>
        </CardActions>
      </Card>

      <Box mt={4}>
        <UpdatePasswordForm />
      </Box>
    </form>
  );
}
