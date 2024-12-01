import axios from 'axios';

// ? DEFINE BASE URL AND AUTH TOKEN FROM ENVIRONMENT VARIABLES OR FALLBACKS
const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;

// ? GENERATE THE HEADERS FOR AUTHORIZATION ONCE
const getHeaders = () => ({
    Authorization: AUTH_TOKEN, // ? ADD AUTHORIZATION HEADER
});

// ? CATEGORY SERVICE API FUNCTION
export const fetchCategoryList = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/method/frappe.client.get_list?doctype=QuickDo Category&fields=["category"]`,
            {
                headers: getHeaders(),
            }
        );

        // ? Return data if available
        return response.data.message || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("There was a problem while loading Categories!");
    }
};
