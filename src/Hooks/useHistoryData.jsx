import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";


export default function useHistoryData () {
    
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: historyData = [], refetch} = useQuery({
        queryKey: ["historyData"],
        queryFn: async () => {
            const res = await axiosSecure.get("/historyData");
            return res.data.data
        }
    })

    return [isLoading, historyData, refetch]
}