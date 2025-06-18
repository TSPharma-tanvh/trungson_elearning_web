import { InputAdornment, TextField } from '@mui/material';

interface CustomTextFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  icon?: React.ReactNode;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  disabled,
  multiline = false,
  rows,
  type = 'text',
  icon,
}) => (
  <TextField
    label={label}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    disabled={disabled}
    multiline={multiline}
    rows={rows}
    type={type}
    InputLabelProps={{ shrink: true }}
    InputProps={{
      startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : undefined,
    }}
  />
);
