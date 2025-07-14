// import React from 'react';
// import { UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
// import { ClassResponse } from '@/domain/models/class/response/class-response';
// import { DateTimeUtils } from '@/utils/date-time-utils';
// import { MoreVert } from '@mui/icons-material';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   Checkbox,
//   IconButton,
//   MenuItem,
//   MenuList,
//   Popover,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Typography,
// } from '@mui/material';

// import { ConfirmDeleteDialog } from '../../../core/dialog/confirm-delete-dialog';
// import ClassDetailForm from './class-detail-form';
// import { UpdateClassFormDialog } from './update-class-form';

// interface ClassTableProps {
//   rows: ClassResponse[];
//   count: number;
//   page: number;
//   rowsPerPage: number;
//   onPageChange: (event: unknown, newPage: number) => void;
//   onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   onDeleteClass: (ids: string[]) => Promise<void>;
//   onEditClass: (data: UpdateClassRequest) => Promise<void>;
// }

// export default function ClassTable({
//   rows,
//   count,
//   page,
//   rowsPerPage,
//   onPageChange,
//   onRowsPerPageChange,
//   onDeleteClass,
//   onEditClass,
// }: ClassTableProps) {
//   const rowIds = React.useMemo(() => rows.map((r) => r.id!), [rows]);
//   const [selected, setSelected] = React.useState<Set<string>>(new Set());
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [selectedRow, setSelectedRow] = React.useState<ClassResponse | null>(null);
//   const [viewOpen, setViewOpen] = React.useState(false);
//   const [editClassData, setEditPathData] = React.useState<ClassResponse | null>(null);
//   const [editOpen, setEditOpen] = React.useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
//   const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

//   const isSelected = (id: string) => selected.has(id);

//   const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelected(event.target.checked ? new Set(rowIds) : new Set());
//   };

//   const handleSelectOne = (id: string) => {
//     setSelected((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: ClassResponse) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRow(row);
//   };

//   const handleMenuClose = () => setAnchorEl(null);

//   const handleOpenDeleteDialog = (ids: string[]) => {
//     setIdsToDelete(ids);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     await onDeleteClass(idsToDelete);
//     setSelected((prev) => {
//       const next = new Set(prev);
//       idsToDelete.forEach((id) => next.delete(id));
//       return next;
//     });
//     setDeleteDialogOpen(false);
//     setIdsToDelete([]);
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setIdsToDelete([]);
//   };

//   return (
//     <>
//       <Card
//         sx={{
//           p: '0 0 8px 0',
//           backgroundColor: 'var(--mui-palette-common-white)',
//           color: 'var(--mui-palette-primary-main)',
//           border: '1px solid var(--mui-palette-primary-main)',
//           borderRadius: '16px',
//         }}
//       >
//         {selected.size > 0 && (
//           <Box
//             display="flex"
//             justifyContent="flex-end"
//             p={2}
//             sx={{ backgroundColor: 'var(--mui-palette-primary-main)' }}
//           >
//             <Button
//               sx={{
//                 backgroundColor: 'var(--mui-palette-secondary-main)',
//                 color: 'var(--mui-palette-common-white)',
//                 '&:hover': { backgroundColor: 'var(--mui-palette-secondary-dark)' },
//               }}
//               variant="contained"
//               onClick={() => handleOpenDeleteDialog(Array.from(selected))}
//             >
//               Delete Selected ({selected.size})
//             </Button>
//           </Box>
//         )}

