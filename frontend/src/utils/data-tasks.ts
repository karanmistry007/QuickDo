export type Status = 'Open' | 'Completed' | 'Cancelled'
export type Priority = 'low' | 'medium' | 'high'
export type Task = {
    title: string,
    id: string,
    status: Status,
    priority: Priority,
    points?: number
}

export const statuses: Status[] = ['Open', 'Completed', 'Cancelled']
export const priorities: Priority[] = ['low', 'medium', 'high']