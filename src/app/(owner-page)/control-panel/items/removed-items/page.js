
import React,{Fragment} from 'react';
import {PrevButton} from '@/components/button/ButtonComponents';
import {RemovedItemsWindow} from '@/components/item/RemovedItemsWindow';

export default function page() {
    
  return (
    <div className='p-3'>
        <PrevButton/>
        <RemovedItemsWindow />
    </div>
  )
}
