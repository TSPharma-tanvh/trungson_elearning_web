import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { ComingSoonPage } from '@/presentation/components/shared/empty/comming-soon';

export const metadata = { title: `Settings | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    // <Stack spacing={3}>
    //   <div>
    //     <Typography variant="h4">Settings</Typography>
    //   </div>
    //   <Notifications />
    //   {/* <UpdatePasswordForm /> */}
    // </Stack>
    <ComingSoonPage />
  );
}
