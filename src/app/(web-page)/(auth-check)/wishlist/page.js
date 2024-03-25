import React,{Fragment} from 'react';
import { PrevButton } from '@/components/button/ButtonComponents';
import { WishListWindow } from '@/components/item/WishListComponenets';
import { StopProgress } from '@/components/util/util';

export default function page() {
  return (
    <div className='p-2'>
      <StopProgress/>
      <PrevButton />
      <WishListWindow />
    </div>
  )
}
