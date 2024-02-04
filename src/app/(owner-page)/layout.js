import React, { Fragment } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function layout({ children }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
        <Fragment>
            <div className='w-full h-screen flex flex-col justify-center items-center bg-black'>
                <p className='text-white '>You are not an admin.</p>
            </div>
        </Fragment>
    }
    return (
        <Fragment>
            {children}
        </Fragment>
    )
}