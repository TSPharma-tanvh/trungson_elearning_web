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
import {
  Add,
  Close,
  Delete,
  ExpandLess,
  ExpandMore,
  InfoOutlined,
  UnfoldLess,
  UnfoldMore,
  Visibility,
} from '@mui/icons-material';
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
  Stack,
  Typography,
} from '@mui/material';
import { color } from '@mui/system';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import ResourceDetailForm from '@/presentation/components/dashboard/settings/resources/resource-detail-form';
import { CategorySelectDialog } from '@/presentation/components/shared/category/category-select';

import ImagePreviewDialog from '../../file/image-preview-dialog';
import VideoPreviewDialog from '../../file/video-preview-dialog';

interface LinearLessonOrderEditorProps {
  value: CourseCreateLessonCollectionLessonDetailRequest[];
  onChange: (val: CourseCreateLessonCollectionLessonDetailRequest[]) => void;
  label?: string;
}

export function LinearLessonOrderEditor({ value, onChange, label }: LinearLessonOrderEditorProps) {
  const { t } = useTranslation();
  const { fileUsecase, categoryUsecase } = useDI();

  const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);
  const [previewResource, setPreviewResource] = useState<FileResourcesResponseForAdmin | null>(null);
  const [previewImageOpen, setPreviewImageOpen] = useState(false);
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false);
  const [resourceInfo, setResourceInfo] = useState<Record<number, FileResourcesResponse>>({});
  const [collapsedMap, setCollapsedMap] = useState<Record<number, boolean>>({});

  const sortedValue = [...value].sort((a, b) => a.order - b.order);

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

  const addLesson = () => {
    onChange(
      withOrder([
        ...value,
        new CourseCreateLessonCollectionLessonDetailRequest({
          lessonType: LessonContentEnum.PDF,
        }),
      ])
    );
  };

  const moveLesson = (currentOrder: number, direction: 'up' | 'down') => {
    const cloned = [...value];
    const current = cloned.find((x) => x.order === currentOrder);
    if (!current) return;

    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    const target = cloned.find((x) => x.order === targetOrder);
    if (!target) return;

    const temp = current.order;
    current.order = target.order;
    target.order = temp;

    onChange([...cloned].sort((a, b) => a.order - b.order));
  };

  const removeLesson = (idx: number) => {
    const cloned = [...value];
    cloned.splice(idx, 1);
    onChange(withOrder(cloned));
  };

  const handlePreview = (res: FileResourcesResponseForAdmin) => {
    if (!res.resourceUrl) return;
    setPreviewResource(res);

    if (res.type?.startsWith('image/')) setPreviewImageOpen(true);
    else if (res.type?.startsWith('video/')) setPreviewVideoOpen(true);
    else window.open(res.resourceUrl, '_blank');
  };

  const toggleCollapse = (order: number) => {
    setCollapsedMap((p) => ({
      ...p,
      [order]: !p[order],
    }));
  };

  return (
    <Box>
      {label && (
        <Typography fontWeight={600} mb={1}>
          {label}
        </Typography>
      )}

      {sortedValue.map((item, idx) => {
        const isCollapsed = collapsedMap[item.order];

        return (
          <Box key={item.order} mb={2} p={2} border="1px solid #e0e0e0" borderRadius={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={600}>
                  {t('lesson')} {item.order}
                </Typography>

                {isCollapsed && item.lessonCollectionName && (
                  <Typography color="text.secondary">– {item.lessonCollectionName}</Typography>
                )}
              </Stack>

              <Box>
                <IconButton size="small" onClick={() => toggleCollapse(item.order)}>
                  {isCollapsed ? <UnfoldMore fontSize="small" /> : <UnfoldLess fontSize="small" />}
                </IconButton>

                <IconButton size="small" disabled={item.order === 1} onClick={() => moveLesson(item.order, 'up')}>
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  disabled={item.order === value.length}
                  onClick={() => moveLesson(item.order, 'down')}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>

                <IconButton color="error" size="small" onClick={() => removeLesson(idx)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Stack>

            {/* COLLAPSED */}
            {isCollapsed && <Box mt={1} />}

            {/* EXPANDED */}
            {!isCollapsed && (
              <>
                <Box mt={2}>
                  <CustomTextField
                    label={t('lessonCollectionName')}
                    value={item.lessonCollectionName ?? ''}
                    onChange={(v) => update(idx, { lessonCollectionName: v })}
                    required
                  />
                </Box>

                <Box mt={2}>
                  <CustomTextField
                    label={t('lessonCollectionDetail')}
                    value={item.lessonCollectionDetail ?? ''}
                    onChange={(v) => update(idx, { lessonCollectionDetail: v })}
                    multiline
                    rows={3}
                  />
                </Box>

                <Grid container spacing={2} mt={1}>
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

                  <Grid item xs={12} sm={8}>
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
                      sx={{
                        height: 56, //  QUAN TRỌNG
                        justifyContent: 'space-between',
                        textTransform: 'none',
                        padding: '16.5px 14px', // giống OutlinedInput
                        borderColor: 'grey.400',

                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flexGrow: 1,
                          textAlign: 'left',
                          pr: 1,
                        }}
                      >
                        {resourceInfo[idx]?.name ??
                          (item.lessonType === LessonContentEnum.Video ? t('selectVideo') : t('selectResources'))}
                      </Box>
                    </Button>

                    <LinearLessonCollectionCreateByFileCategoryForm
                      open={openPickerIndex === idx}
                      value={resourceInfo[idx]}
                      lessonType={item.lessonType}
                      categoryUsecase={categoryUsecase}
                      onChange={(res) => {
                        update(idx, {
                          videoID: item.lessonType === LessonContentEnum.Video ? res.id : undefined,
                          resourceID: item.lessonType === LessonContentEnum.PDF ? res.id : undefined,
                        });
                        setResourceInfo((p) => ({ ...p, [idx]: res }));
                      }}
                      onClose={() => setOpenPickerIndex(null)}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        );
      })}

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

interface LinearLessonCollectionDetailCreateByFileCategoryFormProps {
  open: boolean;
  value?: FileResourcesResponse;
  onChange: (value: FileResourcesResponse) => void;
  onClose: () => void;
}

export default function LinearLessonCollectionDetailCreateByFileCategoryForm({
  open,
  value,
  onChange,
  onClose,
}: LinearLessonCollectionDetailCreateByFileCategoryFormProps) {
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

interface LinearLessonCollectionCreateByFileCategoryFormProps {
  open: boolean;
  value: FileResourcesResponse;
  lessonType: LessonContentEnum;
  onChange: (id: FileResourcesResponse) => void;
  onClose: () => void;
  categoryUsecase: CategoryUsecase | null;
}

export function LinearLessonCollectionCreateByFileCategoryForm({
  open,
  value,
  lessonType,
  onChange,
  onClose,
  categoryUsecase,
}: LinearLessonCollectionCreateByFileCategoryFormProps) {
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
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', overflow: 'ellipsis', textOverflow: 'ellipsis' }}
        >
          <Typography fontWeight={600} overflow={'ellipsis'}>
            {t('selectResources')}
          </Typography>
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
                          <ListItemText
                            primary={res.name}
                            secondary={`${res.type ?? ''} • ${res.size ?? 0} KB`}
                            primaryTypographyProps={{
                              noWrap: true,
                              sx: {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              },
                            }}
                            secondaryTypographyProps={{
                              noWrap: true,
                              sx: {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              },
                            }}
                          />
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

      {/* CourseTypeEnum-- Preview dialogs CourseTypeEnum-- */}

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
