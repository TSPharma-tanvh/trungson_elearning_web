'use client';

import React, { useEffect, useState } from 'react';
import { CreateQuestionsFromExcelDto } from '@/domain/models/question/request/create-question-from-excel-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { QuestionCategorySelect } from '@/presentation/components/shared/category/question-category-select';

interface CreateQuestionFromExcelProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQuestionsFromExcelDto) => void;
}

export function CreateQuestionsFromExcelDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: CreateQuestionFromExcelProps) {
  const { t } = useTranslation();
  const { categoryUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [form, setForm] = useState<CreateQuestionsFromExcelDto>(
    new CreateQuestionsFromExcelDto({
      canShuffle: false,
      questionCategoryEnum: CategoryEnum[CategoryEnum.Question],
    })
  );

  const handleChange = <K extends keyof CreateQuestionsFromExcelDto>(key: K, value: CreateQuestionsFromExcelDto[K]) => {
    setForm((prev) => new CreateQuestionsFromExcelDto({ ...prev, [key]: value }));
  };

  const handleExcelUpload = (file: File | null) => {
    if (!file) {
      CustomSnackBar.showSnackbar(t('fileIsRequired'), 'error');
      return;
    }
    handleChange('excelFile', file);
  };

  const resetForm = () => {
    setForm(
      new CreateQuestionsFromExcelDto({
        canShuffle: false,
        questionCategoryEnum: CategoryEnum[CategoryEnum.Question],
      })
    );
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  // const booleanOptions = [
  //   { value: 'true', label: 'yes' },
  //   { value: 'false', label: 'no' },
  // ];

  const handleSave = () => {
    if (!form.excelFile) {
      CustomSnackBar.showSnackbar(t('fileIsRequired'), 'error');
      return;
    }

    if (!form.questionCategoryID) {
      CustomSnackBar.showSnackbar(t('categoryIsRequired'), 'error');
      return;
    }

    onSubmit(new CreateQuestionsFromExcelDto(form));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('importQuestionsFromExcel')}</Typography>
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

      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Question category */}
          <Grid item xs={12} mt={1}>
            <QuestionCategorySelect
              categoryUsecase={categoryUsecase}
              value={form.questionCategoryID}
              label={t('questionBank')}
              onChange={(value) => {
                handleChange('questionCategoryID', value);
              }}
              categoryEnum={CategoryEnum.Question}
              required
            />
          </Grid>

          {/* Enum Category */}
          {/* <Grid item xs={12}>
            <CustomSelectDropDown<string>
              label={t('questionCategory')}
              value={form.questionCategoryEnum}
              onChange={(val) => handleChange('questionCategoryEnum', val)}
              options={[
                { value: CategoryEnum[CategoryEnum.Question], label: 'Question' },
                { value: CategoryEnum.Answer.toString(), label: 'Answer' },
              ]}
            />
          </Grid> */}

          {/* Shuffle */}
          <Grid item xs={12}>
            <CustomSelectDropDown<boolean>
              label={t('canShuffle')}
              value={form.canShuffle}
              onChange={(v) => {
                handleChange('canShuffle', v);
              }}
              options={[
                { value: true, label: 'yes' },
                { value: false, label: 'no' },
              ]}
            />
          </Grid>

          {/* Excel upload */}
          <Grid item xs={12}>
            <Typography>{t('uploadExcelFile')}</Typography>

            <Button variant="outlined" component="label" fullWidth startIcon={<></>}>
              {t('uploadFile')}
              <input
                hidden
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  handleExcelUpload(e.target.files?.[0] || null);
                }}
              />
            </Button>
          </Grid>

          {form.excelFile ? (
            <Grid item xs={12}>
              <Typography variant="subtitle2">{t('uploadedFiles')}</Typography>
              <Button variant="text" fullWidth sx={{ justifyContent: 'flex-start' }}>
                {form.excelFile.name}
              </Button>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <CustomButton label={t('create')} onClick={handleSave} loading={loading} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
