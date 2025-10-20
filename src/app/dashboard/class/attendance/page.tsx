'use client';

import * as React from 'react';
import { type EnrollUserListToClassRequest } from '@/domain/models/attendance/request/enroll-user-to-class-request';
import { GetAttendanceRecordsRequest } from '@/domain/models/attendance/request/get-attendance-records-request';
import { type UpdateAttendanceRecordsRequest } from '@/domain/models/attendance/request/update-attendance-records-request';
import { type AttendanceRecordDetailResponse } from '@/domain/models/attendance/response/attendance-record-detail-response';
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

import { AttendanceRecordsFilters } from '@/presentation/components/dashboard/class/attendance/attendance-records-filter';
import AttendanceRecordsTable from '@/presentation/components/dashboard/class/attendance/attendance-records-table';
import { CreateAttendanceRecordsDialog } from '@/presentation/components/dashboard/class/attendance/enroll-user-to-class-form';

export default function Page(): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const { attendanceRecordsUsecase, classUsecase, enrollUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetAttendanceRecordsRequest>(
    new GetAttendanceRecordsRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [attendanceRecordses, setAttendanceRecordses] = React.useState<AttendanceRecordDetailResponse[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const fetchAttendanceRecordses = React.useCallback(async () => {
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
    void fetchAttendanceRecordses();
  }, [fetchAttendanceRecordses]);

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
    try {
      await attendanceRecordsUsecase.enrollUserListToClass(request);
      setShowCreateDialog(false);
      await fetchAttendanceRecordses();
    } catch (error) {
      return undefined;
    }
  };

  const handleEditAttendanceRecords = async (request: UpdateAttendanceRecordsRequest) => {
    try {
      await attendanceRecordsUsecase.updateAttendanceRecords(request);
      await fetchAttendanceRecordses();
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
      await fetchAttendanceRecordses();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = attendanceRecordses.map((row) => ({
      [t('id')]: row.id ?? '',
      [t('userName')]: row.user?.employee?.name ?? '',
      [t('classId')]: row.classID ?? '',
      [t('enrollmentId')]: row.enrollment?.id ?? '',
      [t('enrollmentCriteriaName')]: row.enrollment?.enrollmentCriteria?.name ?? '',
      [t('className')]: row.class?.className ?? '',
      [t('startAt')]: row.startAt ? DateTimeUtils.formatDateTimeToDateString(row.startAt) : '',
      [t('endAt')]: row.endAt ? DateTimeUtils.formatDateTimeToDateString(row.endAt) : '',
      [t('checkInTime')]: row.checkInTime ? DateTimeUtils.formatDateTimeToDateString(row.checkInTime) : '',
      [t('statusCheckIn')]: row.statusCheckIn ? t(row.statusCheckIn.toLowerCase()) : '',
      [t('checkOutTime')]: row.checkOutTime ? DateTimeUtils.formatDateTimeToDateString(row.checkOutTime) : '',
      [t('statusCheckOut')]: row.statusCheckOut ? t(row.statusCheckOut.toLowerCase()) : '',
      [t('enrollmentDate')]: row.enrollment?.enrollmentDate
        ? DateTimeUtils.formatDateTimeToDateString(row.enrollment.enrollmentDate)
        : '',
      [t('approvedAt')]: row.enrollment?.approvedAt
        ? DateTimeUtils.formatDateTimeToDateString(row.enrollment.approvedAt)
        : '',
      [t('activeStatus')]: row.activeStatus ? t(row.activeStatus.toLowerCase()) : '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AttendanceRecords');

    const today = DateTimeUtils.getTodayAsString();

    XLSX.writeFile(wb, `AttendanceRecords_${today}.xlsx`);
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
              onClick={() => { handleExportToExcel(); }}
            >
              {t('exportToExcel')}
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
          rows={attendanceRecordses}
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
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      />
    </Stack>
  );
}
