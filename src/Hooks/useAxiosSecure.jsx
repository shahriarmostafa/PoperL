import axios from "axios";

const axiosSecure = axios.create({
    // baseURL: "https://backend-yege.onrender.com"})
    baseURL: "https://backend-yege.onrender.com"})

const useAxiosSecure = () => {
    return axiosSecure;
}

export default useAxiosSecure;