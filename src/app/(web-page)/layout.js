import { Fragment } from "react"
import Navbar from "@/components/navigation/Navbar";

export default function WebLayout({ children }) {
  return (
    <Fragment>
      <Navbar>
        {children}
      </Navbar>
    </Fragment>
  );
}
