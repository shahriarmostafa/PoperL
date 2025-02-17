import {Link} from 'react-router-dom';
import '../admin.css';
import Teacher from './Teacher';
import useTeacherList from '../../../Hooks/useTeacherList';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Teachers(){

    const [isLoading, teacherList, refetch] = useTeacherList();

    const axiosSecure = useAxiosSecure();

    const disableUser = (uid) => {
        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            showCancelButton: true,
            confirmButtonColor: "#BD2130",
            confirmButtonText: "Disable"
        }).then( async (res) => {
            if(res.isConfirmed){
                const result = await axiosSecure.put(`/disableTeacher/${uid}`);
                refetch();
            }
        }) 
    }

    const deleteUser = (uid) => {
        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            showCancelButton: true,
            confirmButtonColor: "#BD2130",
            confirmButtonText: "Delete"
        }).then( async (res) => {
            if(res.isConfirmed){
                const result = await axios.delete(`http://localhost:5000/deleteUser/${uid}`);
                refetch();
            }
        }) 
    }


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
                            <th>Name</th>
                            <th>Id</th>
                            <th>Level</th>
                            <th>JOINED</th>
                            <th>GROUP</th>
                            <th>Photo</th>
                            <th>Subjects</th>
                            <th>Disable</th>
                            <th>Delete</th>
                        </tr>
                        {
                            teacherList.map((teacher) => {
                                return <Teacher key={teacher.uid} id={teacher.uid} name={teacher.displayName} subjects={teacher.subjects} joinedStampValue={teacher.joined} level={teacher.experience} deleteFun={deleteUser} disableFun={disableUser}></Teacher>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}