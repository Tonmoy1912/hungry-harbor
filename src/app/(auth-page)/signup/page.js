//completely done

import React, { Fragment } from 'react'
import SignUp from './SignUp'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function page() {
  const session=await getServerSession(authOptions);
  // console.log("Session from signup",session);
  if(session){
    redirect("/");
  }
  return (
    <Fragment>
        <SignUp/>
    </Fragment>
  )
}
