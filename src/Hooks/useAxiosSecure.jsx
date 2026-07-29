import axios from "axios";
import auth from "../firebase/firebase.init";

const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-yege.onrender.com";

const axiosSecure = axios.create({ baseURL: BASE_URL });

/**
 * Attaches the owner/admin's Firebase ID token to every request. The backend
 * checks it against the `owner` collection before allowing /api/admin/* calls,
 * which used to be reachable by anyone.
 */
axiosSecure.interceptors.request.use(async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        try {
            const token = await currentUser.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error("Could not attach auth token:", error);
        }
    }
    return config;
});

const useAxiosSecure = () => {
    return axiosSecure;
};

export { axiosSecure, BASE_URL };
export default useAxiosSecure;
