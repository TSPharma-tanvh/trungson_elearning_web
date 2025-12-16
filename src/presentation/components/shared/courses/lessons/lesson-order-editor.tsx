'use client';

import React, { useEffect, useState } from 'react';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { CourseCreateLessonCollectionLessonDetailRequest } from '@/domain/models/courses/request/create-course-request';
import { FileResourcesResponseForAdmin } from '@/domain/models/file/response/file-resources-for-admin-response';
import { FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, LessonContentEnum } from '@/utils/enum/core-enum';
import { Add, Close, Delete, ExpandLess, ExpandMore, InfoOutlined, Visibility } from '@mui/icons-material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Typography,
} from '@mui/material';
import { color } from '@mui/system';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import ResourceDetailForm from '@/presentation/components/dashboard/settings/resources/resource-detail-form';
import { CategorySelectDialog } from '@/presentation/components/shared/category/category-select';

import ImagePreviewDialog from '../../file/image-preview-dialog';
import VideoPreviewDialog from '../../file/video-preview-dialog';

interface LessonOrderEditorProps {
  value: CourseCreateLessonCollectionLessonDetailRequest[];
  onChange: (val: CourseCreateLessonCollectionLessonDetailRequest[]) => void;
  label?: string;
}

export function LessonOrderEditor({ value, onChange, label }: LessonOrderEditorProps) {
  const { t } = useTranslation();
  const { fileUsecase, categoryUsecase } = useDI();

  const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);
  // const [resourceNames, setResourceNames] = useState<Record<number, string>>({});
  const [previewResource, setPreviewResource] = useState<FileResourcesResponseForAdmin | null>(null);
  const [previewImageOpen, setPreviewImageOpen] = useState(false);
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false);
  const [resourceInfo, setResourceInfo] = useState<Record<number, FileResourcesResponse>>({});
  //helpers

  const withOrder = (list: CourseCreateLessonCollectionLessonDetailRequest[]) =>
    list.map(
      (item, idx) =>
        new CourseCreateLessonCollectionLessonDetailRequest({
          ...item,
          order: idx + 1,
        })
    );

  const update = (idx: number, patch: Partial<CourseCreateLessonCollectionLessonDetailRequest>) => {
    const cloned = [...value];
    cloned[idx] = new CourseCreateLessonCollectionLessonDetailRequest({
      ...cloned[idx],
      ...patch,
    });
    onChange(withOrder(cloned));
  };

  //actions

  const addLesson = () => {
    const next = [
      ...value,
      new CourseCreateLessonCollectionLessonDetailRequest({
        lessonType: LessonContentEnum.PDF,
      }),
    ];
    onChange(withOrder(next));
  };

  const moveLesson = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= value.length) return;

    const cloned = [...value];
    [cloned[index], cloned[targetIndex]] = [cloned[targetIndex], cloned[index]];

    onChange(withOrder(cloned));
  };

  const removeLesson = (idx: number) => {
    const cloned = [...value];
    cloned.splice(idx, 1);

    const newNames = { ...resourceInfo };
    delete newNames[idx];
    setResourceInfo(newNames);

    onChange(withOrder(cloned));
  };

  //preview

  const handlePreview = (res: FileResourcesResponseForAdmin) => {
    if (!res.resourceUrl) return;
    setPreviewResource(res);

    if (res.type?.startsWith('image/')) setPreviewImageOpen(true);
    else if (res.type?.startsWith('video/')) setPreviewVideoOpen(true);
    else window.open(res.resourceUrl, '_blank');
  };

  //load name

  // useEffect(() => {
  //   value.forEach(async (item, idx) => {
  //     const id = item.lessonType === LessonContentEnum.Video ? item.videoID : item.resourceID;

  //     if (!id) return;

  //     try {
  //       const res = await fileUsecase.getFileResourceById(id);
  //       setResourceNames((p) => ({ ...p, [idx]: res?.name ?? '' }));
  //     } catch {}
  //   });
  // }, [value, fileUsecase]);

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

            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenPickerIndex(idx)}
                endIcon={
                  resourceInfo[idx] && (
                    <IconButton
                      size="small"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const id = item.lessonType === LessonContentEnum.Video ? item.videoID : item.resourceID;
                        if (!id) return;
                        const res = await fileUsecase.getFileResourceById(id);
                        handlePreview(res);
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  )
                }
              >
                {resourceInfo?.[idx]?.name ??
                  (item.lessonType === LessonContentEnum.Video ? t('selectVideo') : t('selectResources'))}
              </Button>

              <LessonCollectionCreateByFileCategoryForm
                open={openPickerIndex === idx}
                value={resourceInfo[idx]}
                lessonType={item.lessonType}
                categoryUsecase={categoryUsecase}
                onChange={(selectedResource: FileResourcesResponse) => {
                  update(idx, {
                    videoID: item.lessonType === LessonContentEnum.Video ? selectedResource.id : undefined,
                    resourceID: item.lessonType === LessonContentEnum.PDF ? selectedResource.id : undefined,
                  });

                  setResourceInfo((prev) => ({ ...prev, [idx]: selectedResource }));
                }}
                onClose={() => setOpenPickerIndex(null)}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <IconButton size="small" disabled={idx === 0} onClick={() => moveLesson(idx, 'up')}>
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>

              <IconButton size="small" disabled={idx === value.length - 1} onClick={() => moveLesson(idx, 'down')}>
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>

              <IconButton color="error" size="small" onClick={() => removeLesson(idx)}>
                <Delete fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button variant="outlined" startIcon={<Add />} onClick={addLesson}>
        {t('addLesson')}
      </Button>

      {previewResource?.type?.startsWith('image/') && (
        <ImagePreviewDialog
          open={previewImageOpen}
          imageUrl={previewResource.resourceUrl!}
          title={previewResource.name}
          onClose={() => setPreviewImageOpen(false)}
        />
      )}

      {previewResource?.type?.startsWith('video/') && (
        <VideoPreviewDialog
          open={previewVideoOpen}
          videoUrl={previewResource.resourceUrl!}
          title={previewResource.name}
          onClose={() => setPreviewVideoOpen(false)}
        />
      )}
    </Box>
  );
}

