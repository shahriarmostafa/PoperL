import List from './admin-list/List';
import {Link} from 'react-router-dom';
import '../admin.css';
export default function Admins(){
    return (
        <div className="analytics">
            <div className="redi-buttons mb-4 d-flex">
                <Link to="/maintainance/add-admin">
                    <button className="show-all">Add New Admin</button>
                </Link>
            </div>
            <div className="table admin-table">
                <List></List>
            </div>
        </div>
    )
}