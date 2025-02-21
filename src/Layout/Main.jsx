import { Outlet, useLocation } from "react-router-dom";
import Nav from "../interfaces/Private/Shared/Nav/Nav";
export default function Main() {

    const location = useLocation();


    return (

        <>
        {
            !location.pathname.startsWith("/user/chat/") && <Nav></Nav>
        }
            <Outlet></Outlet>
        </>
    )
}