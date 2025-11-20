import React, { useState } from "react";
import "./LoginForm.css"; // 引入样式文件

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(ev.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    // 模拟登录逻辑
    setTimeout(() => {
      setLoading(false);
      if (username === "admin" && password === "password") {
        alert("登录成功！");
      } else {
        setError("用户名或密码错误");
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>登录</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" disabled={loading} id="login-button">
          {loading ? "登录中..." : "登录"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;