import { type Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Courses | Dashboard | ${config.site.name}`,
};