//         <TableContainer sx={{ border: 'none' }}>
//           <Table>
//             <TableHead
//               sx={{
//                 '& .MuiTableCell-head': {
//                   backgroundColor: 'var(--mui-palette-primary-main)',
//                   color: 'var(--mui-palette-common-white)',
//                 },
//                 '& .MuiTableCell-body': {
//                   borderBottom: '1px solid var(--mui-palette-primary-main)',
//                 },
//               }}
//             >
//               <TableRow>
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     checked={selected.size === rows.length && rows.length > 0}
//                     indeterminate={selected.size > 0 && selected.size < rows.length}
//                     onChange={handleSelectAll}
//                     sx={{
//                       color: 'var(--mui-palette-common-white)',
//                       '&.Mui-checked': {
//                         color: 'var(--mui-palette-common-white)',
//                       },
//                       '&.MuiCheckbox-indeterminate': {
//                         color: 'var(--mui-palette-common-white)',
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Detail</TableCell>
//                 <TableCell>Duration</TableCell>
//                 <TableCell>QR Code Url</TableCell>
//                 <TableCell>Start Time</TableCell>
//                 <TableCell>End Time</TableCell>
//                 <TableCell>Minute Late</TableCell>
//                 <TableCell>Class Type</TableCell>
//                 <TableCell>Schedule Status</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody
//               sx={{
//                 '& .MuiTableCell-body': {
//                   borderBottom: '1px solid var(--mui-palette-primary-main)',
//                 },
//               }}
//             >
//               {rows.map((row) => {
//                 const isItemSelected = isSelected(row.id!);
//                 return (
//                   <TableRow key={row.id} selected={isItemSelected} hover>
//                     <TableCell padding="checkbox">
//                       <Checkbox checked={isItemSelected} onChange={() => handleSelectOne(row.id!)} />
//                     </TableCell>
//                     <TableCell>
//                       <Stack direction="row" alignItems="center" spacing={2}>
//                         <Avatar src={row.thumbnail?.resourceUrl}>{row.className?.[0]}</Avatar>
//                         <Box>
//                           <Typography variant="subtitle2" noWrap>
//                             {row.className}
//                           </Typography>
//                         </Box>
//                       </Stack>
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
//                       <Typography variant="body2">{row.classDetail}</Typography>
//                     </TableCell>
//                     <TableCell>{row.duration}</TableCell>
//                     <TableCell>{row.qrCodeURL}</TableCell>
//                     <TableCell>{DateTimeUtils.formatISODateFromDate(row.startAt)}</TableCell>
//                     <TableCell>{DateTimeUtils.formatISODateFromDate(row.endAt)}</TableCell>
//                     <TableCell>{row.minuteLate}</TableCell>
//                     <TableCell>{row.classType}</TableCell>
//                     <TableCell>{row.scheduleStatus}</TableCell>
//                     <TableCell>{row.category?.categoryName}</TableCell>
//                     <TableCell align="right">
//                       <IconButton onClick={(event) => handleMenuClick(event, row)}>
//                         <MoreVert />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Box display="flex" justifyContent="flex-end" pr={2} mt={1}>
//           <TablePagination
//             component="div"
//             count={count}
//             page={page}
//             rowsPerPage={rowsPerPage}
//             onPageChange={onPageChange}
//             onRowsPerPageChange={onRowsPerPageChange}
//             labelDisplayedRows={() => `Page ${page + 1} of ${Math.ceil(count / rowsPerPage)}`}
//             sx={{
//               '& .MuiTablePagination-actions button': {
//                 color: 'var(--mui-palette-primary-main)',
//                 '&.Mui-disabled': {
//                   color: 'var(--mui-palette-action-disabled)',
//                 },
//               },

//               // '& .MuiTablePagination-select': {
//               //   color: 'var(--mui-palette-primary-main)',
//               // },
//               // '& .MuiTablePagination-displayedRows': {
//               //   color: 'var(--mui-palette-primary-main)',
//               // },
//             }}
//           />
//         </Box>
//       </Card>

