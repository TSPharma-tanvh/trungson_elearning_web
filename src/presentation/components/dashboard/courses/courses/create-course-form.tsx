'use client';

import React, { useEffect, useState } from 'react';
import { type CreateLessonCollectionRequest } from '@/domain/models/courses/request/create-course-lesson-collection-request';
import { CreateCourseRequest } from '@/domain/models/courses/request/create-course-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, DisplayTypeEnum, LearningModeEnum, StatusEnum } from '@/utils/enum/core-enum';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomEmployeeDistinctSelectInForm } from '@/presentation/components/core/drop-down/custom-employee-distinct-select-in-form';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/shared/classes/teacher/teacher-select';
import { LessonCollectionCreateEditor } from '@/presentation/components/shared/courses/lessons/lesson-collection-create-form';

interface CreateCourseProps {
  disabled?: boolean;
  onSubmit: (data: CreateCourseRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateCourseDialog({ disabled = false, onSubmit, loading = false, open, onClose }: CreateCourseProps) {
  const { t } = useTranslation();
  const { categoryUsecase, classTeacherUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);

  const [form, setForm] = useState<CreateCourseRequest>(
    new CreateCourseRequest({
      name: '',
      detail: '',
      isRequired: false,
      disableStatus: StatusEnum.Enable,
      displayType: DisplayTypeEnum.Public,
      categoryEnum: CategoryEnum.Course,
      courseType: LearningModeEnum.Online,
    })
  );
  const [lessonCollections, setLessonCollections] = useState<CreateLessonCollectionRequest[]>([]);

  const handleChange = <K extends keyof CreateCourseRequest>(key: K, value: CreateCourseRequest[K]) => {
    setForm((prev) => new CreateCourseRequest({ ...prev, [key]: value }));
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

  const handleClose = () => {
    setForm(
      new CreateCourseRequest({
        name: '',
        detail: '',
        isRequired: false,
        disableStatus: StatusEnum.Enable,
        displayType: DisplayTypeEnum.Public,
        categoryEnum: CategoryEnum.Course,
        courseType: LearningModeEnum.Online,
      })
    );

    setLessonCollections([]);

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('createCourse')}
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
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('basicInformation')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('name')}
                value={form.name}
                onChange={(val) => {
                  handleChange('name', val);
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('detail')}
                value={form.detail}
                onChange={(val) => {
                  handleChange('detail', val);
                }}
                disabled={disabled}
                multiline
                rows={detailRows}
                sx={{
                  '& .MuiInputBase-root': {
                    height: fullScreen ? '100%' : 'auto',
                  },
                }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<StatusEnum>
                label={t('disableStatus')}
                value={form.disableStatus}
                onChange={(val) => {
                  handleChange('disableStatus', val);
                }}
                disabled={disabled}
                options={[
                  { value: StatusEnum.Enable, label: t('enable') },
                  { value: StatusEnum.Disable, label: t('disable') },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<DisplayTypeEnum>
                label={t('displayType')}
                value={form.displayType}
                onChange={(val) => {
                  handleChange('displayType', val);
                }}
                disabled={disabled}
                options={[
                  { value: DisplayTypeEnum.Public, label: t('public') },
                  { value: DisplayTypeEnum.Private, label: t('private') },
                ]}
              />
            </Grid> */}

            {/* <Grid item xs={12}>
              <CustomSelectDropDown<LearningModeEnum>
                label={t('courseType')}
                value={form.courseType}
                onChange={(val) => {
                  handleChange('courseType', val);

                  if (val === LearningModeEnum.Offline) {
                    handleChange('meetingLink', undefined);
                  }
                }}
                disabled={disabled}
                options={[
                  { value: LearningModeEnum.Offline, label: t('offline') },
                  { value: LearningModeEnum.Online, label: t('online') },
                ]}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={form.categoryID}
                onChange={(value) => {
                  handleChange('categoryID', value);
                }}
                categoryEnum={CategoryEnum.Course}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <ClassTeacherSelectDialog
                classUsecase={classTeacherUsecase}
                value={form.teacherID ?? ''}
                onChange={(value) => {
                  handleChange('teacherID', value);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isFixedCourse')}
                value={form.isFixedCourse ?? true}
                onChange={(val) => {
                  handleChange('isFixedCourse', val);
                }}
                disabled={disabled}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isRequired')}
                value={form.isRequired ?? true}
                onChange={(val) => {
                  handleChange('isRequired', val);
                }}
                disabled={disabled}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('employeeFilters')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomEmployeeDistinctSelectInForm
                label="departmentType"
                value={form.departmentTypeCode}
                type={DepartmentFilterType.DepartmentType}
                onChange={(value) => {
                  handleChange('departmentTypeCode', value);
                }}
                loadOnMount
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomEmployeeDistinctSelectInForm
                label="position"
                value={form.positionCode}
                type={DepartmentFilterType.Position}
                onChange={(value) => {
                  handleChange('positionCode', value);
                }}
                loadOnMount
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomEmployeeDistinctSelectInForm
                label="currentPositionStateName"
                value={form.positionStateCode}
                type={DepartmentFilterType.PositionState}
                onChange={(value) => {
                  handleChange('positionStateCode', value);
                }}
                loadOnMount
              />
            </Grid>

            <Grid item xs={12}>
              <LessonCollectionCreateEditor
                value={lessonCollections}
                onChange={setLessonCollections}
                fixedCourse={form.isFixedCourse}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomButton
                label={t('create')}
                onClick={() => {
                  onSubmit(
                    new CreateCourseRequest({
                      ...form,
                      collections: lessonCollections,
                    })
                  );
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
