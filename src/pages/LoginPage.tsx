import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/LoginPage.css"; // 引入页面样式

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(ev.currentTarget);
        const username = String(formData.get("username") || "");
        const password = String(formData.get("password") || "");

        // 模拟登录
        setTimeout(() => {
            setLoading(false);
            if (username === "admin" && password === "password") {
                localStorage.setItem("auth_token", "demo-token");
                // 登录前想去的页面（如果有），否则跳首页
                const redirectTo = location.state?.from?.pathname || "/app";
                navigate(redirectTo, { replace: true });
            } else {
                setError("用户名或密码错误");
            }
        }, 600);
    };
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
