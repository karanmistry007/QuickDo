import { useFrappeAuth } from 'frappe-react-sdk';
import { PrivateRoutesProps } from '../types/Common';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = (props: PrivateRoutesProps) => {

    //? AUTH HOOK
    const {
        currentUser,
        isValidating,
        isLoading,
    } = useFrappeAuth();

    //? REDIRECT TO LOGIN PAGE IF NO LOGIN USER FOUND
    return !isLoading && !isValidating && (currentUser ? props.element : <Navigate to="/auth/login" replace />);
}

export default PrivateRoutes