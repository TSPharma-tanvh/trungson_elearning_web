'use client';

import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import { CustomButton } from '@/presentation/components/core/button/custom-button';

import 'leaflet/dist/leaflet.css';

import { Close, Fullscreen, FullscreenExit } from '@mui/icons-material';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { useTranslation } from 'react-i18next';

interface LatLng {
  lat: number;
  lng: number;
}

interface MapPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (data: { lat: number; lng: number; address: string }) => void;
  initialPosition?: LatLng | null;
}

const CAN_THO_CENTER: LatLngExpression = [10.0077, 105.8003];

function MapCenterController({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom() >= 15 ? map.getZoom() : 16, { animate: true });
  }, [center, map]);
  return null;
}

function SearchBox({ onSelect }: { onSelect: (data: { lat: number; lng: number; address: string }) => void }) {
  const { t } = useTranslation();

  const map = useMap();
  const [query, setQuery] = useState('');

  const search = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(`/api/geocoding/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data?.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon), address: display_name };
        map.setView([newPos.lat, newPos.lng], 16);
        onSelect(newPos);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1000,
        background: 'white',
        borderRadius: 1,
        boxShadow: 3,
        width: { xs: '85%', sm: 320 },
      }}
    >
      <TextField
        size="small"
        fullWidth
        placeholder={t('searchAddress')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && search()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={search} size="small">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

function LocationPicker({ onChange }: { onChange: (data: { lat: number; lng: number; address: string }) => void }) {
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/geocoding/reverse?lat=${lat}&lon=${lng}`);
      const data = await res.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  useMapEvents({
    async click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      const address = await reverseGeocode(lat, lng);
      onChange({ lat, lng, address });
    },
  });
  return null;
}

export function MapPickerDialog({ open, onClose, onSelect, initialPosition = null }: MapPickerDialogProps) {
  const { t } = useTranslation();

  const [fullScreen, setFullScreen] = useState(false);

  const [selected, setSelected] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(initialPosition ? { ...initialPosition, address: '' } : null);

  // Fix icon Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fixIcons = async () => {
      const L = await import('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    };
    fixIcons();
  }, []);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  const currentCenter: LatLngExpression = selected ? [selected.lat, selected.lng] : CAN_THO_CENTER;

  function MapResizeController({ trigger }: { trigger: boolean }) {
    const map = useMap();

    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }, [trigger, map]);

    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="subtitle1">{t('selectLocation')}</Typography>

        <Box>
          <IconButton
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
          >
            {fullScreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, position: 'relative' }}>
        <Box
          sx={{
            height: fullScreen ? '75vh' : { xs: 400, md: 550 },
            width: '100%',
          }}
        >
          <MapContainer bounds={[CAN_THO_CENTER, CAN_THO_CENTER]} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapCenterController center={currentCenter} />
            <MapResizeController trigger={fullScreen} />

            <SearchBox onSelect={setSelected} />
            <LocationPicker onChange={setSelected} />

            {selected && (
              <Marker position={[selected.lat, selected.lng]}>
                <Popup>
                  <Typography variant="body2" fontWeight="bold">
                    {t(' ')}
                  </Typography>
                  <Typography variant="caption">{selected.address}</Typography>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>

        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="body2" color="text.secondary">
            {t('address')}: <strong>{selected?.address}</strong>
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <CustomButton variant="outlined" label={t('cancel')} onClick={onClose} />
          <CustomButton label={t('confirmAddress')} disabled={!selected} onClick={handleConfirm} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
