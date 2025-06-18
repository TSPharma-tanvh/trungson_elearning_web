import { Button, CircularProgress } from '@mui/material';

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: boolean;
}

export function CustomButton({
  label,
  onClick,
  loading = false,
  fullWidth = true,
  variant = 'contained',
  disabled = false,
}: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      fullWidth={fullWidth}
      disabled={loading || disabled}
      sx={{
        height: 48,
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
      }}
    >
      {loading ? <CircularProgress size={24} /> : label}
    </Button>
  );
}
