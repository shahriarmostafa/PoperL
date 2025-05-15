import axios from "axios";

const axiosSecure = axios.create({
    baseURL: "https://backend-a332.onrender.com"})
    // baseURL: "http://localhost:5000"})


const useAxiosSecure = () => {
    return axiosSecure;
}

export default useAxiosSecure;