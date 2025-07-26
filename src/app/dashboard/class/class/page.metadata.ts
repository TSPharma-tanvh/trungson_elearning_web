import { type Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Attendance | Dashboard | ${config.site.name}`,
};
