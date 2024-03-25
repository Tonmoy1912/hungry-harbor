import React,{Fragment} from 'react';
import { AdminOrder } from '@/components/order-components/AdminOrderComponents';
import { StopProgress } from '@/components/util/util';

export default function page() {
  return (
    <Fragment>
      <StopProgress/>
      <AdminOrder />
    </Fragment>
  )
}
