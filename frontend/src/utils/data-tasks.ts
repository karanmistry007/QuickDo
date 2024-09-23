export type Status = 'Open' | 'Closed' | 'Cancelled'
export type Priority = 'low' | 'medium' | 'high'
export type Task = {
    title: string,
    id: string,
    status: Status,
    priority: Priority,
    points?: number
}

export const statuses: Status[] = ['Open', 'Closed', 'Cancelled']
export const priorities: Priority[] = ['low', 'medium', 'high']