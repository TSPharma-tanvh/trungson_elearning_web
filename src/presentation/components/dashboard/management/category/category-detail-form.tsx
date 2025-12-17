'use client';

import React, { useEffect, useState } from 'react';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';

interface CategoryDetailFormProps {
  open: boolean;
  categoryId: string | null;
  onClose: () => void;
}

function CategoryDetails({ category, fullScreen }: { category: CategoryDetailResponse; fullScreen: boolean }) {
  const { t } = useTranslation();
  const renderField = (label: string, value?: string | number | boolean | null) => (
    <Grid item xs={12} sm={fullScreen ? 4 : 6}>
      <Typography variant="subtitle2" fontWeight={500}>
        {t(label)}
      </Typography>
      <CustomFieldTypography value={value} />
    </Grid>
  );

  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={category.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
          {category.categoryName?.[0] ?? '?'}
        </Avatar>
        <Typography variant="h5">{category.categoryName ?? 'Unnamed Category'}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('categoryInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {renderField('id', category.id)}
            {renderField('categoryName', category.categoryName)}
            {renderField('detail', category.description)}
            {renderField(
              'categoryType',
              category.category
                ? t(category.category.toString().charAt(0).toLowerCase() + t(category.category.toString()).slice(1))
                : ''
            )}
            {renderField('thumbnailId', category.thumbnail?.id)}
            {renderField('createdByUser', category.createdByUser?.employee?.name)}
            {renderField('updatedByUser', category.updatedByUser?.employee?.name)}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function CategoryDetailForm({ open, categoryId, onClose }: CategoryDetailFormProps) {
  const { t } = useTranslation();

  const { categoryUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<CategoryDetailResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && categoryId && categoryUsecase) {
      setLoading(true);
      categoryUsecase
        .getCategoryById(categoryId)
        .then(setCategory)
        .catch(() => {
          setCategory(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, categoryId, categoryUsecase]);

  if (!categoryId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('categoryDetails')}
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

      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !category ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <CategoryDetails category={category} fullScreen={fullScreen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
