import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const ProtectedRoute = ({ element, allowedRole }) => {
    const token = localStorage.getItem("token"); // auth check
    const { user } = useAuth(); // user comes from DB/API

    const role = user?.type; // "admin" or "vendor"

    if (!token) return <Navigate to="/login" replace />;

    // role mismatch
    if (allowedRole && allowedRole !== role) {
        // redirect to respective dashboard
        return <Navigate to={`/${role}/dashboard/overview`} replace />;
    }

    return element;
};

export default ProtectedRoute;
