'use client';

import React, { useState } from 'react';
import { CreateCoursePathRequest } from '@/domain/models/path/request/create-path-request';
import { CategoryEnum, DisplayTypeEnum, StatusEnum } from '@/utils/enum/core-enum';
import { Box, Grid } from '@mui/material';

import { CustomButton } from '../../core/button/custom-button';
import { CustomSelectDropDown } from '../../core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '../../core/picker/custom-date-picker';
import { CustomTextField } from '../../core/text-field/custom-textfield';

interface Props {
  disabled?: boolean;
  onSubmit: (data: CreateCoursePathRequest) => void;
  loading?: boolean;
}

export function CreateCoursePathForm({ disabled = false, onSubmit, loading = false }: Props) {
  const [form, setForm] = useState<CreateCoursePathRequest>(
    new CreateCoursePathRequest({
      name: '',
      detail: '',
      isRequired: false,
      startTime: '',
      endTime: '',
      status: StatusEnum.Enable,
      displayType: DisplayTypeEnum.Public,
      categoryEnum: CategoryEnum.Path,
    })
  );

  const handleChange = <K extends keyof CreateCoursePathRequest>(key: K, value: CreateCoursePathRequest[K]) => {
    setForm((prev) => new CreateCoursePathRequest({ ...prev, [key]: value }));
  };

  return (
    <Box component="form" noValidate autoComplete="off" p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomTextField
            label="Tên khóa học"
            value={form.name}
            onChange={(val) => handleChange('name', val)}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomTextField
            label="Chi tiết"
            value={form.detail}
            onChange={(val) => handleChange('detail', val)}
            disabled={disabled}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomDateTimePicker
            label="Thời gian bắt đầu"
            value={form.startTime}
            onChange={(val) => handleChange('startTime', val)}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomDateTimePicker
            label="Thời gian kết thúc"
            value={form.endTime}
            onChange={(val) => handleChange('endTime', val)}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelectDropDown<StatusEnum>
            label="Trạng thái"
            value={form.status!}
            onChange={(val) => handleChange('status', val)}
            disabled={disabled}
            options={[
              { value: StatusEnum.Enable, label: 'Kích hoạt' },
              { value: StatusEnum.Disable, label: 'Tạm khóa' },
            ]}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelectDropDown<DisplayTypeEnum>
            label="Kiểu hiển thị"
            value={form.displayType!}
            onChange={(val) => handleChange('displayType', val)}
            disabled={disabled}
            options={[
              { value: DisplayTypeEnum.Public, label: 'Công khai' },
              { value: DisplayTypeEnum.Private, label: 'Riêng tư' },
            ]}
          />
        </Grid>

        {/* <Grid item xs={12}>
          <CustomSelectDropDown<CategoryEnum>
            label="Danh mục"
            value={form.categoryEnum!}
            onChange={(val) => handleChange('categoryEnum', val)}
            disabled={disabled}
            options={Object.values(CategoryEnum).map((value) => ({
              value: value as CategoryEnum,
              label: String(value),
            }))}
          />
        </Grid> */}

        <Grid item xs={12}>
          <CustomButton label="Tạo mới" onClick={() => onSubmit(form)} loading={loading} disabled={disabled} />
        </Grid>
      </Grid>
    </Box>
  );
}
