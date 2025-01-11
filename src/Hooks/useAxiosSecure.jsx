import axios from "axios";

const axiosSecure = axios.create({
    baseURL: "http://backend-eta-blue-92.vercel.app"
})

const useAxiosSecure = () => {
    return axiosSecure;
}

export default useAxiosSecure;