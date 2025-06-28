import { Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Lesson | Dashboard | ${config.site.name}`,
};
