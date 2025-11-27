'use client';

import { useEffect, useState } from 'react';
import { type EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';

interface ViewUserDetailProps {
  open: boolean;
  userId: string | null;
  onClose: () => void;
}

export function ViewUserDialog({ open, userId, onClose }: ViewUserDetailProps) {
  const { t } = useTranslation();
  const { userUsecase } = useDI();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const EMPLOYEE_FIELDS: { label: string; value: (e: EmployeeResponse) => unknown }[] = [
    { label: 'id', value: (e) => e.id },
    { label: 'code', value: (e) => e.code },
    { label: 'name', value: (e) => e.name },
    { label: 'avatar', value: (e) => e.avatar },
    { label: 'phoneNumber', value: (e) => e.phoneNumber },
    { label: 'mail', value: (e) => e.mail },
    { label: 'birthDay', value: (e) => e.birthDay },
    { label: 'gender', value: (e) => e.gender },
    { label: 'positionCode', value: (e) => e.positionCode },
    { label: 'positionName', value: (e) => e.positionName },
    { label: 'positionStateCode', value: (e) => e.positionStateCode },
    { label: 'positionStateName', value: (e) => e.positionStateName },
    { label: 'departmentTypeCode', value: (e) => e.departmentTypeCode },
    { label: 'departmentTypeName', value: (e) => e.departmentTypeName },
    { label: 'departmentCode', value: (e) => e.departmentCode },
    { label: 'departmentName', value: (e) => e.departmentName },
    { label: 'asmCode', value: (e) => e.asmCode },
    { label: 'asmName', value: (e) => e.asmName },
    { label: 'statusValue', value: (e) => e.statusValue },
    { label: 'status', value: (e) => e.status },
    { label: 'userId', value: (e) => e.userId },
  ];

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      userUsecase
        .getUserInfoWithId(userId)
        .then(setUser)
        .catch(() => {
          undefined;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userId, userUsecase]);

  if (!userId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pr: 1,
        }}
      >
        <Typography variant="h6">{t('userDetails')}</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
          >
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>{' '}
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
                <Avatar src={user.thumbnail?.resourceUrl ?? user?.employee?.avatar} sx={{ width: 64, height: 64 }}>
                  {user.firstName?.[0]}
                </Avatar>
                <Typography variant="h6">
                  {user.employee?.name} ({user.userName})
                </Typography>
              </Box>
            </Grid>

            {/* Basic Info */}
            <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
              <Typography variant="subtitle2" fontWeight={500}>
                {t('userId')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
              <Typography variant="subtitle2" fontWeight={500}>
                {t('username')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.userName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
              <Typography variant="subtitle2" fontWeight={500}>
                {t('phoneNumber')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
              <Typography variant="subtitle2" fontWeight={500}>
                {t('email')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4}>
              <Typography variant="subtitle2" fontWeight={500}>
                {t('isActive')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.isActive ? t('yes') : t('no')}
              </Typography>
            </Grid>

            {/* Roles */}
            <Grid item xs={6}>
              <Typography variant="subtitle2" fontWeight={500}>
                {t('roles')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.roles?.join(', ') || '-'}
              </Typography>
            </Grid>

            {/* Role Permissions (Grouped) */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={500}>
                {t('rolePermissions')}
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
                        <Grid item xs={12} sm={fullScreen ? 4 : 6} md={fullScreen ? 3 : 4} key={group}>
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
            {user.employee ? (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">{t('employeeInfo')}</Typography>
                </Grid>

                {EMPLOYEE_FIELDS.map(({ label, value }) => {
                  const fieldValue = value(user.employee!);
                  return (
                    <Grid item xs={12} sm={fullScreen ? 3 : 6} md={fullScreen ? 3 : 4} key={label}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={500} fontSize="0.85rem" noWrap>
                          {t(label)}
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
                          {String(fieldValue ?? '')}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </>
            ) : null}
          </Grid>
        )}
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions> */}
    </Dialog>
  );
}
