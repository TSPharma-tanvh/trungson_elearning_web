'use client';

import { useEffect, useState } from 'react';
import { EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { UserResponse } from '@/domain/models/user/response/user-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import {
  Avatar,
  Box,
  Button,
  Chip,
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

  const EMPLOYEE_FIELDS: { label: string; value: (e: EmployeeResponse) => any }[] = [
    { label: 'Full Name', value: (e) => `${e.firstName ?? ''} ${e.lastName ?? ''}` },
    { label: 'Title', value: (e) => e.title },
    { label: 'Level', value: (e) => e.level },
    { label: 'Level ID', value: (e) => e.levelId },
    { label: 'Code', value: (e) => e.code },
    { label: 'Gender', value: (e) => e.gender },
    { label: 'Phone Number', value: (e) => e.phoneNumber },
    { label: 'Email', value: (e) => e.mail },
    { label: 'Bank', value: (e) => e.bank },
    { label: 'Bank Number', value: (e) => e.bankNumber },
    { label: 'Address', value: (e) => e.address },
    { label: 'City', value: (e) => e.cityName ?? e.city },
    { label: 'Region', value: (e) => e.region },
    { label: 'Postal Code', value: (e) => e.postalCode },
    { label: 'Country', value: (e) => e.country },
    { label: 'District', value: (e) => e.districtName },
    { label: 'Ward', value: (e) => e.wardName },
    { label: 'Birthday', value: (e) => e.birthDay },
    { label: 'Status', value: (e) => e.status },
    { label: 'ASM', value: (e) => e.asm },
    { label: 'Team Name', value: (e) => e.teamName },
    { label: 'Team Code', value: (e) => e.teamCode },
    { label: 'Employee Type', value: (e) => e.currentEmployeeTypeName },
    { label: 'Department Name', value: (e) => e.currentDepartmentName },
    { label: 'Department Type', value: (e) => e.currentDepartmentTypeName },
    { label: 'Position Name', value: (e) => e.currentPositionName },
    { label: 'Position State', value: (e) => e.currentPositionStateName },
    { label: 'Created At', value: (e) => e.createdAt },
  ];

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
      <DialogContent dividers sx={{ typography: 'body2' }}>
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
              <Typography variant="subtitle2" fontWeight={500}>
                User ID
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Username
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.userName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Phone Number
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Is Active
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.isActive ? 'Yes' : 'No'}
              </Typography>
            </Grid>

            {/* Roles */}
            <Grid item xs={6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Roles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.roles?.join(', ') || '-'}
              </Typography>
            </Grid>

            {/* Role Permissions (Grouped) */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={500}>
                Role Permissions
              </Typography>

              {Object.entries(user.rolePermissions).map(([role, perms]) => {
                const groupedPermissions: Record<string, string[]> = {};
                perms.forEach((perm) => {
                  const [group, action] = perm.split('.');
                  if (!groupedPermissions[group]) groupedPermissions[group] = [];
                  groupedPermissions[group].push(action);
                });

                return (
                  <Box key={role} mt={2}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {role}
                    </Typography>

                    <Grid container spacing={1} pl={2}>
                      {Object.entries(groupedPermissions).map(([group, actions]) => (
                        <Grid item xs={12} sm={6} md={4} key={group}>
                          <Box>
                            <Typography variant="body2" fontWeight={600} mb={0.5}>
                              {group}
                            </Typography>
                            {actions.map((action, idx) => (
                              <Chip
                                key={`${group}-${action}-${idx}`}
                                label={action}
                                size="small"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })}
            </Grid>

            {/* Employee Info */}
            {user.employee && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Employee Info</Typography>
                </Grid>

                {EMPLOYEE_FIELDS.map(({ label, value }) => {
                  const fieldValue = value(user.employee!);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={label}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={500} fontSize="0.85rem" noWrap>
                          {label}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {fieldValue ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
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
