'use client';

import React, { useEffect, useState } from 'react';
import { EnrollUserListToCourseRequest } from '@/domain/models/user-course/request/enroll-user-list-to-course';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { ApproveStatusEnum, CategoryEnum, UserProgressEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CourseSelectDialog } from '@/presentation/components/shared/courses/courses/courses-select';
import { EnrollmentSingleSelect } from '@/presentation/components/shared/enrollment/enrollment-single-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';

interface UserCourseProgressCreateProps {
  disabled?: boolean;
  onSubmit: (data: EnrollUserListToCourseRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateUserCourseProgressDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: UserCourseProgressCreateProps) {
  const { t } = useTranslation();
  const { userUsecase, courseUsecase, enrollUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [_detailRows, setDetailRows] = useState(3);

  const [form, setForm] = useState<EnrollUserListToCourseRequest>(
    new EnrollUserListToCourseRequest({
      userID: '',
      courseID: '',
      progress: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: UserProgressEnum.NotStarted,
      enrollStatus: ApproveStatusEnum.Approve,
    })
  );

  const handleChange = <K extends keyof EnrollUserListToCourseRequest>(
    key: K,
    value: EnrollUserListToCourseRequest[K]
  ) => {
    setForm((prev) => new EnrollUserListToCourseRequest({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const updateRows = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const aspectRatio = windowWidth / windowHeight;

      let otherElementsHeight = 300;
      if (windowHeight < 600) {
        otherElementsHeight = 250;
      } else if (windowHeight > 1000) {
        otherElementsHeight = 350;
      }

      const rowHeight = aspectRatio > 1.5 ? 22 : 24;
      const availableHeight = windowHeight - otherElementsHeight;
      const calculatedRows = Math.max(3, Math.floor(availableHeight / rowHeight));

      setDetailRows(fullScreen ? calculatedRows : 3);
    };

    updateRows();
    window.addEventListener('resize', updateRows);
    return () => {
      window.removeEventListener('resize', updateRows);
    };
  }, [fullScreen]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('createUserCourseProgress')}
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
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: fullScreen ? '100%' : 'auto',
          padding: 0,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          p={2}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid
            container
            spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}
            sx={{
              flex: 1,
            }}
          >
            {/* <Grid item xs={12}>
              <CustomTextField
                label="Tên khóa học"
                value={form.name}
                onChange={(val) => handleChange('name', val)}
                disabled={disabled}
              />
            </Grid> */}

            <Grid item xs={12}>
              <CourseSelectDialog
                courseUsecase={courseUsecase}
                value={form.courseID ?? ''}
                onChange={(value: string) => {
                  handleChange('courseID', value);
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
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
                enrollmentUsecase={enrollUsecase}
                value={form.enrollmentCriteriaID ?? ''}
                onChange={(value: string) => {
                  handleChange('enrollmentCriteriaID', value);
                }}
                disabled={false}
                categoryEnum={CategoryEnum.Course}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('startTime')}
                value={form.startDate ? DateTimeUtils.formatISODateToString(form.startDate) : undefined}
                onChange={(value) => {
                  handleChange('startDate', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label={t('endTime')}
                value={form.endDate ? DateTimeUtils.formatISODateToString(form.endDate) : undefined}
                onChange={(value) => {
                  handleChange('endDate', DateTimeUtils.parseLocalDateTimeString(value));
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<UserProgressEnum>
                label={t('status')}
                value={form.status}
                onChange={(val) => {
                  handleChange('status', val);
                }}
                disabled={disabled}
                options={[
                  { value: UserProgressEnum.NotStarted, label: 'notStarted' },
                  { value: UserProgressEnum.Ongoing, label: 'ongoing' },
                  { value: UserProgressEnum.Done, label: 'done' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<ApproveStatusEnum>
                label={t('enrollStatus')}
                value={form.enrollStatus!}
                onChange={(val) => {
                  handleChange('enrollStatus', val);
                }}
                disabled={disabled}
                options={[
                  { value: ApproveStatusEnum.Approve, label: 'approve' },
                  { value: ApproveStatusEnum.Reject, label: 'reject' },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomButton
                label={t('create')}
                onClick={() => {
                  onSubmit(form);
                }}
                loading={loading}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
