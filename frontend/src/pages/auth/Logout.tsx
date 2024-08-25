import { useFrappeAuth } from "frappe-react-sdk";

const Logout = () => {

    //? AUTH HOOK
    const { logout } = useFrappeAuth();

    return logout(), window.location.href = "/login";
}

export default Logout