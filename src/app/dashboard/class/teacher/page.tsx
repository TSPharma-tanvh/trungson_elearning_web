'use client';

import * as React from 'react';
import { type CreateClassTeacherRequest } from '@/domain/models/teacher/request/create-class-teacher-request';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { type UpdateClassTeacherRequest } from '@/domain/models/teacher/request/update-class-teacher-request';
import { type ClassTeacherResponse } from '@/domain/models/teacher/response/class-teacher-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';

import { ClassTeacherFilters } from '@/presentation/components/dashboard/class/teacher/class-teacher-filter';
import TeacherTable from '@/presentation/components/dashboard/class/teacher/class-teacher-table';
import { CreateClassTeacherDialog } from '@/presentation/components/dashboard/class/teacher/create-teacher-form';

export default function Page(): React.JSX.Element {
  const { classTeacherUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetClassTeacherRequest>(
    new GetClassTeacherRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [teachers, setTeachers] = React.useState<ClassTeacherResponse[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const fetchTeachers = React.useCallback(async () => {
    try {
      const request = new GetClassTeacherRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { teachers: teacherList, totalRecords } = await classTeacherUsecase.getClassTeacherListInfo(request);
      setTeachers(teacherList);
      setTotalCount(totalRecords);
    } catch (error) {
      return undefined;
    }
  }, [filters, page, rowsPerPage, classTeacherUsecase]);

  React.useEffect(() => {
    void fetchTeachers();
  }, [fetchTeachers]);

  const handleFilter = (newFilters: GetClassTeacherRequest) => {
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

  const handleCreateTeacher = async (request: CreateClassTeacherRequest) => {
    try {
      await classTeacherUsecase.createClassTeacher(request);
      setShowCreateDialog(false);
      await fetchTeachers();
    } catch (error) {
      return undefined;
    }
  };

  const handleEditTeacher = async (request: UpdateClassTeacherRequest) => {
    try {
      await classTeacherUsecase.updateClassTeacher(request);
      await fetchTeachers();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteTeachers = async (ids: string[], userIds: string[]) => {
    try {
      setDeleteLoading(true);
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const userId = userIds[i];
        const response = await classTeacherUsecase.deleteClassTeacher(id, userId);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchTeachers();
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
          <Typography variant="h4">Class Teacher</Typography>
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
      <ClassTeacherFilters onFilter={handleFilter} />
      <TeacherTable
        rows={teachers}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteTeachers={handleDeleteTeachers}
        onEditTeacher={handleEditTeacher}
      />

      {/* <AddCustomerDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => {
          setShowForm(false);
        }}
      /> */}

      <CreateClassTeacherDialog
        onSubmit={handleCreateTeacher}
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
