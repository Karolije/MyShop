import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? <Navigate to="/" /> : <>{children}</>;
};

export default PublicRoute;
