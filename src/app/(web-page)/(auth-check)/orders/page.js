import React, { Fragment } from 'react';
import { UserOrder } from '@/components/order-components/UserOrderComponents';
import { StopProgress } from '@/components/util/util';

export default function page() {
  return (
    <Fragment>
      <StopProgress/>
      <UserOrder />
    </Fragment>
  )
}
