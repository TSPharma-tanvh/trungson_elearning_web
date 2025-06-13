'use client';

import { useEffect, useState } from 'react';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { useUserInfo } from '@/presentation/hooks/user/use-user-info';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import { Box, Grid } from '@mui/material';

import { AccountDetailsForm } from './account-details-form';
import { AccountInfo } from './account-info';

export function AccountForm(): React.JSX.Element {
  const { userUsecase } = useDI();
  const { user, loading } = useUserInfo();
  const [formData, setFormData] = useState<UpdateUserInfoRequest>(new UpdateUserInfoRequest());
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(
        new UpdateUserInfoRequest({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        })
      );
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

  const handleSubmit = async () => {
    try {
      const formDataToSend = formData;
      var userId = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';

      const updatedUser = await userUsecase.updateUserInfo(userId, formDataToSend);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <Grid container spacing={3} alignItems="flex-start">
      <Grid item lg={4} md={6} xs={12}>
        <AccountInfo user={user} onUpload={handleImageUpload} thumbnailPreview={thumbnailPreview} />
      </Grid>
      <Grid item lg={8} md={6} xs={12}>
        <AccountDetailsForm user={user} formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
      </Grid>
    </Grid>
  );
}
