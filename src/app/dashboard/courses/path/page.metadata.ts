import { type Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Path | Dashboard | ${config.site.name}`,
};
