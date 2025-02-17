import {Link} from 'react-router-dom';
import '../admin.css';
import Teacher from './Teacher';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useApplicantList from '../../../Hooks/useApplicantList';
import { FaCheck, FaEdit } from 'react-icons/fa';
import axios from 'axios';



export default function ApplyList() {



    const [isLoading, disabledTeacherList, refetch] = useApplicantList();

    const axiosSecure = useAxiosSecure();

    const enableUser = (uid) => {
        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            confirmButtonText: "Add"
        }).then( async (res) => {
            if(res.isConfirmed){
                const result = await axiosSecure.put(`/enableTeacher/${uid}`);
                refetch();
            }
        }) 
    }

    const addSubject = (uid) => {
        Swal.fire({
            title: "Add Subjects",
            html: `
                <form id="subject-form">
                    <input type="checkbox" id="math" name="subject" value="Math">
                    <label for="math">Math</label><br>
                    
                    <input type="checkbox" id="physics" name="subject" value="Physics">
                    <label for="physics">Physics</label><br>
                    
                    <input type="checkbox" id="history" name="subject" value="History">
                    <label for="history">History</label><br>
                    
                    <input type="checkbox" id="english" name="subject" value="English">
                    <label for="english">English</label><br>
                    
                    <input type="checkbox" id="ict" name="subject" value="Computer Science">
                    <label for="ict">Computer Science</label><br>
        
                    <input type="checkbox" id="biology" name="subject" value="Biology">
                    <label for="biology">Biology</label><br>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: "Add",
            preConfirm: () => {
                const selectedSubjects = Array.from(
                    document.querySelectorAll("input[name='subject']:checked")
                ).map(input => input.value);
        
                return selectedSubjects;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result2 = await axiosSecure.put("/subjects", {subjects: result.value, uid})
                refetch();
            }
        });        
    }




    return (
        <div className="analytics">
            <div className="redi-buttons mb-4 d-flex">
                    <Link to="/maintainance/teachers">
                        <button className="show-all">View All Teacher</button>
                    </Link>
            </div>

        <form action="">


        </form>

            <div className="table admin-table">
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Id</th>
                            <th>Joined</th>
                            <th>Subjects</th>
                            <th>Photo</th>
                            <th>Enable</th>
                            <th>Edit Subject</th>
                        </tr>
                        {
                            disabledTeacherList.map((teacher) => {
                                return <Teacher key={teacher.uid} subjects={teacher.subjects} id={teacher.uid} name={teacher.displayName} joinedStampValue={teacher.joined} deleteFun={addSubject} disableFun={enableUser} icon={<FaCheck></FaCheck>} icon2={<FaEdit></FaEdit>}> </Teacher>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}