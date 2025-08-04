'use client';

import React, { useEffect, useState } from 'react';
import { type AttendanceRecordDetailResponse } from '@/domain/models/attendance/response/attendance-record-detail-response';
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

interface AttendanceRecordDetailProps {
  open: boolean;
  attendanceRecordId: string | null;
  onClose: () => void;
}
function AttendanceRecordDetails({
  attendanceRecord,
  fullScreen,
}: {
  attendanceRecord: AttendanceRecordDetailResponse;
  fullScreen: boolean;
}) {
  const { t } = useTranslation();

  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollment = () => {
    const enrollment = attendanceRecord.enrollment;
    if (!enrollment) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('enrollmentInfo')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('enrollmentId', enrollment.id)}
            {renderField('enrollmentCriteriaId', enrollment.enrollmentCriteriaID)}
            {renderField('enrollmentDate', DateTimeUtils.formatISODateFromDate(enrollment.enrollmentDate))}
            {renderField('approvedAt', DateTimeUtils.formatISODateFromDate(enrollment.approvedAt))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderClass = () => {
    const cls = attendanceRecord.class;
    if (!cls) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('classInfo')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('classId', cls.id)}
            {renderField('className', cls.className)}
            {renderField('classDetail', cls.classDetail)}
            {renderField(
              'classType',
              cls.classType ? t(cls.classType.charAt(0).toLowerCase() + t(cls.classType).slice(1)) : ''
            )}
            {renderField('duration', cls.duration)}
            {renderField('qrCode', cls.qrCode?.resourceUrl)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderUser = () => {
    const user = attendanceRecord.user;
    const emp = user?.employee;
    if (!emp) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('userInfo')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('employeeName', emp.name)}
            {renderField('gender', emp.gender)}
            {renderField('phoneNumber', user.phoneNumber)}
            {renderField('email', user.email)}
            {renderField('department', emp.currentDepartmentName)}
            {renderField('position', emp.currentPositionName)}
            {renderField('city', emp.cityName)}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={attendanceRecord.user?.employee?.avatar} sx={{ width: 64, height: 64 }}>
          {attendanceRecord.user?.employee?.name?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{attendanceRecord.user?.employee?.name ?? ''}</Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('attendanceRecordInfo')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('recordId', attendanceRecord.id)}
            {renderField(
              'status',
              attendanceRecord.status
                ? t(attendanceRecord.status.charAt(0).toLowerCase() + t(attendanceRecord.status).slice(1))
                : ''
            )}
            {renderField('userId', attendanceRecord.userID)}
            {renderField('classId', attendanceRecord.classID)}
            {renderField('classId', attendanceRecord.classID)}

            {renderField(
              'checkinTime',
              attendanceRecord.checkinTime !== undefined
                ? DateTimeUtils.formatISODateFromDate(attendanceRecord.checkinTime)
                : ''
            )}

            {renderField(
              'startAt',
              attendanceRecord.startAt !== undefined
                ? DateTimeUtils.formatISODateFromDate(attendanceRecord.startAt)
                : ''
            )}

            {renderField(
              'endAt',
              attendanceRecord.endAt !== undefined ? DateTimeUtils.formatISODateFromDate(attendanceRecord.endAt) : ''
            )}

            {renderField('minuteLate', attendanceRecord.minuteLate)}
          </Grid>
        </CardContent>
      </Card>

      {renderClass()}
      {renderEnrollment()}
      {renderUser()}
    </Box>
  );
}

export default function AttendanceRecordDetailForm({ open, attendanceRecordId, onClose }: AttendanceRecordDetailProps) {
  const { t } = useTranslation();
  const { attendanceRecordsUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecordDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && attendanceRecordId && attendanceRecordsUsecase) {
      setLoading(true);
      attendanceRecordsUsecase
        .getAttendanceRecordsById(attendanceRecordId)
        .then(setAttendanceRecord)
        .catch(() => {
          setAttendanceRecord(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, attendanceRecordId, attendanceRecordsUsecase]);

  if (!attendanceRecordId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('attendanceRecordDetails')}</Typography>
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
        {loading || !attendanceRecord ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <AttendanceRecordDetails attendanceRecord={attendanceRecord} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
