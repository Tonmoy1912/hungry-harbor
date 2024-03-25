
import React, { Fragment } from 'react';
import { PrevButton } from '@/components/button/ButtonComponents';
import { RemovedItemsWindow } from '@/components/item/RemovedItemsWindow';
import { StopProgress } from '@/components/util/util';

export default function page() {

  return (
    <div className='p-3'>
      <StopProgress />
      <PrevButton />
      <RemovedItemsWindow />
    </div>
  )
}
