import * as React from 'react';
import type { Metadata } from 'next';
import { GuestGuard } from '@/presentation/components/auth/guest-guard';
import { Layout } from '@/presentation/components/auth/layout';
import { SignInForm } from '@/presentation/components/auth/sign-in-form';

import { config } from '@/config';

export const metadata = { title: `Sign in | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <SignInForm />
      </GuestGuard>
    </Layout>
  );
}
