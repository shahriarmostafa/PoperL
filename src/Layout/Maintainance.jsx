import { Outlet } from "react-router-dom";
import Bar from "../interfaces/owner/shared/Sidebar/Bar"
import Nav from "../interfaces/owner/shared/navbar/Nav";
export default function Maintainance() {
    return (
        <section className="admin owner">
            <div className="display d-flex">
                <Bar></Bar>
                <div className="view">
                    <Nav></Nav>
                    <Outlet></Outlet>
                </div>
            </div>
        </section>
    )
}