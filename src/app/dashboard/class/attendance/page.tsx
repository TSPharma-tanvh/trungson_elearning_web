'use client';

import * as React from 'react';
import { type CreateAttendanceReportRequest } from '@/domain/models/attendance/request/create-attendance-report-request';
import { type EnrollUserListToClassRequest } from '@/domain/models/attendance/request/enroll-user-to-class-request';
import { GetAttendanceRecordsRequest } from '@/domain/models/attendance/request/get-attendance-records-request';
import { type UpdateAttendanceRecordsRequest } from '@/domain/models/attendance/request/update-attendance-records-request';
import { type AttendanceRecordDetailResponse } from '@/domain/models/attendance/response/attendance-record-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMediaQuery, useTheme } from '@mui/system';
import { FileXls } from '@phosphor-icons/react';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { useTranslation } from 'react-i18next';

import { AttendanceRecordsFilters } from '@/presentation/components/dashboard/class/attendance/attendance-records-filter';
import AttendanceRecordsTable from '@/presentation/components/dashboard/class/attendance/attendance-records-table';
import { CreateAttendanceReportDialog } from '@/presentation/components/dashboard/class/attendance/create-attendance-report-form';
import { CreateAttendanceRecordsDialog } from '@/presentation/components/dashboard/class/attendance/enroll-user-to-class-form';

export default function Page(): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const { attendanceRecordsUsecase, classUsecase, enrollUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showCreateReportDialog, setShowCreateReportDialog] = React.useState(false);

  const [filters, setFilters] = React.useState<GetAttendanceRecordsRequest>(
    new GetAttendanceRecordsRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [attendanceRecords, setAttendanceRecordses] = React.useState<AttendanceRecordDetailResponse[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);
  const [enrollLoading, setEnrollLoading] = React.useState(false);

  const fetchAttendanceRecords = React.useCallback(async () => {
    try {
      const request = new GetAttendanceRecordsRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { records: attendanceRecordsList, totalRecords } =
        await attendanceRecordsUsecase.getAttendanceRecordsListInfo(request);
      setAttendanceRecordses(attendanceRecordsList);
      setTotalCount(totalRecords);
    } catch (error) {
      return undefined;
    }
  }, [filters, page, rowsPerPage, attendanceRecordsUsecase]);

  React.useEffect(() => {
    void fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  const handleFilter = (newFilters: GetAttendanceRecordsRequest) => {
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

  const handleCreateAttendanceRecords = async (request: EnrollUserListToClassRequest) => {
    setEnrollLoading(true);
    try {
      await attendanceRecordsUsecase.enrollUserListToClass(request);
      setShowCreateDialog(false);
      await fetchAttendanceRecords();
    } catch (error) {
      return undefined;
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleCreateAttendanceReport = async (request: CreateAttendanceReportRequest) => {
    try {
      const response = await attendanceRecordsUsecase.createAttendanceReport(request);
      setShowCreateReportDialog(false);

      const byteCharacters = atob(response.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: response.contentType ?? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = response.fileName ?? 'AttendanceReport.xlsx';
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      return null;
    }
  };

  const handleEditAttendanceRecords = async (request: UpdateAttendanceRecordsRequest) => {
    try {
      await attendanceRecordsUsecase.updateAttendanceRecords(request);
      await fetchAttendanceRecords();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteAttendanceRecords = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await attendanceRecordsUsecase.deleteAttendanceRecords(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchAttendanceRecords();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('attendance')}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<FileXls fontSize="var(--icon-fontSize-md)" />}
              onClick={() => {
                setShowCreateReportDialog(true);
              }}
            >
              {t('createAttendanceReport')}
            </Button>
          </Stack>
        </Stack>
        <div>
          {' '}
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            {t('enrollUser')}
          </Button>
        </div>
      </Stack>
      <AttendanceRecordsFilters
        onFilter={handleFilter}
        classUsecase={classUsecase}
        enrollUsecase={enrollUsecase}
        form={filters}
        handleChange={(field, value) => {
          setFilters(
            (prev) =>
              new GetAttendanceRecordsRequest({
                ...prev,
                [field]: value,
              })
          );
        }}
      />
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
        <AttendanceRecordsTable
          rows={attendanceRecords}
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onDeleteAttendanceRecords={handleDeleteAttendanceRecords}
          onEditAttendanceRecords={handleEditAttendanceRecords}
        />
      </Stack>

      {/* <AddCustomerDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => {
          setShowForm(false);
        }}
      /> */}

      <CreateAttendanceRecordsDialog
        onSubmit={handleCreateAttendanceRecords}
        disabled={false}
        loading={enrollLoading}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      />

      <CreateAttendanceReportDialog
        onSubmit={handleCreateAttendanceReport}
        disabled={false}
        loading={false}
        open={showCreateReportDialog}
        onClose={() => {
          setShowCreateReportDialog(false);
        }}
      />
    </Stack>
  );
}
