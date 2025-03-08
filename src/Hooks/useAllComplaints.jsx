import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";


export default function useAllComplains (id) {
    
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: allComplains = [], refetch} = useQuery({
        queryKey: ["complains"],
        queryFn: async () => {
            const res = await axiosSecure.get("/complain");
            return res.data.data
        }
    })

    return [isLoading, allComplains, refetch]
}