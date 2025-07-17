import axios from 'axios';

// ? DEFINE BASE URL AND AUTH TOKEN FROM ENVIRONMENT VARIABLES OR FALLBACKS
const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;

// ? GENERATE THE HEADERS FOR AUTHORIZATION ONCE
const getHeaders = () => ({
    Authorization: AUTH_TOKEN, // ? ADD AUTHORIZATION HEADER
    "X-Frappe-CSRF-Token": window.csrf_token,  // ?ADD CSRF TOKEN FROM WINDOW OBJECT
});

// ? SIGN UP
export const signUp = async (full_name: string, email: string, password: string,) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/method/quickdo.api.register_user`,
            {
                full_name: full_name,
                email: email,
                password: password,
            },
            {
                headers: getHeaders(),
            }
        );

        return response.data.message;
    } catch (error) {
        console.error("Error while sign up:", error);
        throw error;
    }
};
