import React, { Fragment } from 'react';
import { DashboardComponents } from '@/components/dashboard-components/DashboardComponents';
import { OpenCloseButton } from '@/components/shop-open-close-components/ShopOpenCloseComponents';
import { StopProgress } from '@/components/util/util';
export default function page() {
  return (
    <Fragment>
      <StopProgress/>
      <div className=' p-4 '>
      <OpenCloseButton />
      </div>
      <DashboardComponents />
    </Fragment>
  )
}
