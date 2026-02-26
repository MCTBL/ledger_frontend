import axios, {
    AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from "axios";
import { STATIC_FIELDS } from "../assets/StaticData";

const instance: AxiosInstance = axios.create({
    // baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// 请求拦截器
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STATIC_FIELDS.auth_token);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem(STATIC_FIELDS.auth_token);
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default instance;
