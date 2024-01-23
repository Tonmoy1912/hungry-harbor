import { Fragment } from "react"
// import Navbar from "@/components/navigation/Navbar";

export default function WebLayout({ children }) {
  return (
    <Fragment>
      <h1>Layout of WEB page</h1>
      {/* <Navbar> */}
        {children}
      {/* </Navbar> */}
    </Fragment>
  );
}
