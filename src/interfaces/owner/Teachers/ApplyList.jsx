import {Link} from 'react-router-dom';
import '../admin.css';
import Teacher from './Teacher';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useApplicantList from '../../../Hooks/useApplicantList';
import { FaCheck, FaEdit } from 'react-icons/fa';



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

    const addSubject = async (uid, category, type) => {
        let subjectOptions = [];
        try {
            const params = new URLSearchParams();
            if (category) params.append("category", category);
            if (type) params.append("type", type);
            const res = await axiosSecure.get(`/subjects?${params.toString()}`);
            if (res.data.success) subjectOptions = res.data.data;
        } catch (err) {
            console.error(err);
        }

        const checkboxesHtml = subjectOptions.length > 0
            ? subjectOptions.map(s =>
                `<div style="text-align:left;margin:6px 0;">
                    <input type="checkbox" id="subj_${s._id}" name="subject" value="${s.name}">
                    <label for="subj_${s._id}" style="margin-left:6px;font-weight:600;">${s.name}</label>
                </div>`
              ).join("")
            : `<p style="color:#9aafc0;font-size:13px;">No subjects found for this category/medium.<br>Add subjects in <b>Manage Subjects</b> first.</p>`;

        Swal.fire({
            title: "Assign Subjects",
            html: `<form id="subject-form">${checkboxesHtml}</form>`,
            showCancelButton: true,
            confirmButtonText: "Assign",
            preConfirm: () => {
                const selectedSubjects = Array.from(
                    document.querySelectorAll("input[name='subject']:checked")
                ).map(input => input.value);
                return selectedSubjects;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.put("/subjects", { subjects: result.value, uid });
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
                                return <Teacher key={teacher.uid} subjects={teacher.subjects} id={teacher.uid} name={teacher.displayName} joinedStampValue={teacher.joined} deleteFun={(id) => addSubject(id, teacher.category, teacher.type)} disableFun={enableUser} icon={<FaCheck></FaCheck>} icon2={<FaEdit></FaEdit>}> </Teacher>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}