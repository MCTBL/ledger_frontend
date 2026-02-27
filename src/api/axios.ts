import axios, { type AxiosInstance } from "axios";
import { STATIC_FIELDS } from "../assets/StaticData";

const instance: AxiosInstance = axios.create({
    // baseURL: "http://localhost:8080/api",
    headers: {
        Authorization: `Bearer ${localStorage.getItem(STATIC_FIELDS.auth_token)}`,
        "Content-Type": "application/json",
    },
});

// 响应拦截器
// instance.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
//         if (error.response && error.response.status === 401) {
//             localStorage.removeItem(STATIC_FIELDS.auth_token);
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     },
// );

export default instance;
