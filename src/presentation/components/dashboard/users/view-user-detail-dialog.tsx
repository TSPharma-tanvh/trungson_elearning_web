'use client';

import { useEffect, useState } from 'react';
import { UserResponse } from '@/domain/models/user/response/user-response';
import { UserUsecase } from '@/domain/usecases/user/user-usecase';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  userId: string | null;
  onClose: () => void;
}

export function ViewUserDialog({ open, userId, onClose }: Props) {
  const { userUsecase } = useDI();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      userUsecase
        .getUserInfoWithId(userId)
        .then(setUser)
        .catch((err) => {
          console.error('Failed to fetch user detail:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [open, userId, userUsecase]);

  if (!userId) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        {loading || !user ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {/* Thumbnail */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={user.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
                  {user.firstName?.[0]}
                </Avatar>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            </Grid>

            {/* Basic Info */}
            <Grid item xs={6}>
              <Typography variant="subtitle2">User ID</Typography>
              <Typography>{user.id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Username</Typography>
              <Typography>{user.userName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography>{user.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Is Active</Typography>
              <Typography>{user.isActive ? 'Yes' : 'No'}</Typography>
            </Grid>

            {/* Roles */}
            <Grid item xs={12}>
              <Typography variant="subtitle2">Roles</Typography>
              <Typography>{user.roles?.join(', ') || '-'}</Typography>
            </Grid>

            {/* Role Permissions */}
            <Grid item xs={12}>
              <Typography variant="subtitle2">Role Permissions</Typography>
              {Object.entries(user.rolePermissions).map(([role, perms]) => (
                <Box key={role} ml={2} mb={1}>
                  <Typography fontWeight="bold">{role}:</Typography>
                  <Typography>{perms.join(', ')}</Typography>
                </Box>
              ))}
            </Grid>

            {/* Employee Info */}
            {user.employee && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Employee Info</Typography>
                </Grid>
                {Object.entries(user.employee).map(([key, value]) => (
                  <Grid item xs={6} key={key}>
                    <Typography variant="subtitle2">{key}</Typography>
                    <Typography>{String(value ?? '')}</Typography>
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
