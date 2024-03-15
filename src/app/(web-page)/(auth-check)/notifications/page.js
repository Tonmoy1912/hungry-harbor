import React from 'react';
import { NotificationsWindow } from '@/components/notification-page-components/NotificationPageComponents';

export default function page() {
  return (
    <div className='py-1 px-1 md:px-3'>
      <h1 className='text-2xl font-bold text-blue-950 p-2 text-center' >Notifications</h1>
      <NotificationsWindow />
    </div>
  )
}
