'use client';

import { CONFIG } from 'src/global-config';
import { UseOneUser } from 'src/sections/admin/user/hooks';

import { UserEditView } from 'src/sections/admin/user/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;
  const { oneUser } = UseOneUser(id);

  return <UserEditView user={oneUser} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
