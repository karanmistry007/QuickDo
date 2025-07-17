import axios from 'axios';

// ? DEFINE BASE URL AND AUTH TOKEN FROM ENVIRONMENT VARIABLES OR FALLBACKS
const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;

// ? GENERATE THE HEADERS FOR AUTHORIZATION ONCE
const getHeaders = () => ({
    Authorization: AUTH_TOKEN, // ? ADD AUTHORIZATION HEADER
    "X-Frappe-CSRF-Token": window.csrf_token,  // ?ADD CSRF TOKEN FROM WINDOW OBJECT
});

// ? FETCH DASHBOARD DATA WITH OPTIONAL FILTERS
export const fetchDashboardData = async (
    method: string,
    filters: any = {},
) => {
    try {
        // ? CREATE FILTERS PARAMETERS ONLY IF NECESSARY
        const filterParams = filters && Object.keys(filters).length > 0
            ? `&${JSON.stringify(filters)}`
            : '';
        // ? CALL THE API WITH FILTERS
        const response = await axios.get(
            `${BASE_URL}/api/method/${method}${filterParams}`,
            {
                headers: getHeaders(),
            }
        );

        return response.data.message; // ? RETURN THE API RESPONSE DATA
    } catch (error) {
        console.error(`Error fetching fetchDashboardData:${method}`, error);
        throw error;
    }
};