import React, { useEffect, useState } from 'react';
import { UpdateAttendanceRecordsRequest } from '@/domain/models/attendance/request/update-attendance-records-request';
import { type AttendanceRecordDetailResponse } from '@/domain/models/attendance/response/attendance-record-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CheckinTimeEnum, CheckOutTimeEnum, StatusEnum } from '@/utils/enum/core-enum';
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
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

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
  const { t } = useTranslation();
  const { fileUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateAttendanceRecordsRequest>(new UpdateAttendanceRecordsRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (attendanceRecord && open) {
      const newFormData = new UpdateAttendanceRecordsRequest({
        id: attendanceRecord.id || '',
        checkInTime: attendanceRecord.checkInTime || undefined,
        statusCheckIn: attendanceRecord.statusCheckIn || undefined,
        checkOutTime: attendanceRecord.checkOutTime || undefined,
        statusCheckOut: attendanceRecord.statusCheckOut || undefined,
        startAt: attendanceRecord.startAt || undefined,
        endAt: attendanceRecord.endAt || undefined,
        minuteLate: attendanceRecord.minuteLate || undefined,
        minuteSoon: attendanceRecord.minuteSoon || undefined,
        activeStatus: attendanceRecord.activeStatus || undefined,
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
          {t('updateAttendanceRecords')}
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
            {t('id')}: {attendanceRecord?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startAt')}
                value={formData.startAt?.toISOString()}
                onChange={(val) => {
                  handleChange('startAt', val !== undefined ? new Date(val) : undefined);
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endAt')}
                value={formData.endAt?.toISOString()}
                onChange={(val) => {
                  handleChange('endAt', val !== undefined ? new Date(val) : undefined);
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('minuteLate')}
                type="number"
                value={formData.minuteLate}
                onChange={(val) => {
                  handleChange('minuteLate', Number(val));
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('minuteSoon')}
                type="number"
                value={formData.minuteSoon}
                onChange={(val) => {
                  handleChange('minuteSoon', Number(val));
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('checkInTime')}
                value={formData.checkInTime ? DateTimeUtils.formatISODateToString(formData.checkInTime) : undefined}
                onChange={(value) => {
                  handleChange(
                    'checkInTime',
                    formData.checkInTime !== undefined ? DateTimeUtils.formatStringToDateTime(value ?? '') : undefined
                  );
                }}
                disabled={isSubmitting}
                allowClear
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<string>
                label={t('statusCheckIn')}
                value={formData.statusCheckIn ?? ''}
                onChange={(val) => {
                  handleChange('statusCheckIn', val ?? '');
                }}
                disabled={false}
                options={[
                  { value: CheckinTimeEnum[CheckinTimeEnum.Absent], label: 'absent' },
                  { value: CheckinTimeEnum[CheckinTimeEnum.OnTime], label: 'onTime' },
                  { value: CheckinTimeEnum[CheckinTimeEnum.Late], label: 'late' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('checkOutTime')}
                value={formData.checkOutTime ? DateTimeUtils.formatISODateToString(formData.checkOutTime) : undefined}
                onChange={(value) => {
                  handleChange(
                    'checkOutTime',
                    formData.checkOutTime !== undefined ? DateTimeUtils.formatStringToDateTime(value ?? '') : undefined
                  );
                }}
                disabled={isSubmitting}
                allowClear
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<string>
                label={t('statusCheckOut')}
                value={formData.statusCheckOut ?? ''}
                onChange={(val) => {
                  handleChange('statusCheckOut', val ?? '');
                }}
                disabled={false}
                options={[
                  { value: CheckOutTimeEnum[CheckOutTimeEnum.Soon], label: 'soon' },
                  { value: CheckOutTimeEnum[CheckOutTimeEnum.OnTime], label: 'onTime' },
                  { value: CheckOutTimeEnum[CheckOutTimeEnum.Late], label: 'late' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<string>
                label={t('activeStatus')}
                value={formData.activeStatus ?? ''}
                onChange={(val) => {
                  handleChange('activeStatus', val ?? '');
                }}
                disabled={false}
                options={[
                  { value: StatusEnum[StatusEnum.Enable], label: 'enable' },
                  { value: StatusEnum[StatusEnum.Disable], label: 'disable' },
                  { value: StatusEnum[StatusEnum.Deleted], label: 'deleted' },
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
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
