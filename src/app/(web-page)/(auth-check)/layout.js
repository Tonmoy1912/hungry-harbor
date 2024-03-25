import React, { Fragment } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { StopProgress } from '@/components/util/util';

export const dynamic = 'force-dynamic' ;

export default async function layout({children}) {
    const session=await getServerSession(authOptions);
    if(!session){
        return (
            <Fragment>
                <StopProgress/>
                <div className='w-full h-screen flex flex-col justify-center items-center bg-black'>
                    <p className='text-white '>You are not Logged in. Please login first...</p>
                </div>
            </Fragment>
        )
        // return redirect("/login");
    }
  return (
    <Fragment>
        {children}
    </Fragment>
  )
}
