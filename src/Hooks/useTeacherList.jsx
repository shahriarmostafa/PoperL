import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useTeacherList(selectedCategory, selectedSubject){
    
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: teachers = [], refetch} = useQuery({
        queryKey: ["teacherList", selectedCategory, selectedSubject],
        queryFn: async() => {
            if(selectedCategory || selectedSubject){
                const res = await axiosSecure.get(`/teacherList?category=${selectedCategory}&subject=${selectedSubject}`)
                return res.data.teachers
            }
            else if(!selectedCategory || !selectedSubject){
                const res = await axiosSecure.get('/teacherList')
                return res.data.teachers
            }
        },
        // enabled: !!selectedCategory && !!selectedSubject, // ✅ Prevents unnecessary calls
    });

    const teacherList = teachers.sort((a, b) => {
        return b.isOnline - a.isOnline
    })
    
    
    return [isLoading, teacherList, refetch]
}