export const getBaseUrl = (): string => {
  const production = process.env.NEXT_PUBLIC_PRODUCTION_BASE_URL;
  const dev = process.env.NEXT_PUBLIC_DEV_BASE_URL;
  const local = process.env.NEXT_PUBLIC_LOCAL_DEV_BASE_URL;
  const localProduction = process.env.NEXT_PUBLIC_LOCAL_PRODUCTION_BASE_URL;

  if (!production) {
    throw new Error('Missing NEXT_PUBLIC_PRODUCTION_BASE_URL environment variable.');
  }

  if (!dev) {
    throw new Error('Missing NEXT_PUBLIC_DEV_BASE_URL environment variable.');
  }

  if (!local) {
    throw new Error('Missing NEXT_PUBLIC_LOCAL_DEV_BASE_URL environment variable.');
  }

  if (!localProduction) {
    throw new Error('Missing NEXT_PUBLIC_LOCAL_PRODUCTION_BASE_URL environment variable.');
  }

  return localProduction.replace(/\/+$/, '');
};
