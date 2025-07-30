'use client';

import React, { useEffect, useState } from 'react';
import { type UserDeviceResponse } from '@/domain/models/user-devices/response/user-devices-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

interface UserDevicesDetailProps {
  open: boolean;
  userDevicesId: string | null;
  onClose: () => void;
}
function UserDevicesDetails({ userDevice, fullScreen }: { userDevice: UserDeviceResponse; fullScreen: boolean }) {
  const renderField = (label: string, value?: any) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderUser = () => {
    const u = userDevice.user;
    if (!u) return null;
    const emp = u.employee;
    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="User Info" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('User ID', u.id)}
            {renderField('Name', `${u.firstName} ${u.lastName}`)}
            {renderField('Username', u.userName)}
            {renderField('Email', u.email)}
            {renderField('Phone', u.phoneNumber)}
            {renderField('Employee ID', u.employeeId)}
            {emp ? renderField('Department', emp.currentDepartmentName) : null}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      {userDevice.user?.employee?.avatar ? (
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar src={userDevice.user.employee.avatar} sx={{ width: 64, height: 64 }}>
            {userDevice.user.employee.name?.[0] ?? '?'}
          </Avatar>
          <Typography variant="h5">{userDevice.user.employee.name ?? userDevice.user.userName}</Typography>
        </Box>
      ) : null}

      <Card sx={{ mb: 2 }}>
        <CardHeader title="Device Info" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Record ID', userDevice.id)}
            {renderField('Device Name', userDevice.deviceName)}
            {renderField('Device Type', userDevice.deviceType)}
            {renderField('Device ID', userDevice.deviceID)}
            {renderField('Device Token', userDevice.deviceToken)}
            {renderField('IP Address', userDevice.ipAddress)}
            {renderField(
              'Signed In At',
              userDevice.signInAt ? DateTimeUtils.formatISODateFromDate(userDevice.signInAt) : undefined
            )}
            {renderField(
              'Signed Out At',
              userDevice.signOutAt ? DateTimeUtils.formatISODateFromDate(userDevice.signOutAt) : undefined
            )}
            {renderField(
              'Last Access',
              userDevice.lastAccess ? DateTimeUtils.formatISODateFromDate(userDevice.lastAccess) : undefined
            )}
          </Grid>
        </CardContent>
      </Card>

      {renderUser()}
    </Box>
  );
}
export default function UserDevicesDetailForm({ open, userDevicesId, onClose }: UserDevicesDetailProps) {
  const { userDevicesUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [userDevice, setUserDevice] = useState<UserDeviceResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && userDevicesId && userDevicesUsecase) {
      setLoading(true);
      userDevicesUsecase
        .getUserDevicesById(userDevicesId)
        .then(setUserDevice)
        .catch(() => {
          setUserDevice(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userDevicesId, userDevicesUsecase]);

  if (!userDevicesId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', pr: 1 }}>
        <Typography variant="h6">User Device Details</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setFullScreen((ps) => !ps);
            }}
          >
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !userDevice ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <UserDevicesDetails userDevice={userDevice} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
