'use client';

import React, { useState } from 'react';
import { CreateAppSettingsRequest } from '@/domain/models/settings/request/create-app-setting-request';
import { TravelAllowanceRequest } from '@/domain/models/settings/request/travel-allowance-request';
import { AppSettingDataType } from '@/utils/enum/setting-enum';
import { AppSettingKeys } from '@/utils/string/setting-key-strings';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface CreateAppSettingDialogProps {
  disabled?: boolean;
  onSubmit: (data: CreateAppSettingsRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function CreateAppSettingDialog({
  disabled = false,
  onSubmit,
  loading = false,
  open,
  onClose,
}: CreateAppSettingDialogProps) {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);

  const [form, setForm] = useState<CreateAppSettingsRequest>(
    new CreateAppSettingsRequest({
      key: AppSettingKeys.TravelAllowance,
      value: '',
      description: '',
      category: 'class',
      dataType: 'Json',
      isDefault: false,
      scope: '',
      metadataJson: '',
    })
  );

  const [travelData, setTravelData] = useState<TravelAllowanceRequest>(new TravelAllowanceRequest());

  const handleChange = <K extends keyof CreateAppSettingsRequest>(key: K, value: CreateAppSettingsRequest[K]) => {
    setForm((prev) => new CreateAppSettingsRequest({ ...prev, [key]: value }));
  };

  const keyOptions = Object.entries(AppSettingKeys)
    .filter(([_, v]) => typeof v === 'string')
    .map(([_, v]) => {
      const fullKey = v as string;
      const label = fullKey.includes('.') ? fullKey.split('.').pop()?.toLowerCase() ?? '' : fullKey;
      return { value: fullKey, label };
    });

  // const categoryOptions = Object.keys(SelectableAppSettingCategoryEnum)
  //   .filter((k) => isNaN(Number(k)))
  //   .map((k) => ({ value: k.toLowerCase(), label: k }));

  // const dataTypeOptions = Object.keys(AppSettingDataType)
  //   .filter((k) => isNaN(Number(k)))
  //   .map((k) => ({ value: k, label: k }));

  const getDataTypeFromKey = (key: string): string => {
    switch (key) {
      case AppSettingKeys.TravelAllowance:
        return AppSettingDataType[AppSettingDataType.Json];
      default:
        return AppSettingDataType[AppSettingDataType.String];
    }
  };

  const handleSubmit = () => {
    let submitData = form;

    if (form.key === AppSettingKeys.TravelAllowance) {
      submitData = new CreateAppSettingsRequest({
        ...form,
        metadataJson: JSON.stringify(travelData.toJson()),
      });
    }

    onSubmit(submitData);
  };

  const shouldShowMetadataJson = (key: string): boolean => {
    switch (key) {
      case AppSettingKeys.TravelAllowance:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('createAppSetting')}</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
          >
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box component="form" noValidate autoComplete="off" p={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomSelectDropDown<string>
                label={t('key')}
                value={form.key}
                onChange={(val) => {
                  const newDataType = getDataTypeFromKey(val);

                  // lấy phần trước dấu chấm làm category
                  const categoryPart = val.includes('.') ? val.split('.')[0] : 'General';

                  setForm(
                    new CreateAppSettingsRequest({
                      ...form,
                      key: val,
                      dataType: newDataType,
                      category: categoryPart.toLowerCase(), // convert lowercase cho khớp enum FE
                    })
                  );
                }}
                options={keyOptions}
                disabled={disabled}
              />
            </Grid>

            {!shouldShowMetadataJson(form.key) && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label={t('value')}
                  value={form.value ?? ''}
                  onChange={(val) => {
                    handleChange('value', val);
                  }}
                  disabled={disabled}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomTextField
                label={t('description')}
                value={form.description ?? ''}
                onChange={(val) => {
                  handleChange('description', val);
                }}
                disabled={disabled}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomSelectDropDown<boolean>
                label={t('isDefault')}
                value={Boolean(form.isDefault)}
                onChange={(val) => {
                  handleChange('isDefault', val);
                }}
                options={[
                  { value: true, label: t('yes') },
                  { value: false, label: t('no') },
                ]}
                disabled={disabled}
              />
            </Grid>

            {/* TravelAllowance */}
            {form.key === AppSettingKeys.TravelAllowance && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('travelAllowance')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    label={t('distanceFromKm')}
                    value={travelData.distanceFromKm ?? ''}
                    onChange={(val) => {
                      setTravelData((p) => new TravelAllowanceRequest({ ...p, distanceFromKm: Number(val) }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    label={t('distanceToKm')}
                    value={travelData.distanceToKm ?? ''}
                    onChange={(val) => {
                      setTravelData((p) => new TravelAllowanceRequest({ ...p, distanceToKm: Number(val) }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    label={t('allowanceAmount')}
                    value={travelData.allowanceAmount ?? ''}
                    onChange={(val) => {
                      setTravelData((p) => new TravelAllowanceRequest({ ...p, allowanceAmount: Number(val) }));
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <CustomButton label={t('create')} onClick={handleSubmit} loading={loading} disabled={disabled} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
