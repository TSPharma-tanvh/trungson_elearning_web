'use client';

import * as React from 'react';
import { type CreateClassRequest } from '@/domain/models/class/request/create-class-request';
import { GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { type UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { type ClassResponse } from '@/domain/models/class/response/class-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMediaQuery, useTheme } from '@mui/system';
import { FileXls } from '@phosphor-icons/react';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import { ClassFilters } from '@/presentation/components/dashboard/class/classes/class-filter';
import ClassTable from '@/presentation/components/dashboard/class/classes/class-table';
import { CreateClassDialog } from '@/presentation/components/dashboard/class/classes/create-class-form';

export default function Page(): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const { classUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetClassRequest>(new GetClassRequest({ pageNumber: 1, pageSize: 10 }));
  const [classes, setClasses] = React.useState<ClassResponse[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const fetchClasses = React.useCallback(async () => {
    try {
      const request = new GetClassRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { class: classList, totalRecords } = await classUsecase.getClassListInfo(request);
      setClasses(classList);
      setTotalCount(totalRecords);
    } catch (error) {
      return undefined;
    }
  }, [filters, page, rowsPerPage, classUsecase]);

  React.useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

  const handleFilter = (newFilters: GetClassRequest) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleCreateClass = async (request: CreateClassRequest) => {
    try {
      await classUsecase.createClass(request);
      setShowCreateDialog(false);
      await fetchClasses();
    } catch (error) {
      return undefined;
    }
  };

  const handleEditClass = async (request: UpdateClassRequest) => {
    try {
      await classUsecase.updateClass(request);
      await fetchClasses();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteClass = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await classUsecase.deleteClass(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchClasses();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = classes.map((row) => ({
      [t('id')]: row.id ?? '',
      [t('name')]: row.className ?? '',
      [t('detail')]: row.classDetail ?? '',
      [t('duration')]: row.duration ?? '',
      [t('attendanceRecordsCount')]: row.attendanceRecords?.length ?? '',
      [t('enrollmentCriteriaCount')]: row.enrollmentCriteria?.length ?? '',
      [t('teacher')]: row.classTeacher?.user?.employee?.name ?? '',
      [t('classType')]: row.classType ? t(row.classType.toLowerCase()) : '',
      [t('scheduleStatus')]: row.scheduleStatus ? t(row.scheduleStatus.toLowerCase()) : '',
      [t('category')]: row.category?.categoryName ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Classes');

    const dateTimeString = DateTimeUtils.getTodayAsString();
    XLSX.writeFile(wb, `Classes_${dateTimeString}.xlsx`);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('class')}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<FileXls fontSize="var(--icon-fontSize-md)" />}
              onClick={() => { handleExportToExcel(); }}
            >
              {t('exportToExcel')}
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            {t('add')}
          </Button>
        </div>
      </Stack>
      <ClassFilters onFilter={handleFilter} />
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
        {/* <Box flex={1}>
          <CategoryMultiCheckForm onChange={handleAddClick} />
        </Box> */}

        <ClassTable
          rows={classes}
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onDeleteClass={handleDeleteClass}
          onEditClass={handleEditClass}
        />
      </Stack>

      {/* <AddCustomerDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => {
          setShowForm(false);
        }}
      /> */}

      <CreateClassDialog
        onSubmit={handleCreateClass}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      />
    </Stack>
  );
}
