import {
    BarChartOutlined,
    FileTextOutlined,
    HomeOutlined,
    LogoutOutlined,
    PieChartOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { STATIC_FIELDS } from "../assets/StaticData";
import { useAuth } from "../hooks/useAuth";

const { Header, Content, Sider } = Layout;

export default function MainLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(
        window.outerWidth < 768 ? true : false,
    );

    const { user } = useAuth();

    // 根据路由高亮菜单
    const selectedKey = location.pathname.split("/").slice(-1)[0];

    const handleLogout = () => {
        localStorage.removeItem(STATIC_FIELDS.auth_token);
        navigate("/login", { replace: true });
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{ display: "flex", alignItems: "center", color: "#fff" }}
            >
                <div style={{ fontWeight: 600 }}>Ledger App</div>
                <div style={{ marginLeft: "auto" }}>
                    {user && user.userName ? user.userName : "未登录"}
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ color: "#fff" }}
                    >
                        退出
                    </Button>
                </div>
            </Header>

            <Layout>
                <Sider
                    width={220}
                    style={{
                        background: colorBgContainer,
                        display: "flex",
                        flexDirection: "column",
                    }}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        style={{ height: "100%", borderInlineEnd: 0 }}
                        items={[
                            {
                                key: "app",
                                icon: <HomeOutlined />,
                                label: <Link to="/app">首页</Link>,
                            },
                            {
                                key: "reports",
                                icon: <FileTextOutlined />,
                                label: "可视化",
                                children: [
                                    {
                                        key: "pie",
                                        icon: <PieChartOutlined />,
                                        label: (
                                            <Link to="/app/reports/pie">
                                                支出饼图
                                            </Link>
                                        ),
                                    },
                                    {
                                        key: "bar",
                                        icon: <BarChartOutlined />,
                                        label: (
                                            <Link to="/app/reports/bar">
                                                支出柱状图
                                            </Link>
                                        ),
                                    },
                                ],
                            },
                            {
                                key: "settings",
                                icon: <SettingOutlined />,
                                label: <Link to="/app/settings">设置</Link>,
                            },
                        ]}
                    />
                </Sider>

                <Layout style={{ padding: 24 }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
