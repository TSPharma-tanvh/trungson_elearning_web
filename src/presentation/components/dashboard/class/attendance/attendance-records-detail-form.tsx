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
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {label}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  const renderEnrollment = () => {
    const enrollment = attendanceRecord.enrollment;
    if (!enrollment) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Enrollment Info" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Enrollment ID', enrollment.id)}
            {renderField('Enrollment Criteria ID', enrollment.enrollmentCriteriaID)}
            {renderField('Enrollment Date', DateTimeUtils.formatISODateFromDate(enrollment.enrollmentDate))}
            {renderField('Approved At', DateTimeUtils.formatISODateFromDate(enrollment.approvedAt))}
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
        <CardHeader title="Class Info" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Class ID', cls.id)}
            {renderField('Class Name', cls.className)}
            {renderField('Class Detail', cls.classDetail)}
            {renderField('Class Type', cls.classType)}
            {renderField('Duration', cls.duration)}
            {renderField('Start At', DateTimeUtils.formatISODateFromDate(cls.startAt))}
            {renderField('End At', DateTimeUtils.formatISODateFromDate(cls.endAt))}
            {renderField('QR Code', cls.qrCodeURL)}
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
        <CardHeader title="User Info" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Employee Name', emp.name)}
            {renderField('Gender', emp.gender)}
            {renderField('Phone Number', user.phoneNumber)}
            {renderField('Email', user.email)}
            {renderField('Department', emp.currentDepartmentName)}
            {renderField('Position', emp.currentPositionName)}
            {renderField('City', emp.cityName)}
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
        <CardHeader title="Attendance Record Info" />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('Record ID', attendanceRecord.id)}
            {renderField('Status', attendanceRecord.status)}
            {renderField('User ID', attendanceRecord.userID)}
            {renderField('Class ID', attendanceRecord.classID)}
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
        <Typography variant="h6">AttendanceRecord Details</Typography>
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
