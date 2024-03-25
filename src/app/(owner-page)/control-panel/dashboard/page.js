import React, { Fragment } from 'react';
import { DashboardComponents } from '@/components/dashboard-components/DashboardComponents';
import { OpenCloseButton } from '@/components/shop-open-close-components/ShopOpenCloseComponents';
export default function page() {
  return (
    <Fragment>
      <div className=' p-4 '>
      <OpenCloseButton />
      </div>
      <DashboardComponents />
    </Fragment>
  )
}
