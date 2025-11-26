import {
	LaptopOutlined,
	NotificationOutlined,
	UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import React from "react";

const { Header, Content, Sider } = Layout;

const items2: MenuProps["items"] = [
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
].map((icon, index) => {
    const key = String(index + 1);

    return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `subnav ${key}`,
        children: Array.from({ length: 4 }).map((_, j) => {
            const subKey = index * 4 + j + 1;
            return {
                key: subKey,
                label: `option${subKey}`,
            };
        }),
    };
});

const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ height: "100%" }}>
            <Header style={{ display: "flex", alignItems: "center" }}>
                <div className="demo-logo" />
            </Header>
            <Layout>
                <Sider width={"10%"} style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        defaultOpenKeys={["sub1"]}
                        style={{ height: "100%", borderInlineEnd: 0 }}
                        items={items2}
                    />
                </Sider>
                <Layout style={{ padding: "24px 24px 24px 24px" }}>
                    {/* <Breadcrumb
                        items={[
                            { title: "Home" },
                            { title: "List" },
                            { title: "App" },
                        ]}
                        style={{ margin: "16px 0" }}
                    /> */}
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        Content
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
