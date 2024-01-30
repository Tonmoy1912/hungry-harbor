

import React, { Fragment } from 'react'
import TopBar from './TopBar';
import LeftBar from './LeftBar';

export default function Navbar({ children }) {
    return (
        <Fragment>
            <TopBar />
            <LeftBar />
            <div className='pt-14 pl-0 sm:pl-56 md:pl-72 w-full min-h-screen bg-blue-50'>
                {children}
            </div>
        </Fragment>
    )
}