interface LessonCollectionDetailCreateByFileCategoryFormProps {
  open: boolean;
  value?: FileResourcesResponse;
  onChange: (value: FileResourcesResponse) => void;
  onClose: () => void;
}

export default function LessonCollectionDetailCreateByFileCategoryForm({
  open,
  value,
  onChange,
  onClose,
}: LessonCollectionDetailCreateByFileCategoryFormProps) {
  const { categoryUsecase } = useDI();
  const { t } = useTranslation();

  const [categoryId, setCategoryId] = useState('');
  const [category, setCategory] = useState<CategoryDetailResponse | null>(null);
  const [selected, setSelected] = useState<FileResourcesResponse | undefined>(value);
  const [viewResourceId, setViewResourceId] = useState<string | null>(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    if (open && categoryId) {
      categoryUsecase
        ?.getCategoryById(categoryId)
        .then(setCategory)
        .catch(() => setCategory(null));
    }
  }, [open, categoryId, categoryUsecase]);

  const handleSave = () => {
    if (selected) {
      onChange(selected);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          Select Resource
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography fontWeight={600}>{t('selectResources')}</Typography>

          <CategorySelectDialog
            categoryUsecase={categoryUsecase}
            categoryEnum={CategoryEnum.Resource}
            value={categoryId}
            onChange={(id) => {
              setCategoryId(id);
              setSelected(undefined);
            }}
          />

          {category && (
            <>
              <Typography fontWeight={600} mt={3}>
                {t('fileResources')}
              </Typography>

              <List>
                {category.fileResources.map((res) => (
                  <ListItem
                    key={res.id}
                    disablePadding
                    secondaryAction={
                      <IconButton onClick={() => setViewResourceId(res.id)}>
                        <InfoOutlined />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <Checkbox checked={selected === res} onChange={() => setSelected(res)} />
                    </ListItemIcon>
                    <ListItemText
                      primary={res.name}
                      secondary={res.type}
                      onClick={() => setSelected(res)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSave} disabled={!selected}>
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      <ResourceDetailForm
        open={Boolean(viewResourceId)}
        resourceId={viewResourceId}
        onClose={() => setViewResourceId(null)}
      />
    </>
  );
}

interface LessonCollectionCreateByFileCategoryFormProps {
  open: boolean;
  value: FileResourcesResponse;
  lessonType: LessonContentEnum;
  onChange: (id: FileResourcesResponse) => void;
  onClose: () => void;
  categoryUsecase: CategoryUsecase | null;
}

export function LessonCollectionCreateByFileCategoryForm({
  open,
  value,
  lessonType,
  onChange,
  onClose,
  categoryUsecase,
}: LessonCollectionCreateByFileCategoryFormProps) {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const [selectedResource, setSelectedResource] = useState<FileResourcesResponse>(value);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [previewResource, setPreviewResource] = useState<FileResourcesResponse | null>(null);
  const [previewImageOpen, setPreviewImageOpen] = useState(false);
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false);

  /*  Fetch  */

  useEffect(() => {
    if (!open || !categoryUsecase) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const request = new GetCategoryRequest({
          category: CategoryEnum[CategoryEnum.Resource],
          contentType: lessonType,
          pageNumber,
          pageSize: 10,
        });

        const result = await categoryUsecase.getCategoryList(request);
        setCategories(result.categories);
        const pages = Math.max(1, Math.ceil(result.totalRecords / 10));
        setTotalPages(pages);
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, [open, categoryUsecase, lessonType, pageNumber]);

  useEffect(() => {
    setSelectedResource(value);
  }, [value, open]);

  /*  Handlers  */

  const toggleCategory = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  const handleSave = () => {
    if (selectedResource) {
      onChange(selectedResource);
    }
    onClose();
  };

  const handlePreview = (res: FileResourcesResponse) => {
    if (!res.resourceUrl) return;

    setPreviewResource(res);

    if (res.type?.startsWith('image/')) {
      setPreviewImageOpen(true);
    } else if (res.type?.startsWith('video/')) {
      setPreviewVideoOpen(true);
    } else {
      window.open(res.resourceUrl, '_blank');
    }
  };

  /*  Render  */

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={600}>{t('selectResources')}</Typography>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {loading && (
            <Typography variant="body2" sx={{ p: 2 }}>
              {t('loading')}
            </Typography>
          )}

          {!loading && categories.length === 0 && (
            <Typography variant="body2" sx={{ p: 2 }}>
              {t('empty')}
            </Typography>
          )}

          <List>
            {categories.map((cat) => (
              <Box key={cat.id}>
                <ListItemButton onClick={() => toggleCategory(cat.id ?? '')}>
                  <ListItemText primary={cat.categoryName} />
                  {expandedCategoryId === cat.id ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                {expandedCategoryId === cat.id && (
                  <Box sx={{ pl: 3 }}>
                    {cat.fileResources?.map((res) => (
                      <ListItem
                        key={res.id}
                        disablePadding
                        secondaryAction={
                          res.resourceUrl ? (
                            <IconButton
                              edge="end"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(res);
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          ) : null
                        }
                      >
                        <ListItemButton
                          selected={selectedResource?.id === res.id}
                          onClick={() => setSelectedResource(res)}
                        >
                          <Checkbox checked={selectedResource?.id === res.id} />
                          <ListItemText primary={res.name} secondary={`${res.type ?? ''} • ${res.size ?? 0} KB`} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </List>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between' }}>
          {totalPages > 1 && (
            <Pagination size="small" count={totalPages} page={pageNumber} onChange={(_, p) => setPageNumber(p)} />
          )}

          <Box>
            <Button onClick={onClose}>{t('cancel')}</Button>
            <Button variant="contained" onClick={handleSave} disabled={!selectedResource}>
              {t('select')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* -------- Preview dialogs -------- */}

      {previewResource?.resourceUrl && previewResource.type?.startsWith('image/') && (
        <ImagePreviewDialog
          open={previewImageOpen}
          imageUrl={previewResource.resourceUrl}
          title={previewResource.name}
          onClose={() => setPreviewImageOpen(false)}
        />
      )}

      {previewResource?.resourceUrl && previewResource.type?.startsWith('video/') && (
        <VideoPreviewDialog
          open={previewVideoOpen}
          videoUrl={previewResource.resourceUrl}
          title={previewResource.name}
          onClose={() => setPreviewVideoOpen(false)}
        />
      )}
    </>
  );
}
