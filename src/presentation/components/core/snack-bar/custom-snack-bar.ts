// src/layouts/core/custom-snack-bar.ts
/**
 * A singleton-like module to allow calling showSnackbar from anywhere.
 * Internally, it will use a callback set by the provider.
 */
type SnackbarType = 'success' | 'error' | 'warning' | 'info';

let enqueueSnackbarFn: ((message: string, type?: SnackbarType, durationMs?: number) => void) | null = null;

/**
 * Called by the provider to register the enqueue function.
 */
export function registerEnqueueSnackbar(fn: (message: string, type?: SnackbarType, durationMs?: number) => void) {
  enqueueSnackbarFn = fn;
}

/**
 * Show a snackbar. If provider not mounted yet, logs a warning.
 */
const CustomSnackBar = {
  showSnackbar: (message: string, type: SnackbarType = 'info', durationMs: number = 3000) => {
    if (enqueueSnackbarFn) {
      enqueueSnackbarFn(message, type, durationMs);
    } else {
      console.warn('Snackbar provider not initialized yet:', message);
    }
  },
};

export default CustomSnackBar;
