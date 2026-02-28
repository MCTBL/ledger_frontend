import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import BarReports from "../components/BarReports";
import PieReports from "../components/PieReports";
import RequireAuth from "../routes/RequireAuth";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SettingsPage from "./SettingsPage";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="app"
                element={
                    <RequireAuth>
                        <MainLayout />
                    </RequireAuth>
                }
            >
                <Route index element={<HomePage />} />
                <Route path="reports">
                    <Route path="pie" element={<PieReports />} />
                    <Route path="bar" element={<BarReports />} />
                </Route>
                <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default App;
