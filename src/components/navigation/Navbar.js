

import React, { Fragment } from 'react'
import TopBar from './TopBar';
import LeftBar from './LeftBar';

export default function Navbar({ children }) {
    return (
        <Fragment>
            <TopBar />
            <LeftBar />
            <div className='pt-12 pl-0 sm:pl-56 md:pl-64 w-full min-h-screen bg-white'>
                {children}
            </div>
        </Fragment>
    )
}
