'use client';

import React, { useEffect, useState } from 'react';
import { type UserPathProgressDetailResponse } from '@/domain/models/user-path/response/user-path-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
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
  Stack,
  Typography,
} from '@mui/material';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UserPathProgressProps {
  open: boolean;
  userPathProgressId: string | null;
  onClose: () => void;
}

function UserPathProgressDetails({
  userPathProgress,
  fullScreen,
}: {
  userPathProgress: UserPathProgressDetailResponse;
  fullScreen: boolean;
}) {
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderPath = () => {
    const coursePath = userPathProgress.coursePath;
    if (!coursePath) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Enrollment Criteria" />
        <CardContent>
          <Box key={coursePath.id} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {renderField('ID', coursePath.id)}
              {renderField('Name', coursePath.name)}
              {renderField('Description', coursePath.detail)}
              {renderField('Target Type', coursePath.isRequired ? 'Required' : 'Optional')}
              {renderField('Start Time', coursePath.startTime ? new Date(coursePath.startTime).toLocaleString() : '')}
              {renderField('End Time', coursePath.endTime ? new Date(coursePath.endTime).toLocaleString() : '')}
              {renderField('Status', coursePath.status)}
              {renderField('Display Type', coursePath.displayType)}
              {renderField('Category ID', coursePath.categoryID)}
              {renderField('Category Name', coursePath.category?.categoryName)}
              {renderField('Thumbnail ID', coursePath.thumbnailID)}
              {renderField('Thumbnail Name', coursePath.thumbnail?.name)}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderUserInformation = () => {
    const user = userPathProgress.user;
    if (!user) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="User Information" />
        <CardContent>
          <Box key={user.id} sx={{ mb: 2 }}>
            {/* Avatar */}
            {user.employee?.avatar ? (
              <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 100, height: 100 }} src={user.employee?.avatar ?? user.thumbnail?.resourceUrl}>
                    {user.firstName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} noWrap>
                      {user.employee?.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" noWrap>
                      {user.userName}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ) : null}

            <Grid container spacing={2}>
              {renderField('ID', user.id)}
              {renderField('Username', user.userName)}
              {renderField('Email', user.email)}
              {renderField('First Name', user.firstName)}
              {renderField('Last Name', user.lastName)}
              {renderField('Phone Number', user.phoneNumber)}
              {renderField('Is Active', user.isActive ? 'Yes' : 'No')}
              {renderField('Employee ID', user.employeeId)}
              {renderField('Thumbnail ID', user.thumbnailId)}
              {renderField('Thumbnail Name', user.thumbnail?.name)}
              {renderField('Roles', user.roles?.join(', '))}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      {/* <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={userPathProgress.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {userPathProgress.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{userPathProgress.name ?? 'Unnamed UserPathProgress'}</Typography>
      </Box> */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title="UserPathProgress Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', userPathProgress.id)}
            {renderField('userID', userPathProgress.userID)}
            {renderField('pathID', userPathProgress.pathID)}
            {renderField('progress', userPathProgress.progress)}
            {renderField('startDate', userPathProgress.startDate)}
            {renderField('endDate', userPathProgress.endDate)}
            {renderField('lastAccess', userPathProgress.lastAccess)}
            {renderField('status', userPathProgress.status)}
            {renderField('enrollmentID', userPathProgress.enrollmentID)}
          </Grid>
        </CardContent>
      </Card>
      {renderPath()}
      {renderUserInformation()}
    </Box>
  );
}

export default function UserPathProgressDetailForm({ open, userPathProgressId, onClose }: UserPathProgressProps) {
  const { userPathProgressUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [userPathProgress, setUserPathProgress] = useState<UserPathProgressDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && userPathProgressId && userPathProgressUsecase) {
      setLoading(true);
      userPathProgressUsecase
        .getUserPathProgressById(userPathProgressId)
        .then(setUserPathProgress)
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
          setUserPathProgress(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userPathProgressId, userPathProgressUsecase]);

  if (!userPathProgressId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">UserPathProgress Details</Typography>
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
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !userPathProgress ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <UserPathProgressDetails userPathProgress={userPathProgress} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
