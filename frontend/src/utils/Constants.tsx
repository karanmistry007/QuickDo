import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";



const GetLoginUser = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}api/method/frappe.auth.get_logged_user`,
            {
                headers: {
                    Authorization: `token ${API_KEY}:${API_SECRET}`,
                },
            }
        );

        //? IF THE API RETURNS DATA MAP THE DATA IN DESIRED FORMAT
        if (response.data) {
            console.log(response.data);
        }
    } catch (error) {
        console.log(error);
    }
}


GetLoginUser();


//? API KEY AND SECRET FOR LOCAL
export const API_KEY = "4e3347660fe1693";
export const API_SECRET = "10f83bc39d86ba6";

//? BASE URL 
// export const BASE_URL = window.location.origin;
