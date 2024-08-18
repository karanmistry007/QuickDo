import { useFrappeGetCall } from "frappe-react-sdk";

export const MyDocumentGetCall = () => {
    const { data, error, isLoading, isValidating, mutate } = useFrappeGetCall(
        /** method **/
        'frappe.client.get_value',
        /** params **/
        {
            doctype: 'User',
            fieldname: 'interest',
            filters: {
                name: 'Administrator',
            },
        }
        /** SWR Key - Optional **/
        /** SWR Configuration Options - Optional **/
    );

    if (isLoading) {
        return <>Loading</>;
    }
    if (error) {
        return <>{JSON.stringify(error)}</>;
    }
    if (data) {
        return <p>{data.message}</p>;
    }
    return null;
};