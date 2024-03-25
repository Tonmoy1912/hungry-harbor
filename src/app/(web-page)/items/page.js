import React, { Fragment } from 'react';
import { FilterBar, ItemWindow } from '@/components/item/UserItemPageComponent';
import { StopProgress } from '@/components/util/util';

export default function page() {
  return (
    <div>
      <StopProgress/>
        <FilterBar />
        <ItemWindow />
    </div>
  )
}
