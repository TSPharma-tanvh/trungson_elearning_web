import { type Metadata } from 'next';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `User Course Progress | Dashboard | ${config.site.name}`,
};
