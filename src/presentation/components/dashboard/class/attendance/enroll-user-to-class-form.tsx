'use client';

import React, { useState } from 'react';
import { EnrollUserListToClassRequest } from '@/domain/models/attendance/request/enroll-user-to-class-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { ApproveStatusEnum, CategoryEnum, CheckinTimeEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { ClassSelectDialog } from '@/presentation/components/shared/classes/class/class-select';
import { EnrollmentSingleSelect } from '@/presentation/components/shared/enrollment/enrollment-single-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';

interface CreateAttendanceRecordsProps {
  disabled?: boolean;
  onSubmit: (data: EnrollUserListToClassRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateAttendanceRecordsDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateAttendanceRecordsProps) {
  const { userUsecase, enrollUsecase, classUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [form, setForm] = useState<EnrollUserListToClassRequest>(
    new EnrollUserListToClassRequest({
      status: CheckinTimeEnum[CheckinTimeEnum.Absent],
      enrollStatus: ApproveStatusEnum.Approve,
    })
  );

  const handleChange = <K extends keyof EnrollUserListToClassRequest>(
    key: K,
    value: EnrollUserListToClassRequest[K]
  ) => {
    setForm((prev) => new EnrollUserListToClassRequest({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Tạo lớp học</Typography>
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
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: fullScreen ? '100%' : 'auto', p: 2 }}>
        <Grid container spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}>
          <Grid item xs={12} sm={12} mt={1}>
            <UserMultiSelectDialog
              userUsecase={userUsecase}
              value={form.userIDs ? form.userIDs : []}
              onChange={(value: string[]) => {
                handleChange('userIDs', value);
              }}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12}>
            <EnrollmentSingleSelect
              label="Class Enrollment"
              enrollmentUsecase={enrollUsecase}
              value={form.enrollmentCriteriaID ?? ''}
              onChange={(value: string) => {
                handleChange('enrollmentCriteriaID', value);
              }}
              disabled={false}
              categoryEnum={CategoryEnum.Class}
            />
          </Grid>

          <Grid item xs={12}>
            <ClassSelectDialog
              classUsecase={classUsecase}
              value={form.classID ?? ''}
              onChange={(value: string) => {
                handleChange('classID', value);
              }}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown<string>
              label="Trạng thái"
              value={form.status ?? ''}
              onChange={(val) => {
                handleChange('status', val ?? '');
              }}
              disabled={disabled}
              options={[
                { value: CheckinTimeEnum[CheckinTimeEnum.Absent], label: 'Vắng mặt' },
                { value: CheckinTimeEnum[CheckinTimeEnum.OnTime], label: 'Đúng giờ' },
                { value: CheckinTimeEnum[CheckinTimeEnum.Late], label: 'Trễ' },
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomSelectDropDown<ApproveStatusEnum>
              label="Duyệt"
              value={form.enrollStatus!}
              onChange={(val) => {
                handleChange('enrollStatus', val);
              }}
              disabled={disabled}
              options={[
                { value: ApproveStatusEnum.Approve, label: 'Chấp nhận' },
                { value: ApproveStatusEnum.Reject, label: 'Từ chối' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              label="Tạo lớp"
              onClick={() => {
                onSubmit(form);
              }}
              loading={loading}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
