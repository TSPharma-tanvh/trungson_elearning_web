'use client';

import React, { useEffect, useState } from 'react';
import { ClassResponse } from '@/domain/models/class/response/class-response';
import { FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { DateTimeUtils } from '@/utils/date-time-utils';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import { CustomVideoPlayer } from '@/presentation/components/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/file/image-preview-dialog';

interface Props {
  open: boolean;
  classId: string | null;
  onClose: () => void;
}

function ClassDetailsForm({ classes, fullScreen }: { classes: ClassResponse; fullScreen: boolean }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollmentCriteria = () => {
    if (!classes.enrollmentCriteria || classes.enrollmentCriteria.length === 0) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Enrollment Criteria" />
        <CardContent>
          {classes.enrollmentCriteria.map((criteria, index) => (
            <Box key={criteria.id ?? index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Criteria #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                {renderField('ID', criteria.id)}
                {renderField('Name', criteria.name)}
                {renderField('Description', criteria.desc)}
                {renderField('Target Type', criteria.targetType)}
                {renderField('Target ID', criteria.targetID)}
                {renderField('Target Level ID', criteria.targetLevelID)}
                {renderField('Max Capacity', criteria.maxCapacity)}
                {renderField('Target Pharmacy ID', criteria.targetPharmacyID)}
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderFileResources = () => {
    if (!classes.fileClassRelation?.length) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Attached Files" />
        <CardContent>
          <Grid container spacing={2}>
            {classes.fileClassRelation.map((r) => {
              const res = r.fileResources;
              if (!res) return null;

              const isImage = res.type?.startsWith('image');
              const isVideo = res.type?.startsWith('video');
              const isOther = !isImage && !isVideo;

              return (
                <Grid item xs={12} sm={fullScreen ? 4 : 6} key={res.id}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%',
                      borderRadius: 1,
                      overflow: 'hidden',
                      mb: 1,
                    }}
                  >
                    {isImage && (
                      <Box
                        component="img"
                        src={res.resourceUrl}
                        alt={res.name}
                        onClick={() => setPreviewUrl(res.resourceUrl ?? '')}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                      />
                    )}

                    {isVideo && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <CustomVideoPlayer src={res.resourceUrl ?? ''} fullscreen={fullScreen} />
                      </Box>
                    )}

                    {isOther && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">No preview</Typography>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="body2" noWrap>
                    {res.name}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>

          {/* Preview image modal */}
          {previewUrl && (
            <ImagePreviewDialog
              open={Boolean(previewUrl)}
              onClose={() => setPreviewUrl(null)}
              imageUrl={previewUrl}
              title="Image Preview"
              fullscreen={fullScreen}
              onToggleFullscreen={() => {}}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={classes.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {classes.className?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{classes.className ?? 'Unnamed Class'}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Class Information" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('ID', classes.id)}
            {renderField('Class Name', classes.className)}
            {renderField('Class Detail', classes.classDetail)}
            {renderField('Duration', classes.duration)}
            {renderField('Location ID', classes.locationID)}
            {renderField('Teacher ID', classes.teacherID)}
            {renderField('Class Type', classes.classType)}
            {renderField('Meeting Link', classes.meetingLink)}
            {renderField('Schedule Status', classes.scheduleStatus)}
            {renderField('Category ID', classes.categoryID)}
            {renderField('Thumbnail ID', classes.thumbnailID)}
            {renderField('Minute Late', classes.minuteLate)}
            {renderField(
              'Start At',
              classes.startAt ? DateTimeUtils.formatISODateFromDate(classes.startAt) : undefined
            )}
            {renderField('End At', classes.endAt ? DateTimeUtils.formatISODateFromDate(classes.endAt) : undefined)}
            {classes.qrCodeURL && (
              <Grid item xs={12} sm={fullScreen ? 4 : 6}>
                <Typography variant="subtitle2" fontWeight={500}>
                  QR Code
                </Typography>
                <Box component="img" src={classes.qrCodeURL} alt="QR Code" sx={{ maxWidth: '100%', height: 'auto' }} />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {renderEnrollmentCriteria()}
      {renderFileResources()}
    </Box>
  );
}

export default function ClassDetailForm({ open, classId, onClose }: Props) {
  const { classUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [classes, setClass] = useState<ClassResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && classId && classUsecase) {
      setLoading(true);
      classUsecase
        .getClassById(classId)
        .then(setClass)
        .catch((error) => {
          console.error('Error fetching Class details:', error);
          setClass(null);
        })
        .finally(() => setLoading(false));
    }
  }, [open, classId, classUsecase]);

  if (!classId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Class Details</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !classes ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <ClassDetailsForm classes={classes} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
