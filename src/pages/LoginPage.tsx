import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { STATIC_FIELDS } from "../assets/StaticData";
import "../css/LoginPage.css"; // 引入页面样式
import { useAuth } from "../hooks/useAuth";
import type { LoginRequest, LoginResponse, Result } from "../types/defines";

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(ev.currentTarget);
        const username = String(formData.get("username") || "");
        const password = String(formData.get("password") || "");

        const request: LoginRequest = { username, password };
        await axios
            .post<Result<LoginResponse>>("/api/login", request)
            .then((res) => res.data)
            .then((data: Result<LoginResponse>) => {
                if (data.code !== 200) {
                    throw new Error(data.message);
                }
                const id = data.data.userId;
                const userName = data.data.userName;
                const token = data.data.token;
                login({ id, userName, passwordHash: "", role: 0 }, token);
            })
            .catch((e: Error) => {
                setError(e.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const authed = !!localStorage.getItem(STATIC_FIELDS.auth_token);
        if (authed) {
            const redirectTo = location.state?.from?.pathname || "/app";
            navigate(redirectTo, { replace: true });
        }
    });

    return (
        <div className="login-page">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>登录</h2>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="username">用户名</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">密码</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} id="login-button">
                        {loading ? "登录中..." : "登录"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
