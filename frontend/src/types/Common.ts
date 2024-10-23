import { IconType } from "react-icons";

// ! COMMON
export type Status = 'Open' | 'Completed' | 'Cancelled';
// export type Priority = 'Low' | 'Medium' | 'High';


//? SELECTED CATEGORIES
export interface useGetAllCategories {
    category: string;
}

//? ACTUAL TODO ITEMS
export interface useActualAllTodoData {
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

//? TODO ITEMS
export interface useAllTodoData {
    owner?: string;
    creation?: string;
    modified?: string;
    modified_by?: string;
    name?: string;
    completeTodo: boolean;
    importantTodo: boolean;
    isSendReminder: boolean;
    descriptionTodo: string;
    selectDueDate: string;
    selectedCategories: useGetAllCategories[];
}

//? API TODO LIST ITEMS
export interface useAPITodoListData {
    owner?: string;
    creation?: string;
    modified?: string;
    modified_by?: string;
    name?: string;
    status: string;
    is_important: boolean;
    send_reminder: boolean;
    description: string;
    date: string;
    categories: useGetAllCategories[];
}

//? API TODO CREATE DATA
export interface useAPISaveTodoData {
    owner?: string;
    creation?: string;
    modified?: string;
    modified_by?: string;
    name?: string;
    doctype: string;
    status: string;
    is_important: boolean;
    send_reminder: boolean;
    description: string;
    date: string;
    categories: useGetAllCategories[];
}

//? SORT ITEMS
export interface useSortDataItems {
    name: string;
    sort: string;
}

//? USER PROFILE ITEMS
export interface UserProfileItem {
    name: string;
    link: string;
}

//? SIDEBAR ITEMS
export interface SidebarItem {
    name: string;
    link: string;
    icon: IconType;
    activeIcon: IconType;
}


//? CALENDAR VIEW
export interface CalendarEvents {
    title: string;
    start: Date;
    end: Date;
    color: string;
    is_important: boolean;
    sent_reminder: boolean;
}


// ! END COMMON

// ! PROPS

//? PRIVATE ROUTES PROPS
export type PrivateRoutesProps = {
    element: JSX.Element;
};

//? DASHBOARD PROPS
export type DashboardProps = {
    name: string;
    link: string;
};

//? LIST VIEW PROPS
export type ListViewProps = {
    allTodoData: useAllTodoData[];
    allCategories: useGetAllCategories[];
    handleSaveToDo: (data: useAllTodoData) => void;
    handleDeleteTodo: (data: string) => void;
};

//? CREATE TODO PROPS
export type CreateTodoProps = {
    allCategories: useGetAllCategories[];
    handleNewToDo: (data: useAllTodoData) => void;
};

//? DROPDOWN MULTI SELECT PROPS
export type DropdownMultiSelectProps = {
    position?: string;
    showCategories: boolean;
    allCategories: useGetAllCategories[];
    selectedCategories: useGetAllCategories[];
    handleSelectedCategories: (data: useGetAllCategories[]) => void;
};

//? LIST ITEM PROPS
export type ListItemProps = {
    todoData: useAllTodoData;
    allCategories: useGetAllCategories[];
    handleSaveToDo: (data: useAllTodoData) => void;
    handleDeleteTodo: (data: string) => void;
};

//? DRAWER PROPS
export type DrawerProps = {
    todoData: useAllTodoData;
    allCategories: useGetAllCategories[];
    handleSaveToDo: (data: useAllTodoData) => void;
    handleDeleteTodo: (data: string) => void;
    autoOpenDrawer?: boolean;
};

//? COMFIRM BOX PROPS
export type ComfirmBoxProps = {
    confirmTitle: string;
    confirmMessage: string;
    handleSuccess: () => void;
};

//? NUMBER CARD PROPS
export interface NumberCardProps {
    icon: IconType;
    number: number;
    title: string;
}

// ! END PROPS
