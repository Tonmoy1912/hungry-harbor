import React,{Fragment} from 'react';
import { PrevButton } from '@/components/button/ButtonComponents';
import { CartWindow } from '@/components/item/CartComponent';

export default function page() {
  return (
    <div className='p-2'>
      <PrevButton />
      <h1 className='text-center text-2xl font-bold '>Cart Page</h1>
      <CartWindow />
    </div>
  )
}
