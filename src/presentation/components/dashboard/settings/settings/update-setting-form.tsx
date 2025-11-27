'use client';

import React, { useEffect, useState } from 'react';
import { TravelAllowanceRequest } from '@/domain/models/settings/request/travel-allowance-request';
import { UpdateAppSettingsRequest } from '@/domain/models/settings/request/update-app-setting-request';
import { type GetAppSettingsResponse } from '@/domain/models/settings/response/get-app-settings-response';
import { AppSettingKeys } from '@/utils/string/setting-key-strings';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '@/presentation/components/core/button/custom-button';
import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface UpdateAppSettingDialogProps {
  open: boolean;
  setting: GetAppSettingsResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateAppSettingsRequest) => void;
  loading?: boolean;
}

export function UpdateAppSettingDialog({
  open,
  setting,
  onClose,
  onSubmit,
  loading = false,
}: UpdateAppSettingDialogProps) {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  const [form, setForm] = useState<UpdateAppSettingsRequest>(new UpdateAppSettingsRequest());
  const [travelData, setTravelData] = useState<TravelAllowanceRequest>(new TravelAllowanceRequest());

  useEffect(() => {
    if (setting && open) {
      const newForm = new UpdateAppSettingsRequest({
        ...setting,
        category: setting.category?.toLowerCase(),
        metadataJson: setting.metadataJson,
      });
      setForm(newForm);
      if (setting.key === AppSettingKeys.TravelAllowance && setting.metadataJson) {
        try {
          const parsed = JSON.parse(setting.metadataJson);
          setTravelData(TravelAllowanceRequest.fromJson(parsed));
        } catch {
          setTravelData(new TravelAllowanceRequest());
        }
      }
    }
  }, [setting, open]);

  const handleChange = <K extends keyof UpdateAppSettingsRequest>(key: K, value: UpdateAppSettingsRequest[K]) => {
    setForm((prev) => new UpdateAppSettingsRequest({ ...prev, [key]: value }));
  };

  const keyOptions = Object.entries(AppSettingKeys)
    .filter(([_, v]) => typeof v === 'string')
    .map(([_, v]) => {
      const keyValue = v as string;
      const label = keyValue.includes('.') ? keyValue.split('.').pop()?.toLowerCase() ?? '' : keyValue;
      return { value: keyValue, label };
    });

  // const categoryOptions = Object.keys(SelectableAppSettingCategoryEnum)
  //   .filter((k) => isNaN(Number(k)))
  //   .map((k) => ({ value: k.toLowerCase(), label: k }));

  // const dataTypeOptions = Object.keys(AppSettingDataType)
  //   .filter((k) => isNaN(Number(k)))
  //   .map((k) => ({ value: k, label: k }));

  const shouldShowMetadataJson = (key: string): boolean => key === AppSettingKeys.TravelAllowance;

  const handleSubmit = () => {
    const updatedForm = new UpdateAppSettingsRequest({
      ...form,
      metadataJson: shouldShowMetadataJson(form.key) ? JSON.stringify(travelData.toJson()) : form.metadataJson,
    });
    onSubmit(updatedForm);
  };

  if (!setting) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('updateAppSetting')}</Typography>
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
              <Typography variant="body2" sx={{ mb: 2 }}>
                {t('id')}: {form.id}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomSelectDropDown<string>
                label={t('key')}
                value={form.key}
                onChange={(val) => {
                  handleChange('key', val);
                }}
                options={keyOptions}
                disabled
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
              />
            </Grid>

            {shouldShowMetadataJson(form.key) && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('travelAllowance')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    label={t('distanceFromKm')}
                    value={travelData.distanceFromKm ?? 0}
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
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <CustomButton label={t('save')} onClick={handleSubmit} loading={loading} />
      </DialogActions>
    </Dialog>
  );
}
