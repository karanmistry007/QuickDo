import { useFrappeAuth } from 'frappe-react-sdk';
import { PrivateRoutesProps } from '../types/Common';

const PrivateRoutes = (props: PrivateRoutesProps) => {

    //? AUTH HOOK
    const {
        currentUser,
        isValidating,
        isLoading,
    } = useFrappeAuth();

    console.log(currentUser)

    //? REDIRECT TO LOGIN PAGE IF NO LOGIN USER FOUND
    return !isLoading && !isValidating && (currentUser ? props.element : window.location.href = "/login");
}

export default PrivateRoutes