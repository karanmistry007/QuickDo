import axios from 'axios';

// ? DEFINE BASE URL AND AUTH TOKEN FROM ENVIRONMENT VARIABLES OR FALLBACKS
const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;

// ? GENERATE THE HEADERS FOR AUTHORIZATION ONCE
const getHeaders = () => ({
    Authorization: AUTH_TOKEN, // ? ADD AUTHORIZATION HEADER,
    "X-Frappe-CSRF-Token": window.csrf_token,  // ?ADD CSRF TOKEN FROM WINDOW OBJECT
});

// ? FETCH ALL QUICKDOS WITH OPTIONAL FILTERS AND SORTING
export const fetchQuickDos = async (
    filters: any = {},
    sortColumn: string | null = null,
    sortDirection: string | null = null
) => {
    try {
        // ? CREATE FILTERS AND SORTING PARAMETERS ONLY IF NECESSARY
        const filterParams = filters && Object.keys(filters).length > 0
            ? `&filters=${JSON.stringify(filters)}`
            : '';
        const sortParams = sortColumn && sortDirection
            ? `&order_by=${sortColumn} ${sortDirection}`
            : '';

        // ? CALL THE API WITH FILTERS AND SORTING
        const response = await axios.get(
            `${BASE_URL}/api/method/quickdo.api.get_quickdo_with_categories?doctype=QuickDo&fields=["*"]${filterParams}${sortParams}`,
            {
                headers: getHeaders(),
            }
        );

        return response.data.message; // ? RETURN THE API RESPONSE DATA
    } catch (error) {
        console.error("Error fetching QuickDos:", error);
        throw error; // Re-throw the error for further handling
    }
};

// ? ADD A NEW QUICKDO
export const addQuickDo = async (data: any) => {
    try {
        const finalData = { ...data, doctype: "QuickDo" }; // ? SPECIFY DOCTYPE AS "QuickDo"
        const response = await axios.post(
            `${BASE_URL}/api/method/frappe.desk.form.save.savedocs`,
            {
                doc: JSON.stringify(finalData), // ? SERIALIZE DATA AS STRING
                action: "Save", // ? SET ACTION AS "SAVE"
            },
            {
                headers: getHeaders(),
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error adding QuickDo:", error);
        throw error;
    }
};

// ? UPDATE AN EXISTING QUICKDO
export const updateQuickDo = async (data: any) => {
    if (!data.name) {
        // ? VALIDATE THAT "NAME" IS PROVIDED
        throw new Error("Cannot update QuickDo without a valid 'name' identifier.");
    }

    try {
        const finalData = { ...data, doctype: "QuickDo" }; // ? SPECIFY DOCTYPE AS "QuickDo"
        const response = await axios.post(
            `${BASE_URL}/api/method/frappe.desk.form.save.savedocs`,
            {
                doc: JSON.stringify(finalData), // ? SERIALIZE DATA AS STRING
                action: "Save", // ? SET ACTION AS "SAVE"
            },
            {
                headers: getHeaders(),
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating QuickDo:", error);
        throw error;
    }
};

// ? DELETE AN EXISTING QUICKDO
export const deleteQuickDo = async (name: string) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/method/frappe.client.delete`,
            {
                doctype: "QuickDo", // ? SPECIFY DOCTYPE AS "QuickDo"
                name, // ? PROVIDE NAME OF THE QUICKDO TO DELETE
            },
            {
                headers: getHeaders(),
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error deleting QuickDo:", error);
        throw error;
    }
};
