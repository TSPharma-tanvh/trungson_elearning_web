'use client';

import React, { useState } from 'react';
import { LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { EnrollUserListToLessonRequest } from '@/domain/models/user-lesson/request/enroll-user-to-lesson-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { ProgressEnrollmentTypeEnum, StatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { LessonSingleSelectDialog } from '@/presentation/components/shared/courses/lessons/lesson-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';

export default function EnrollUsersToLessonPage() {
  const { t } = useTranslation();
  const { userLessonProgressUsecase, lessonUsecase, userUsecase } = useDI();

  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedLessonDetail, setSelectedLessonDetail] = useState<LessonDetailResponse | null>(null);

  const [form, setForm] = useState<EnrollUserListToLessonRequest>(
    new EnrollUserListToLessonRequest({
      lessonID: '',
      progress: 0,
      status: UserProgressEnum[UserProgressEnum.NotStarted],
      activeStatus: StatusEnum.Enable,
      enrollType: ProgressEnrollmentTypeEnum.AllUsers,
      isUpdateOldProgress: false,
    })
  );

  const handleChange = <K extends keyof EnrollUserListToLessonRequest>(
    key: K,
    value: EnrollUserListToLessonRequest[K] | null | undefined
  ) => {
    setForm((prev) => new EnrollUserListToLessonRequest({ ...prev, [key]: value as any }));
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
    if (!form.lessonID) {
      CustomSnackBar.showSnackbar(t('pleaseSelectLesson'), 'error');
      return;
    }
    if (form.enrollType === ProgressEnrollmentTypeEnum.FromFile && !form.userFile) {
      CustomSnackBar.showSnackbar(t('fileRequired'), 'error');
      return;
    }

    try {
      setLoading(true);
      await userLessonProgressUsecase.enrollUserListToLesson(form);
      CustomSnackBar.showSnackbar(t('enrollUsersToLessonSuccess'), 'success');
      // Có thể reset form hoặc redirect nếu cần
    } catch (error: any) {
      CustomSnackBar.showSnackbar(t('enrollFailed') + ': ' + (error?.message || ''), 'error');
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
            {t('enrollUsersToLesson')}
          </Typography>
        </Stack>

        <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4}>
            {/* Lesson Selection */}
            <Grid item xs={12}>
              <LessonSingleSelectDialog
                lessonUsecase={lessonUsecase}
                value={form.lessonID ?? ''}
                onChange={async (value) => {
                  handleChange('lessonID', value);

                  if (!value) {
                    setSelectedLessonDetail(null);
                    return;
                  }

                  try {
                    const detail = await lessonUsecase.getLessonById(value);
                    setSelectedLessonDetail(detail);
                  } catch (err) {
                    CustomSnackBar.showSnackbar(t('failedToLoadLessonDetail'), 'error');
                    setSelectedLessonDetail(null);
                  }
                }}
                disabled={loading}
              />
            </Grid>

            {/* Hiển thị thông tin lesson nếu có */}
            {/* {selectedLessonDetail && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  <strong>{t('lessonName')}:</strong> {selectedLessonDetail.name} <br />
                  {selectedLessonDetail.course?.name && (
                    <>
                      <strong>{t('course')}:</strong> {selectedLessonDetail.course.name}
                    </>
                  )}
                </Typography>
              </Grid>
            )} */}

            {/* Cập nhật tiến độ cũ */}
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

            {/* Loại ghi danh */}
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

            {/* Chọn từng user */}
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

            {/* Upload file Excel */}
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

            {/* Nút thực hiện */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <CustomButton
                  label={t('enrollUsersToLesson')}
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
                />
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Stack>
    </Container>
  );
}
