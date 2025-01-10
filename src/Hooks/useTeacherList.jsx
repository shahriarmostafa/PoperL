import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useTeacherList(){
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: teacherList = []} = useQuery({
        queryKey: ["teacherList"],
        queryFn: async() => {
            const res = await axiosSecure.get("/teacherList")
            return res.data
        }
    })    
    return [isLoading, teacherList]
}