import { type Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Question Bank | Dashboard | ${config.site.name}`,
};
