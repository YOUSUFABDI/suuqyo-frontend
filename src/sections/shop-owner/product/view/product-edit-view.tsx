'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../product-new-edit-form';
import { ProductResDT } from '../types/types';

// ----------------------------------------------------------------------

type Props = {
  product?: ProductResDT | null;
};

export function ProductEditView({ product }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.shopOwner.product.root}
        links={[
          { name: 'Shop owner', href: paths.shopOwner.root },
          { name: 'Product', href: paths.shopOwner.product.root },
          { name: product?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm currentProduct={product} />
    </DashboardContent>
  );
}
