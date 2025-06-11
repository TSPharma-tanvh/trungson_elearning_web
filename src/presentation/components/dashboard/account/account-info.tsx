'use client';

import * as React from 'react';
import { UserResponse } from '@/domain/models/user/response/user-response';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  user: UserResponse;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  thumbnailPreview?: string | null;
};

export function AccountInfo({ user, onUpload, thumbnailPreview }: Props): React.JSX.Element {
  const avatarUrl = thumbnailPreview ?? user.thumbnail?.resourceUrl ?? '/assets/avatar.png';

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src={avatarUrl} sx={{ height: '80px', width: '80px' }} />
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.employee?.city}, {user.employee?.country}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" component="label">
          Upload picture
          <input type="file" accept="image/*" hidden onChange={onUpload} />
        </Button>
      </CardActions>
    </Card>
  );
}
