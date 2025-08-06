import React from 'react';
import { type Metadata } from 'next';

import { config } from '@/config';
import { ComingSoonPage } from '@/presentation/components/shared/empty/comming-soon';

export const metadata = { title: `Notification | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    // <div style={{ padding: 24 }}>
    //   <h1>Send Notification</h1>
    //   <NotificationForm />
    // </div>
    <ComingSoonPage />
  );
}
