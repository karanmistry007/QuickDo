export type Status = 'Open' | 'Completed' | 'Cancelled';
// export type Priority = 'low' | 'medium' | 'high';
export type Task = {
    title: string;
    id: string;
    status: Status;
    // priority: Priority;
    points?: number;
    doctype?: string;
    name?: string;
    allocated_to?: string | null;
    assigned_by?: string | null;
    assigned_by_full_name?: string | null;
    assignment_rule?: string | null;
    categories?: Array<{ [key: string]: any }> | null;
    color?: string | null;
    creation?: string;
    date?: string;
    description?: string;
    docstatus?: number;
    idx?: number;
    image?: string | null;
    is_important?: number;
    modified?: string;
    modified_by?: string;
    naming_series?: string | null;
    owner?: string;
    reference_name?: string | null;
    reference_type?: string | null;
    role?: string | null;
    send_reminder?: number;
    sender?: string | null;
};


export const statuses: Status[] = ['Open', 'Completed', 'Cancelled'];
export const priorities: Priority[] = ['low', 'medium', 'high'];