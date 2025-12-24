'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CourseCreateLessonCollectionRequest,
  CreateCourseRequest,
} from '@/domain/models/courses/request/create-course-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, CourseTypeEnum, DisplayTypeEnum, LearningModeEnum, StatusEnum } from '@/utils/enum/core-enum';
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
import { LessonCollectionCreateByFileEditor } from '@/presentation/components/shared/courses/lessons/lesson-collection-detail-create-by-file-category-form';
import { LinearLessonCollectionCreateByFileEditor } from '@/presentation/components/shared/courses/linear-courses/linear-lesson-collection-detail-create-by-file-category-form';

interface LinearCreateCourseProps {
  disabled?: boolean;
  onSubmit: (data: CreateCourseRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function LinearCreateCourseDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: LinearCreateCourseProps) {
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
      courseType: CourseTypeEnum.Linear,
    })
  );

  const [lessonCollections, setLessonCollections] = useState<CourseCreateLessonCollectionRequest[]>([]);

  const handleChange = <K extends keyof CreateCourseRequest>(key: K, value: CreateCourseRequest[K]) => {
    setForm((prev) => new CreateCourseRequest({ ...prev, [key]: value }));
  };

  const memoizedLessonCollections = useMemo(() => {
    return lessonCollections.map((item) => new CourseCreateLessonCollectionRequest(item));
  }, [lessonCollections]);

  useEffect(() => {
    const updateRows = () => {
      const h = window.innerHeight;
      const w = window.innerWidth;
      const ratio = w / h;

      let other = 300;
      if (h < 600) other = 250;
      if (h > 1000) other = 350;

      const rowHeight = ratio > 1.5 ? 22 : 24;
      const rows = Math.max(3, Math.floor((h - other) / rowHeight));

      setDetailRows(fullScreen ? rows : 3);
    };

    updateRows();
    window.addEventListener('resize', updateRows);
    return () => window.removeEventListener('resize', updateRows);
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
        courseType: CourseTypeEnum.Linear,
        collections: [],
      })
    );
    setLessonCollections([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('createCourse')}</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((p) => !p)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: fullScreen ? '100%' : 'auto' }}>
        <Box component="form" p={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextField
                label={t('name')}
                value={form.name}
                onChange={(v) => handleChange('name', v)}
                disabled={disabled}
                required={true}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label={t('detail')}
                value={form.detail}
                onChange={(v) => handleChange('detail', v)}
                disabled={disabled}
                multiline
                rows={detailRows}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CategorySelect
                categoryUsecase={categoryUsecase}
                value={form.categoryID}
                categoryEnum={CategoryEnum.Course}
                onChange={(val) => handleChange('categoryID', val)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ClassTeacherSelectDialog
                classUsecase={classTeacherUsecase}
                value={form.teacherID ?? ''}
                onChange={(val) => handleChange('teacherID', val)}
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
            </Grid>{' '}
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
            </Grid>{' '}
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
            </Grid>{' '}
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
              <Typography fontWeight={600}>{t('lessonCollections')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('courseDurationType')}
                value={form.isFixedCourse ?? true}
                onChange={(val) => {
                  handleChange('isFixedCourse', val);
                }}
                disabled={disabled}
                options={[
                  { value: true, label: 'duration' },
                  { value: false, label: 'time' },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <LinearLessonCollectionCreateByFileEditor
                value={memoizedLessonCollections}
                onChange={setLessonCollections}
                fixedCourse={form.isFixedCourse}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton
                label={t('create')}
                loading={loading}
                disabled={disabled}
                onClick={() =>
                  onSubmit(
                    new CreateCourseRequest({
                      ...form,
                      collections: lessonCollections,
                    })
                  )
                }
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
