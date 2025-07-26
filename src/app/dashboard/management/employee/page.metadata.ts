import { type Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Category | Dashboard | ${config.site.name}`,
};
