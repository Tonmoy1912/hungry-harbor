export const dynamic = 'force-dynamic';

import { Fragment } from "react"


export default function AuthLayout({ children }) {
  return (
    <Fragment>
      {/* <h1>Layout of Auth page</h1> */}
      {children}
    </Fragment>
  );
}
