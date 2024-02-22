import React, { Fragment } from 'react';
import { FilterBar, ItemWindow } from '@/components/item/UserItemPageComponent';

export default function page() {
  return (
    <Fragment>
        <FilterBar />
        <ItemWindow />
    </Fragment>
  )
}
