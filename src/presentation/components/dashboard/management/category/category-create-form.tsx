'use client';

import React, { useEffect, useState } from 'react';
import { CreateCategoryRequest } from '@/domain/models/category/request/create-category-request';
import { CategoryEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface CategoryCreateProps {
  disabled?: boolean;
  onSubmit: (data: CreateCategoryRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateCategoryDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CategoryCreateProps) {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);

  const [form, setForm] = useState<CreateCategoryRequest>(
    new CreateCategoryRequest({
      categoryName: '',
      description: '',
      category: CategoryEnum.Resource,
    })
  );

  const handleChange = <K extends keyof CreateCategoryRequest>(key: K, value: CreateCategoryRequest[K]) => {
    setForm((prev) => new CreateCategoryRequest({ ...prev, [key]: value }));
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
          {t('createResourceCategory')}
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
              <CustomTextField
                label={t('categoryName')}
                value={form.categoryName}
                onChange={(val) => {
                  handleChange('categoryName', val);
                }}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('description')}
                value={form.description ?? ''}
                onChange={(val) => {
                  handleChange('description', val);
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

            {/* <Grid item xs={12}>
              <CustomSelectDropDown<CategoryEnum>
                label={t('categoryType')}
                value={form.category ?? CategoryEnum.Path}
                onChange={(val) => {
                  handleChange('category', val);
                }}
                disabled={disabled}
                options={[
                  { value: CategoryEnum.Course, label: 'course' },
                  // { value: CategoryEnum.Lesson, label: 'lesson' },
                  { value: CategoryEnum.Class, label: 'class' },
                  { value: CategoryEnum.Quiz, label: 'quiz' },
                  // { value: CategoryEnum.Question, label: 'question' },
                  // { value: CategoryEnum.Answer, label: 'answer' },
                  { value: CategoryEnum.Resource, label: 'resource' },
                ]}
              />
            </Grid> */}

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
