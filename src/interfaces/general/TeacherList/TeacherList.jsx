import TeacherItem from "./TeacherItem"
import Nav from '../../Private/Shared/Nav/Nav';
import useTeacherList from "../../../Hooks/useTeacherList";
export default function TeacherList(){

    const [isLoading, teacherList] = useTeacherList();
    
    return(
        <>
            <Nav></Nav>
            <section className="education-page night-view">
                <div className="container">
                    {
                        isLoading? <b>Loading...</b>
                        : teacherList?
                        teacherList.map(item => {
                            return <TeacherItem receiver={item} key={item.id} img={item.photoURL} name={item.displayName} rating={item.rating} experience={item.rating} id={item.id}></TeacherItem>
                        }) : <b>No teacher found...</b>
                    }
                </div>
            </section>
        </>
    )
}