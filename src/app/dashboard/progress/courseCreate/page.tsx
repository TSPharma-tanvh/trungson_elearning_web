'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { EnrollUserListToCourseRequest } from '@/domain/models/user-course/request/enroll-user-list-to-course';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { ProgressEnrollmentTypeEnum, StatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Card, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CourseSelectDialog } from '@/presentation/components/shared/courses/courses/courses-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';

export default function EnrollUsersToCoursePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userCourseProgressUsecase, courseUsecase, userUsecase } = useDI();

  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<CourseDetailResponse | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  const [form, setForm] = useState<EnrollUserListToCourseRequest>(
    new EnrollUserListToCourseRequest({
      courseID: '',
      progress: 0,
      status: UserProgressEnum.NotStarted,
      activeStatus: StatusEnum.Enable,
      enrollType: ProgressEnrollmentTypeEnum.AllUsers,
      isUpdateOldProgress: false,
    })
  );

  const handleChange = <K extends keyof EnrollUserListToCourseRequest>(
    key: K,
    value: EnrollUserListToCourseRequest[K] | null | undefined
  ) => {
    setForm((prev) => new EnrollUserListToCourseRequest({ ...prev, [key]: value as any }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setFileError(null);
      handleChange('userFile', undefined);
      return;
    }

    const allowed = ['.xlsx', '.xls'];
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowed.includes(ext)) {
      setFileError(t('invalidFileFormat', { formats: '.xlsx, .xls' }));
      handleChange('userFile', undefined);
      return;
    }
    if (file.size > maxSize) {
      setFileError(t('fileTooLarge', { maxSize: '5MB' }));
      handleChange('userFile', undefined);
      return;
    }

    setFileError(null);
    handleChange('userFile', file);
  };

  const handleSubmit = async () => {
    if (!form.courseID) {
      CustomSnackBar.showSnackbar(t('pleaseSelectCourse'), 'error');
      return;
    }
    if (form.enrollType === ProgressEnrollmentTypeEnum.FromFile && !form.userFile) {
      CustomSnackBar.showSnackbar(t('fileRequired'), 'error');

      return;
    }

    try {
      setLoading(true);
      await userCourseProgressUsecase.enrollUserCourseProgress(form);
      router.push('/dashboard/progress/course');
    } catch (error: any) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('enrollUsersToCourse')}
          </Typography>
        </Stack>

        <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4}>
            {/* Course Selection */}
            <Grid item xs={12}>
              <CourseSelectDialog
                courseUsecase={courseUsecase}
                value={form.courseID ?? ''}
                onChange={async (value) => {
                  handleChange('courseID', value);

                  if (!value) {
                    setSelectedCourseDetail(null);
                    return;
                  }

                  try {
                    const detail = await courseUsecase.getCourseById(value);
                    setSelectedCourseDetail(detail);
                  } catch (err) {
                    CustomSnackBar.showSnackbar(t('failedToLoadCourseDetail'), 'error');
                    setSelectedCourseDetail(null);
                  }
                }}
                disabled={loading}
              />
            </Grid>

            {selectedCourseDetail?.isFixedCourse && (
              <>
                <Grid item xs={12}>
                  <CustomDateTimePicker
                    label={t('startDate') + ' *'}
                    value={
                      form.fixedCourseStartDate ? DateTimeUtils.formatISODateToString(form.fixedCourseStartDate) : ''
                    }
                    onChange={(val) => {
                      const date = val ? DateTimeUtils.formatStringToDateTime(val) : null;
                      handleChange('fixedCourseStartDate', date);
                    }}
                    disabled={loading}
                  />
                </Grid>
              </>
            )}

            {/* Update Old Progress */}
            <Grid item xs={12}>
              <CustomSelectDropDown<boolean>
                label={t('isUpdateOldProgress')}
                value={form.isUpdateOldProgress ?? false}
                onChange={(val) => handleChange('isUpdateOldProgress', val)}
                disabled={loading}
                options={[
                  { value: true, label: t('yes') },
                  { value: false, label: t('no') },
                ]}
              />
            </Grid>

            {/* Enroll Type */}
            <Grid item xs={12}>
              <CustomSelectDropDown<ProgressEnrollmentTypeEnum>
                label={t('enrollType')}
                value={form.enrollType}
                onChange={(val) => handleChange('enrollType', Number(val) as ProgressEnrollmentTypeEnum)}
                disabled={loading}
                options={[
                  { value: ProgressEnrollmentTypeEnum.AllUsers, label: t('allUsers') },
                  { value: ProgressEnrollmentTypeEnum.SelectedUsers, label: t('selectedUsers') },
                  { value: ProgressEnrollmentTypeEnum.FromFile, label: t('fromFile') },
                ]}
              />
            </Grid>

            {/* Selected Users */}
            {form.enrollType === ProgressEnrollmentTypeEnum.SelectedUsers && (
              <Grid item xs={12}>
                <UserMultiSelectDialog
                  userUsecase={userUsecase}
                  value={form.userIDs || []}
                  onChange={(ids) => handleChange('userIDs', ids)}
                  disabled={loading}
                />
              </Grid>
            )}

            {/* Upload File */}
            {form.enrollType === ProgressEnrollmentTypeEnum.FromFile && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  {t('uploadUserList')}
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={loading}
                  startIcon={<UploadFileIcon />}
                  sx={{
                    py: 3,
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    borderStyle: 'dashed',
                    borderColor: fileError ? 'error.main' : 'grey.500',
                    color: fileError ? 'error.main' : 'text.primary',
                  }}
                >
                  {form.userFile ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      <Typography noWrap>{form.userFile.name}</Typography>
                      <Typography variant="body2" color="success.main">
                        {t('fileSelected')}
                      </Typography>
                    </Box>
                  ) : (
                    t('clickToUploadExcel')
                  )}
                  <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileChange} />
                </Button>
                {fileError && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, ml: 1 }}>
                    {fileError}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {t('supportedFormats')}: .xlsx, .xls | {t('maxSize')}: 5MB
                </Typography>
              </Grid>
            )}

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <CustomButton label={t('enrollUsers')} onClick={handleSubmit} loading={loading} />
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Stack>
    </Container>
  );
}
