import { Fragment } from "react";
import ControlPanelNavbar from "@/components/navigation/ControlPanelNavBar";

export default function WebLayout({ children }) {
    return (
        <Fragment>
            <ControlPanelNavbar>
                {children}
            </ControlPanelNavbar>
        </Fragment>
    );
}