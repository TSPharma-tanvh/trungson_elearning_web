'use client';

import React, { useState } from 'react';
import { CourseCreateLessonCollectionLessonDetailRequest } from '@/domain/models/courses/request/create-course-request';
import { FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { LessonContentEnum } from '@/utils/enum/core-enum';
import { Delete } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';

import LessonCollectionDetailCreateByFileCategoryForm from './lesson-order-editor';

interface Props {
  value: CourseCreateLessonCollectionLessonDetailRequest[];
  onChange: (val: CourseCreateLessonCollectionLessonDetailRequest[]) => void;
  label?: string;
}

export function LessonOrderEditor({ value, onChange, label }: Props) {
  const { t } = useTranslation();
  const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);
  const [resourceInfo, setResourceInfo] = useState<Record<number, FileResourcesResponse>>({});

  const update = (idx: number, patch: Partial<CourseCreateLessonCollectionLessonDetailRequest>) => {
    const cloned = [...value];
    cloned[idx] = new CourseCreateLessonCollectionLessonDetailRequest({
      ...cloned[idx],
      ...patch,
    });
    onChange(cloned);
  };

  const addLesson = () => {
    onChange([
      ...value,
      new CourseCreateLessonCollectionLessonDetailRequest({
        lessonType: LessonContentEnum.PDF,
      }),
    ]);
  };

  const removeLesson = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <Box>
      {label && (
        <Typography fontWeight={600} mb={1}>
          {label}
        </Typography>
      )}

      {value.map((item, idx) => (
        <Box key={idx} mb={2} p={2} border="1px solid #e0e0e0" borderRadius={2}>
          <Grid container spacing={2} alignItems="center">
            {/* Content type */}
            <Grid item xs={12} sm={4}>
              <CustomSelectDropDown<LessonContentEnum>
                label={t('contentType')}
                value={item.lessonType}
                onChange={(val) =>
                  update(idx, {
                    lessonType: val,
                    videoID: undefined,
                    resourceID: undefined,
                  })
                }
                options={[
                  { value: LessonContentEnum.PDF, label: 'PDF' },
                  { value: LessonContentEnum.Video, label: 'Video' },
                ]}
              />
            </Grid>

            {/* Resource */}
            <Grid item xs={12} sm={7}>
              <Button variant="outlined" fullWidth onClick={() => setOpenPickerIndex(idx)}>
                {item.lessonType === LessonContentEnum.Video
                  ? item.videoID || 'Select video'
                  : item.resourceID || 'Select resource'}
              </Button>

              <LessonCollectionDetailCreateByFileCategoryForm
                open={openPickerIndex === idx}
                value={item.lessonType === LessonContentEnum.Video ? resourceInfo[idx] ?? '' : resourceInfo[idx] ?? ''}
                // lessonType={item.lessonType}
                // categoryUsecase={categoryUsecase}
                onChange={(selectedResource: FileResourcesResponse) => {
                  // Cập nhật ID vào model
                  update(idx, {
                    videoID: item.lessonType === LessonContentEnum.Video ? selectedResource.id : undefined,
                    resourceID: item.lessonType === LessonContentEnum.PDF ? selectedResource.id : undefined,
                  });

                  // Lưu toàn bộ info để hiển thị tên + preview sau này
                  setResourceInfo((prev) => ({ ...prev, [idx]: selectedResource }));
                }}
                onClose={() => setOpenPickerIndex(null)}
              />
            </Grid>

            {/* Delete */}
            <Grid item xs={12} sm={1}>
              <IconButton color="error" onClick={() => removeLesson(idx)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Box mt={2}>
        <Typography sx={{ cursor: 'pointer', color: 'primary.main' }} onClick={addLesson}>
          + {t('addLesson')}
        </Typography>
      </Box>
    </Box>
  );
}
