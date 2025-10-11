'use client';

import { CONFIG } from 'src/global-config';

import { UseOneSize } from 'src/sections/admin/variant/size/hooks';
import { SizeEditView } from 'src/sections/admin/variant/size/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;
  const { oneSize } = UseOneSize(Number(id));

  return <SizeEditView size={oneSize || null} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
