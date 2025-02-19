import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const studentUser = localStorage.getItem("studentUser");
    const facultyUser = localStorage.getItem("facultyUser");

    if (!studentUser && !facultyUser) {
        console.log("No user found! Redirecting to login.");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
