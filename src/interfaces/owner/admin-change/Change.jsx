import Sidebar from '../shared/Sidebar/Bar';
import Nav from '../shared/navbar/Nav';
import List from './admin-list/List';
import {Link} from 'react-router-dom';
import '../admin.css';
export default function Admins(){
    return (
        <section className="admin owner">
            <div className="display d-flex">
                <Sidebar></Sidebar>
                <div className="view">
                    <Nav></Nav>
                    <div className="analytics">
                        <div className="redi-buttons mb-4 d-flex">
                                <Link to="/add-admin">
                                    <button className="show-all">Add New Admin</button>
                                </Link>
                        </div>
                        <div className="table admin-table">
                            <List></List>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}