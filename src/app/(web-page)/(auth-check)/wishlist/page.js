import React,{Fragment} from 'react';
import { PrevButton } from '@/components/button/ButtonComponents';
import { WishListWindow } from '@/components/item/WishListComponenets';

export default function page() {
  return (
    <div className='p-2'>
      <PrevButton />
      <WishListWindow />
    </div>
  )
}
