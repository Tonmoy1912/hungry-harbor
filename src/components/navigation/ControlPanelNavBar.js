
import React, { Fragment } from 'react';
import TopBar from './TopBar';
import ControlPanelLeftBar from './ControlPanelLeftBar';
import { Footer } from './Navbar';

export default function ControlPanelNavbar({ children }) {
    return (
        <Fragment>
            <TopBar />
            <ControlPanelLeftBar/>
            <div className='pt-12 pl-0 sm:pl-56 md:pl-64 w-full min-h-screen bg-white'>
                {children}
            </div>
            <Footer />
        </Fragment>
    )
}