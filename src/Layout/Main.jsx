import { Outlet, useLocation } from "react-router-dom";
import Nav from "../interfaces/Private/Shared/Nav/Nav";
export default function Main() {

    const location = useLocation();


    return (

        <>
        {
            !location.pathname.startsWith("/user/chat/") && location.pathname.startsWith("/user") && <Nav></Nav>
        }
            <Outlet></Outlet>
        </>
    )
}