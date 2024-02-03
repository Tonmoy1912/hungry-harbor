
import React, { Fragment } from 'react';
import TopBar from './TopBar';
import ControlPanelLeftBar from './ControlPanelLeftBar';

export default function ControlPanelNavbar({ children }) {
    return (
        <Fragment>
            <TopBar />
            <ControlPanelLeftBar/>
            <div className='pt-14 pl-0 sm:pl-56 md:pl-72 w-full min-h-screen bg-blue-50'>
                {children}
            </div>
        </Fragment>
    )
}