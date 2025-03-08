import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";


export default function useSalaryData () {
    
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: salaryData = [], refetch} = useQuery({
        queryKey: ["salaryData"],
        queryFn: async () => {
            const res = await axiosSecure.get("/salaryData");
            return res.data.data
        }
    })

    return [isLoading, salaryData, refetch]
}