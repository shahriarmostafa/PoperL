import axios from "axios";

const axiosSecure = axios.create({
    baseURL: "https://backend-yege.onrender.com"})
    // baseURL: "http://localhost:5000"})


const useAxiosSecure = () => {
    return axiosSecure;
}

export default useAxiosSecure;