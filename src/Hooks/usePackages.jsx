import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";


export default function usePackages () {
    
    const axiosSecure = useAxiosSecure();

    const {isLoading, data: packageData = [], refetch} = useQuery({
        queryKey: ["packageData"],
        queryFn: async () => {
            const res = await axiosSecure.get("/pack");
            return res.data.data
        }
    })

    return [isLoading, packageData, refetch]
}