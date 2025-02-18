import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useTeacherList(){
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: teachers = [], refetch} = useQuery({
        queryKey: ["teacherList"],
        queryFn: async() => {
            const res = await axiosSecure.get("/teacherList")
            return res.data.teachers
        }
    });

    const teacherList = teachers.sort((a, b) => {
        return b.isOnline - a.isOnline
    })
    
    
    return [isLoading, teacherList, refetch]
}