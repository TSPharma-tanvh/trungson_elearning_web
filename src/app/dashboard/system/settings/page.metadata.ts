import { type Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Settings | Dashboard | ${config.site.name}`,
};
