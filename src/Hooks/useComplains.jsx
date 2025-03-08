import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";


export default function useComplains (id) {
    
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: complains = [], refetch} = useQuery({
        queryKey: ["complains"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/complain/${id}`);
            return res.data.data
        }
    })

    return [isLoading, complains, refetch]
}