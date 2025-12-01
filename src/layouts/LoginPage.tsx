import LoginForm from "../components/LoginForm/LoginForm"; // 引入登录表单组件
import "./LoginPage.css"; // 引入页面样式

function LoginPage() {
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
}

export default LoginPage;