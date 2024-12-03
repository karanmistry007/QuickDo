import { useFrappeAuth } from "frappe-react-sdk";
import { Navigate } from "react-router-dom";

const Logout = () => {

    //? AUTH HOOK
    const { logout } = useFrappeAuth();

    return logout(), <Navigate to="/auth/login" replace /> ;
}

export default Logout