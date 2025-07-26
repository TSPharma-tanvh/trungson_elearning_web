import { type Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Questions | Dashboard | ${config.site.name}`,
};
