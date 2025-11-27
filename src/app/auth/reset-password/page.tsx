import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/presentation/components/auth/guest-guard';
import { Layout } from '@/presentation/components/auth/layout';
import { ResetPasswordForm } from '@/presentation/components/auth/reset-password-form';

export const metadata = { title: `Reset password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <ResetPasswordForm />
      </GuestGuard>
    </Layout>
  );
}
