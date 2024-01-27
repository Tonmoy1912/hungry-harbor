export const dynamic = 'force-dynamic';

import { Fragment } from "react"


export default function AuthLayout({ children }) {
  return (
    <Fragment>
      {children}
    </Fragment>
  );
}
