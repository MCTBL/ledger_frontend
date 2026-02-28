import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { STATIC_FIELDS } from "../assets/StaticData";

export default function RequireAuth({
    children,
}: {
    children: React.ReactElement;
}) {
    const authed = !!localStorage.getItem(STATIC_FIELDS.auth_token);
    const location = useLocation();
    return authed ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
}
