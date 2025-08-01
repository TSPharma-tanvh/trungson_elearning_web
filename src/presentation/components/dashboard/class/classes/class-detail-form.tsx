'use client';

import React, { useEffect, useState } from 'react';
import { type ClassResponse } from '@/domain/models/class/response/class-response';
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
import { useTranslation } from 'react-i18next';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

interface ClassDetailProps {
  open: boolean;
  classId: string | null;
  onClose: () => void;
}

function ClassDetailsForm({ classes, fullScreen }: { classes: ClassResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fullScreenQR, setFullScreenQR] = useState(false);

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 3 : 4}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollmentCriteria = () => {
    if (!classes.enrollmentCriteria || classes.enrollmentCriteria.length === 0) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('enrollment')} />
        <CardContent>
          {classes.enrollmentCriteria.map((criteria, index) => (
            <Box key={criteria.id ?? index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {t('criteria')} #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                {renderField('id', criteria.id)}
                {renderField('name', criteria.name)}
                {renderField('description', criteria.desc)}
                {renderField(
                  'targetType',
                  criteria.targetType !== undefined
                    ? t(criteria.targetType?.charAt(0).toLowerCase() + t(criteria.targetType).slice(1))
                    : ''
                )}
                {renderField('targetId', criteria.targetID)}
                {renderField('targetLevelId', criteria.targetLevelID)}
                {renderField('maxCapacity', criteria.maxCapacity)}
                {renderField('targetPharmacyId', criteria.targetPharmacyID)}
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
        <CardHeader title={t('attachedFiles')} />
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
                    {isImage ? (
                      <Box
                        component="img"
                        src={res.resourceUrl}
                        alt={res.name}
                        onClick={() => {
                          setPreviewUrl(res.resourceUrl ?? '');
                        }}
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
                    ) : null}

                    {isVideo ? (
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
                    ) : null}

                    {isOther ? (
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
                        <Typography variant="body2">{t('noPreview')}</Typography>
                      </Box>
                    ) : null}
                  </Box>

                  <Typography variant="body2" noWrap>
                    {res.name}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
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
        <Typography variant="h5">{classes.className ?? ''}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('classInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', classes.id)}
            {renderField('className', classes.className)}
            {renderField('classDetail', classes.classDetail)}
            {renderField('duration', classes.duration)}
            {renderField('locationId', classes.locationID)}
            {renderField('teacherId', classes.teacherID)}
            {renderField(
              'classType',
              classes.classType !== undefined
                ? t(classes.classType?.charAt(0).toLowerCase() + t(classes.classType).slice(1))
                : ''
            )}
            {renderField('meetingLink', classes.meetingLink)}
            {renderField(
              'scheduleStatus',
              classes.scheduleStatus !== undefined
                ? t(classes.scheduleStatus?.charAt(0).toLowerCase() + t(classes.scheduleStatus).slice(1))
                : ''
            )}
            {renderField('categoryId', classes.categoryID)}
            {renderField('thumbnailId', classes.thumbnailID)}
            {renderField('minuteLate', classes.minuteLate)}
            {renderField('startAt', classes.startAt ? DateTimeUtils.formatISODateFromDate(classes.startAt) : undefined)}
            {renderField('endAt', classes.endAt ? DateTimeUtils.formatISODateFromDate(classes.endAt) : undefined)}
            {classes.qrCode?.resourceUrl ? (
              <Grid item xs={12} sm={fullScreen ? 4 : 6}>
                <Typography variant="subtitle2" fontWeight={500}>
                  {t('qrCode')}
                </Typography>
                <Box
                  component="img"
                  src={classes.qrCode?.resourceUrl}
                  alt="QR Code"
                  sx={{ maxWidth: '80px', height: 'auto' }}
                  onClick={() => {
                    setPreviewUrl(classes.qrCode?.resourceUrl ?? '');
                  }}
                />
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>

      {renderEnrollmentCriteria()}
      {renderFileResources()}

      {previewUrl ? (
        <ImagePreviewDialog
          open={Boolean(previewUrl)}
          onClose={() => {
            setPreviewUrl(null);
          }}
          imageUrl={previewUrl}
          title={t('imagePreview')}
          fullscreen={fullScreenQR}
          onToggleFullscreen={() => {
            setFullScreenQR((prev) => !prev);
          }}
        />
      ) : null}
    </Box>
  );
}

export default function ClassDetailForm({ open, classId, onClose }: ClassDetailProps) {
  const { t } = useTranslation();
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
        .catch(() => {
          setClass(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, classId, classUsecase]);

  if (!classId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('classDetails')}</Typography>
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