//       <Popover
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         onClose={handleMenuClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <MenuList>
//           <MenuItem
//             onClick={() => {
//               if (selectedRow) setViewOpen(true);
//               handleMenuClose();
//             }}
//           >
//             View Details
//           </MenuItem>
//           <MenuItem
//             onClick={() => {
//               if (selectedRow) {
//                 setEditPathData(selectedRow);
//                 setEditOpen(true);
//               }
//               handleMenuClose();
//             }}
//           >
//             Edit
//           </MenuItem>
//           <MenuItem
//             onClick={() => {
//               if (selectedRow?.id) handleOpenDeleteDialog([selectedRow.id]);
//               handleMenuClose();
//             }}
//           >
//             Delete
//           </MenuItem>
//         </MenuList>
//       </Popover>

//       {editClassData && (
//         <UpdateClassFormDialog
//           open={editOpen}
//           classes={editClassData}
//           onClose={() => setEditOpen(false)}
//           onSubmit={async (updatedData) => {
//             await onEditClass(updatedData);
//             setEditOpen(false);
//           }}
//         />
//       )}

//       {selectedRow && <ClassDetailForm open={viewOpen} classId={selectedRow.id} onClose={() => setViewOpen(false)} />}

//       <ConfirmDeleteDialog
//         open={deleteDialogOpen}
//         selectedCount={idsToDelete.length}
//         onCancel={handleCancelDelete}
//         onConfirm={handleConfirmDelete}
//       />
//     </>
//   );
// }
import React from 'react';
import { UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { ClassResponse } from '@/domain/models/class/response/class-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';

import { CustomTable } from '@/presentation/components/core/custom-table';

import { ConfirmDeleteDialog } from '../../../core/dialog/confirm-delete-dialog';
import ClassDetailForm from './class-detail-form';
import { UpdateClassFormDialog } from './update-class-form';

interface ClassTableProps {
  rows: ClassResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteClass: (ids: string[]) => Promise<void>;
  onEditClass: (data: UpdateClassRequest) => Promise<void>;
}

export default function ClassTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteClass,
  onEditClass,
}: ClassTableProps) {
  const [selectedRow, setSelectedRow] = React.useState<ClassResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editClassData, setEditClassData] = React.useState<ClassResponse | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteClass([pendingDeleteId]);
      setPendingDeleteId(null);
    }
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setDialogOpen(false);
  };
  const handleView = (row: ClassResponse) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  const handleEdit = (row: ClassResponse) => {
    setEditClassData(row);
    setEditOpen(true);
  };

  const handleDelete = (row: ClassResponse) => {
    onDeleteClass([row.id!]);
  };

  return (
    <>
      <CustomTable<ClassResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        renderHeader={() => (
          <>
            <TableCell>Name</TableCell>
            <TableCell>Detail</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>QR Code Url</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Minute Late</TableCell>
            <TableCell>Class Type</TableCell>
            <TableCell>Schedule Status</TableCell>
            <TableCell>Category</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.thumbnail?.resourceUrl}>{row.className?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.className}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
              <Typography variant="body2">{row.classDetail}</Typography>
            </TableCell>
            <TableCell>{row.duration}</TableCell>
            <TableCell>{row.qrCodeURL}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.startAt)}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.endAt)}</TableCell>
            <TableCell>{row.minuteLate}</TableCell>
            <TableCell>{row.classType}</TableCell>
            <TableCell>{row.scheduleStatus}</TableCell>
            <TableCell>{row.category?.categoryName}</TableCell>
            <TableCell align="right">
              <IconButton onClick={onActionClick}>
                <MoreVert />
              </IconButton>
            </TableCell>
          </>
        )}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteClass}
        actionMenuItems={[
          { label: 'View Details', onClick: handleView },
          { label: 'Edit', onClick: handleEdit },
          {
            label: 'Delete',
            onClick: (row) => {
              if (row.id) handleRequestDelete(row.id);
            },
          },
        ]}
      />

      {editClassData && (
        <UpdateClassFormDialog
          open={editOpen}
          classes={editClassData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditClass(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {selectedRow && <ClassDetailForm open={viewOpen} classId={selectedRow.id} onClose={() => setViewOpen(false)} />}

      <ConfirmDeleteDialog
        open={dialogOpen}
        selectedCount={1}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
