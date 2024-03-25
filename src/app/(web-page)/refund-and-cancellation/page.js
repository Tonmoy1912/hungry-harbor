import { StopProgress } from '@/components/util/util'
import React from 'react'

export default function page() {
  return (
    <div className='h-screen w-full bg-black flex justify-center items-center'>
      <StopProgress/>
      <p className='text-white'>
        Refund and cancellation
      </p>
    </div>
  )
}
