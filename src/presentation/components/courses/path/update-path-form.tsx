'use client';

import { useEffect, useRef, useState } from 'react';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { CategoryResponse } from '@/domain/models/category/response/category-response';
import { CategoryListResult } from '@/domain/models/category/response/category-result';
import { UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';
import { CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { CategoryEnum, CategoryEnumUtils } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Calendar, CheckCircle, Image as ImageIcon, Note, Tag } from '@phosphor-icons/react';

import CustomSnackBar from '../../core/snack-bar/custom-snack-bar';

interface EditPathDialogProps {
  open: boolean;
  path: CoursePathResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateCoursePathRequest) => void;
}

export function UpdatePathFormDialog({ open, path: user, onClose, onSubmit }: EditPathDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<UpdateCoursePathRequest>(new UpdateCoursePathRequest());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // Category loading logic
  const categoryUsecase = useDI().categoryUsecase as CategoryUsecase;
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [initialRenderDone, setInitialRenderDone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // useEffect(() => {
  //   setIsMounted(open);
  //   if (open) {
  //     loadCategories(1);
  //     if (!initialRenderDone) {
  //       setIsSelectOpen(true);
  //     }
  //   }
  //   return () => {
  //     if (abortControllerRef.current) {
  //       abortControllerRef.current.abort();
  //       abortControllerRef.current = null;
  //     }
  //   };
  // }, [open]);
  useEffect(() => {
    setIsMounted(open);
  }, [open]);

  useEffect(() => {
    if (isMounted) {
      loadCategories(1);
      if (!initialRenderDone) {
        setIsSelectOpen(false);
      }
    }
  }, [isMounted]);

  const loadCategories = async (page: number) => {
    if (!categoryUsecase || loadingCategories || !isMounted) return;
    setLoadingCategories(true);
    abortControllerRef.current = new AbortController();
    try {
      const request = new GetCategoryRequest({
        category: CategoryEnumUtils.getCategoryKeyFromValue(CategoryEnum.Path),
        pageNumber: page,
        pageSize: 10,
      });
      const result: CategoryListResult = await categoryUsecase.getCategoryList(request);
      if (isMounted) {
        setCategories((prev) => (page === 1 ? result.categories : [...prev, ...result.categories]));
        setHasMore(result.categories.length > 0 && result.totalRecords > categories.length + result.categories.length);
        setPageNumber(page);
      }
    } catch (error) {
    } finally {
      if (isMounted) {
        setLoadingCategories(false);
      }
    }
  };

  useEffect(() => {
    if (loadingCategories || !hasMore || hasOverflow || !isMounted) return;

    const checkOverflow = () => {
      if (!isMounted) return;

      if (!initialRenderDone) {
        setInitialRenderDone(true);
        setIsSelectOpen(false);
      }

      if (listRef.current) {
        const { scrollHeight, clientHeight } = listRef.current;
        const isOverflowing = scrollHeight > clientHeight;
        setHasOverflow(isOverflowing);
        console.log('Overflow check:', { scrollHeight, clientHeight, isOverflowing, pageNumber });

        if (!isOverflowing && hasMore) {
          loadCategories(pageNumber + 1);
        }
      }
    };

    const timer = setTimeout(checkOverflow, 100);

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (listRef.current) {
      resizeObserver.observe(listRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (listRef.current) {
        resizeObserver.unobserve(listRef.current);
      }
    };
  }, [categories, loadingCategories, hasMore, hasOverflow, initialRenderDone, isMounted]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loadingCategories && isMounted) {
      loadCategories(pageNumber + 1);
    }
  };

  useEffect(() => {
    if (user && open) {
      setFormData(
        new UpdateCoursePathRequest({
          id: user.id || '',
          name: user.name || '',
          detail: user.detail || undefined,
          isRequired: user.isRequired || false,
          startTime: user.startTime || '',
          endTime: user.endTime || '',
          status: user.status !== undefined ? StatusEnum[user.status as keyof typeof StatusEnum] : undefined,
          displayType:
            user.displayType !== undefined
              ? DisplayTypeEnum[user.displayType as keyof typeof DisplayTypeEnum]
              : undefined,
          // courseIds: user.courseIds?.join(',') || undefined,
          enrollmentCriteriaID: user.enrollmentCriteriaID || undefined,
          categoryID: user.categoryID || undefined,
          thumbnailID: user.thumbnailID || undefined,
          // thumbDocumentNo: user.thumbDocumentNo || undefined,
          // thumbPrefixName: user.thumbPrefixName || undefined,
          categoryEnum: CategoryEnumUtils.getCategoryKeyFromValue(CategoryEnum.Path),
          isDeleteOldThumbnail: false,
        })
      );
      setPreviewUrl(user.thumbnail?.resourceUrl || null);
    }
  }, [user, open]);

  useEffect(() => {
    if (!open) {
      setFormData(
        new UpdateCoursePathRequest({ categoryEnum: CategoryEnumUtils.getCategoryKeyFromValue(CategoryEnum.Path) })
      );
      setPreviewUrl(null);
      setCategories([]);
      setPageNumber(1);
      setHasMore(true);
      setHasOverflow(false);
      setIsSelectOpen(false);
      setInitialRenderDone(false);
      setIsMounted(false);
    }
  }, [open]);

  const handleChange = <K extends keyof UpdateCoursePathRequest>(field: K, value: UpdateCoursePathRequest[K]) => {
    setFormData((prev) => new UpdateCoursePathRequest({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error updating path:', error);
      CustomSnackBar.showSnackbar('Failed to update path', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Update Course Path</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <Typography variant="body2" mb={2}>
            ID: {user.id}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Detail"
                value={formData.detail || ''}
                onChange={(e) => handleChange('detail', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Note {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Time"
                type="datetime-local"
                value={formData.startTime || ''}
                onChange={(e) => handleChange('startTime', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Time"
                type="datetime-local"
                value={formData.endTime || ''}
                onChange={(e) => handleChange('endTime', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel shrink>Status</InputLabel>
                <Select
                  value={formData.status ?? ''}
                  onChange={(e) => handleChange('status', Number(e.target.value) as StatusEnum)}
                  displayEmpty
                >
                  <MenuItem value={StatusEnum.Enable}>Enable</MenuItem>
                  <MenuItem value={StatusEnum.Disable}>Disable</MenuItem>
                  <MenuItem value={StatusEnum.Deleted}>Deleted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel shrink>Display Type</InputLabel>
                <Select
                  value={formData.displayType ?? ''}
                  onChange={(e) => handleChange('displayType', Number(e.target.value) as DisplayTypeEnum)}
                  displayEmpty
                >
                  <MenuItem value={DisplayTypeEnum.Public}>Public</MenuItem>
                  <MenuItem value={DisplayTypeEnum.Private}>Private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Course IDs (comma-separated)"
                value={formData.courseIds || ''}
                onChange={(e) => handleChange('courseIds', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Enrollment Criteria ID"
                value={formData.enrollmentCriteriaID || ''}
                onChange={(e) => handleChange('enrollmentCriteriaID', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel id="category-select-label" shrink>
                  Category
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  value={formData.categoryID || ''}
                  onChange={(e) => handleChange('categoryID', e.target.value as string)}
                  open={isSelectOpen}
                  onOpen={() => setIsSelectOpen(true)}
                  onClose={() => setIsSelectOpen(false)}
                  displayEmpty
                  input={<OutlinedInput label="Category" />}
                  renderValue={(selected) =>
                    selected
                      ? categories.find((cat) => cat.id === selected)?.categoryName || 'Select Category'
                      : 'Select Category'
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#2D3748' : '#F7FAFC',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#4A5568' : '#CBD5E0',
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#718096' : '#A0AEC0',
                          },
                        },
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${theme.palette.mode === 'dark' ? '#4A5568 #2D3748' : '#CBD5E0 #F7FAFC'}`,
                      },
                    },
                    MenuListProps: {
                      ref: listRef,
                      onScroll: handleScroll,
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <ListItemText primary={category.categoryName} />
                    </MenuItem>
                  ))}
                  {loadingCategories && (
                    <Box textAlign="center" py={1}>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Thumbnail ID"
                value={formData.thumbnailID || ''}
                onChange={(e) => handleChange('thumbnailID', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Thumbnail Document No"
                value={formData.thumbDocumentNo || ''}
                onChange={(e) => handleChange('thumbDocumentNo', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Thumbnail Prefix Name"
                value={formData.thumbPrefixName || ''}
                onChange={(e) => handleChange('thumbPrefixName', e.target.value)}
                fullWidth
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon {...iconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData.isRequired}
                    onChange={(e) => handleChange('isRequired', e.target.checked)}
                    disabled={isSubmitting}
                  />
                }
                label="Is Required"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData.isDeleteOldThumbnail}
                    onChange={(e) => handleChange('isDeleteOldThumbnail', e.target.checked)}
                    disabled={isSubmitting}
                  />
                }
                label="Delete Old Thumbnail"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={isSubmitting}
                startIcon={<ImageIcon {...iconStyle} />}
              >
                Upload Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleChange('thumbnail', file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </Button>
              {previewUrl && (
                <Box
                  sx={{
                    width: fullScreen ? 300 : 150,
                    height: fullScreen ? 300 : 150,
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    overflow: 'hidden',
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mx: 'auto',
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Thumbnail Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            m: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
