import { Navigate, Outlet } from "react-router-dom";

function Protected() {
  return localStorage.getItem("token")
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

export default Protected;