// src/app/notification/page.tsx
import React from 'react';
import { type Metadata } from 'next';
import NotificationForm from '@/presentation/components/shared/notification/NotificationForm';

import { config } from '@/config';

export const metadata = { title: `Notification | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <div style={{ padding: 24 }}>
      <h1>Send Notification</h1>
      <NotificationForm />
    </div>
  );
}
