import {Link} from 'react-router-dom';
import '../admin.css';
export default function Teachers(){
    return (
        <div className="analytics">
                        <div className="redi-buttons mb-4 d-flex">
                                <Link to="/maintainance/applicants">
                                    <button className="show-all">View All Applicants</button>
                                </Link>
                        </div>
                        <div className="table admin-table">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Level</th>
                                        <th>Created At</th>
                                        <th>Photo</th>
                                        <th>Disable</th>
                                    </tr>
                                    <tr>
                                        <td>0439350</td>
                                        <td>Karim Hasan</td>
                                        <td>2</td>
                                        <td>01/07/2020</td>
                                        <td>Photo</td>
                                        <td>
                                            <div className="redi-buttons">
                                                <button className='bg-danger'>D</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>0439350</td>
                                        <td>Karim Hasan</td>
                                        <td>2</td>
                                        <td>01/07/2020</td>
                                        <td>Photo</td>
                                        <td>
                                            <div className="redi-buttons">
                                                <button className='bg-danger'>D</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>0439350</td>
                                        <td>Karim Hasan</td>
                                        <td>2</td>
                                        <td>01/07/2020</td>
                                        <td>Photo</td>
                                        <td>
                                            <div className="redi-buttons">
                                                <button className='bg-danger'>D</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
    )
}