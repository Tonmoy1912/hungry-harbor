import React, { Fragment } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import LogIn from './LogIn'
import { redirect } from 'next/navigation'
import { StopProgress } from '@/components/util/util'

export default async function page() {
  const session=await getServerSession(authOptions);
  // console.log("Session from signup",session);
  if(session){
    redirect("/");
  }
  return (
    <Fragment>
      <StopProgress />
        <LogIn/>
    </Fragment>
  )
}
