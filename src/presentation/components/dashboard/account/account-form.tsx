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
import { useTranslation } from 'react-i18next';

import { UpdatePasswordForm } from './update-password-form';

export function AccountForm(): React.JSX.Element {
  const { t } = useTranslation();
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

  const handleChange = (field: keyof UpdateUserInfoRequest, value: unknown) => {
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

      if (updatedUser.id !== undefined) {
        const userJson = updatedUser.toJSON() as Record<string, unknown>;
        StoreLocalManager.saveLocalData(AppStrings.USER_DATA, userJson);
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: AppStrings.USER_DATA,
            newValue: JSON.stringify(userJson),
          })
        );
      }

      setLocalUser(updatedUser);

      if (formData.thumbnail instanceof File) {
        setThumbnailPreview(URL.createObjectURL(formData.thumbnail));
      }
    } catch (error) {
      return undefined;
    }
  };

  const avatarUrl = thumbnailPreview ?? user?.thumbnail?.resourceUrl ?? user?.employee?.avatar;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Typography variant="h4" marginBottom={4} sx={{ color: 'var(--mui-palette-secondary-main)' }}>
          {t('account')}
        </Typography>
      </div>
      <Card
        sx={{
          p: 0,
          backgroundColor: 'var(--mui-palette-common-white)',
          color: 'var(--mui-palette-primary-main)',
          border: '1px solid var(--mui-palette-primary-main)',
          borderRadius: '16px',
        }}
      >
        <CardHeader subheader={t('theInformationCanBeEdited')} title={t('profile')} />
        <Divider
          sx={{
            color: 'var(--mui-palette-primary-main)',
          }}
        />
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
                    {localUser?.employee?.address ?? ''}
                  </Typography>
                </Stack>
                <Button variant="text" component="label">
                  {t('uploadPicture')}
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Button>
              </Stack>
            </Grid>

            {/* Right: Info fields */}
            <Grid item lg={8} md={6} xs={12}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="first-name">{t('firstName')}</InputLabel>
                    <OutlinedInput
                      id="first-name"
                      label={t('firstName')}
                      value={formData.firstName || ''}
                      onChange={(e) => {
                        handleChange('firstName', e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="last-name">{t('lastName')}</InputLabel>
                    <OutlinedInput
                      id="last-name"
                      label={t('lastName')}
                      value={formData.lastName || ''}
                      onChange={(e) => {
                        handleChange('lastName', e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="email">{t('email')}</InputLabel>
                    <OutlinedInput
                      id="email"
                      label={t('email')}
                      value={formData.email || ''}
                      onChange={(e) => {
                        handleChange('email', e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="phoneNumber">{t('phoneNumber')}</InputLabel>
                    <OutlinedInput
                      id="phoneNumber"
                      label={t('phoneNumber')}
                      value={formData.phoneNumber || ''}
                      onChange={(e) => {
                        handleChange('phoneNumber', e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        <Divider
          sx={{
            color: 'var(--mui-palette-primary-main)',
          }}
        />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            {t('save')}
          </Button>
        </CardActions>
      </Card>

      <Box mt={4}>
        <UpdatePasswordForm />
      </Box>
    </form>
  );
}
