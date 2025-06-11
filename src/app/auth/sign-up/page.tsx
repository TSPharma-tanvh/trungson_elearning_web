import * as React from 'react';
import type { Metadata } from 'next';
import { GuestGuard } from '@/presentation/components/auth/guest-guard';
import { Layout } from '@/presentation/components/auth/layout';
import { SignUpForm } from '@/presentation/components/auth/sign-up-form';

import { config } from '@/config';

export const metadata = { title: `Sign up | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <SignUpForm />
      </GuestGuard>
    </Layout>
  );
}
