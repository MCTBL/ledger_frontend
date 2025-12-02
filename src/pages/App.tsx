import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import LoginPage from "./LoginPage";
import RequireAuth from "../routes/RequireAuth";
import HomePage from "./HomePage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";

const App: React.FC = () => {
    return (
        <Routes>
            {/* 默认进入登录页 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            {/* 受保护的主框架及其子页面 */}
            <Route
                path="/app"
                element={
                    <RequireAuth>
                        <MainLayout />
                    </RequireAuth>
                }
            >
                <Route index element={<HomePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>
            {/* 兜底 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default App;
