import React, { useEffect, useState } from 'react';
import { UpdateAttendanceRecordsRequest } from '@/domain/models/attendance/request/update-attendance-records-request';
import { type AttendanceRecordDetailResponse } from '@/domain/models/attendance/response/attendance-record-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CheckinTimeEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';

interface EditAttendanceRecordsDialogProps {
  open: boolean;
  data: AttendanceRecordDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateAttendanceRecordsRequest) => void;
}

export function UpdateAttendanceRecordsFormDialog({
  open,
  data: attendanceRecord,
  onClose,
  onSubmit,
}: EditAttendanceRecordsDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { fileUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateAttendanceRecordsRequest>(new UpdateAttendanceRecordsRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (attendanceRecord && open) {
      const newFormData = new UpdateAttendanceRecordsRequest({
        id: attendanceRecord.id || '',
        checkinTime: attendanceRecord.checkinTime || undefined,
        status: attendanceRecord.status || undefined,
      });
      setFormData(newFormData);
    }
  }, [attendanceRecord, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateAttendanceRecordsRequest>(
    field: K,
    value: UpdateAttendanceRecordsRequest[K]
  ) => {
    setFormData((prev) => new UpdateAttendanceRecordsRequest({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      onSubmit(formData);
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!attendanceRecord) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update AttendanceRecords
        </Typography>
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

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body2" mb={2}>
            ID: {attendanceRecord?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Checkin Time"
                value={formData.checkinTime ? DateTimeUtils.formatISODateToString(formData.checkinTime) : undefined}
                onChange={(value) => {
                  handleChange('checkinTime', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<string>
                label="Trạng thái"
                value={formData.status ?? ''}
                onChange={(val) => {
                  handleChange('status', val ?? '');
                }}
                disabled={false}
                options={[
                  { value: CheckinTimeEnum[CheckinTimeEnum.Absent], label: 'Vắng mặt' },
                  { value: CheckinTimeEnum[CheckinTimeEnum.OnTime], label: 'Đúng giờ' },
                  { value: CheckinTimeEnum[CheckinTimeEnum.Late], label: 'Trễ' },
                ]}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            m: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
