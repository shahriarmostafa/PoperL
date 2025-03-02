import TeacherItem from "./TeacherItem"
import useTeacherList from "../../../Hooks/useTeacherList";
import { useEffect, useState } from "react";
export default function TeacherList(){

    const [selectedCategory, setSelectedCategory] = useState("school/college");
    const [selectedSubject, setSelectedSubject] = useState("Math");
    

    const [isLoading, teacherList, refetch] = useTeacherList(selectedCategory, selectedSubject);

    const SchoolCollegeSubjects = ["Physics", "Chemistry", "Math", "English", "ICT"];
    const UniSubjects = ["Java", "Math", "English", "C++", "Accounting"];



    
    return(
        <section className="education-page night-view">
            <div className="container">

                {/* Category Filter Tabs */}
                <div className="filter-tabs">
                    {["school/college", "university"].map(category => (
                        <button
                            key={category}
                            className={selectedCategory === category ? "active button-29" : "button-29"}
                            onClick={() => {
                                setSelectedCategory(category);
                            }}
                        >
                            {String(category).toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="filter-dropdown">
                    <h5 className="text-center">Select Your Subject</h5>
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                            {   selectedCategory == "school/college"?
                                SchoolCollegeSubjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))
                                :
                                UniSubjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))
                            }

                    </select>
                </div>

                <div className="teacher-wrapper">
                    {
                        isLoading? <b>Loading...</b>
                        : teacherList?
                        teacherList.map(item => {
                            return <TeacherItem receiver={item} key={item.id} img={item.photoURL} name={item.displayName} rating={item.rating} experience={item.experience} id={item.id} isOnline={item.isOnline}></TeacherItem>
                        }) : <b>No teacher found...</b>
                    }
                </div>
            </div>
        </section>
    )
}