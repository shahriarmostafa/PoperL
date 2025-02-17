import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";


export default function useApplicantList () {
    
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: disabledTeacherList = [], refetch} = useQuery({
        queryKey: ["disabledTeacherList"],
        queryFn: async () => {
            const res = await axiosSecure.get("/disabledTeacherList");
            return res.data.teachers
        }
    })

    return [isLoading, disabledTeacherList, refetch]
}