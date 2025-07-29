'use client';

import React from 'react';
import { type CreateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/create-enrollment-criteria-request';
import { GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import { type UpdateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/update-enrollment-criteria-request';
import { type EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { CreateEnrollmentDialog } from '@/presentation/components/dashboard/management/enrollment/enrollment-create-form';
import { EnrollmentFilters } from '@/presentation/components/dashboard/management/enrollment/enrollment-filter';
import EnrollmentTable from '@/presentation/components/dashboard/management/enrollment/enrollment-table';

export default function Page(): React.JSX.Element {
  const { enrollUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetEnrollmentCriteriaRequest>(
    new GetEnrollmentCriteriaRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [enrollments, setEnrollments] = React.useState<EnrollmentCriteriaDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchEnrollments = React.useCallback(async () => {
    try {
      const request = new GetEnrollmentCriteriaRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { enrollments: enrollmentList, totalRecords } = await enrollUsecase.getEnrollmentList(request);
      setEnrollments(enrollmentList);
      setTotalCount(totalRecords);
    } catch (error) {
      setEnrollments([]);
      return undefined;
    }
  }, [filters, page, rowsPerPage, enrollUsecase]);

  React.useEffect(() => {
    void fetchEnrollments();
  }, [fetchEnrollments]);

  const handleFilter = (newFilters: GetEnrollmentCriteriaRequest) => {
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

  const handleCreateEnrollment = async (request: CreateEnrollmentCriteriaRequest) => {
    try {
      await enrollUsecase.createEnrollment(request);
      setShowCreateDialog(false);
      await fetchEnrollments();
    } catch (error) {
      return undefined;
    }
  };

  const handleEditEnrollment = async (request: UpdateEnrollmentCriteriaRequest) => {
    try {
      await enrollUsecase.updateEnrollment(request);
      await fetchEnrollments();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteEnrollments = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await enrollUsecase.deleteEnrollment(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchEnrollments();
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
            Enrollment Criteria
          </Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => {
            setShowCreateDialog(true);
          }}
        >
          Add
        </Button>
      </Stack>
      <EnrollmentFilters onFilter={handleFilter} />
      <EnrollmentTable
        rows={enrollments}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteEnrollments={handleDeleteEnrollments}
        onEditEnrollment={handleEditEnrollment}
      />

      <CreateEnrollmentDialog
        onSubmit={handleCreateEnrollment}
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
