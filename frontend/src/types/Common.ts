import { IconType } from "react-icons";

// ! COMMON
export type Status = 'Open' | 'Completed' | 'Cancelled';
// export type Priority = 'Low' | 'Medium' | 'High';


//? ALL CATEGORIES
export interface useAllCategories {
    category: string;
}

//? ALL QUICKDO ITEMS
export interface useAllQuickDoData {

    //? REQUIRED FIELDS
    status: Status;
    categories: useAllCategories[] | [];
    date: string;
    description: string;
    is_important: boolean;
    send_reminder: boolean;

    //? MAY REQUIRE FIELDS
    creation?: string;
    owner?: string;
    modified?: string;
    modified_by?: string;
    name?: string;
    doctype?: string;
    color?: string | null;

    //? MAY NOT REQUIRED FIELDS
    title?: string;
    id?: string;
    idx?: number;
    points?: number;
    allocated_to?: string | null;
    assigned_by?: string | null;
    assigned_by_full_name?: string | null;
    assignment_rule?: string | null;
    docstatus?: number;
    image?: string | null;
    naming_series?: string | null;
    reference_name?: string | null;
    reference_type?: string | null;
    role?: string | null;
    sender?: string | null;
};

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
    allTodoData: useAllQuickDoData[];
    allCategories: useAllCategories[];
    handleSaveToDo: (data: useAllQuickDoData) => void;
    handleDeleteTodo: (data: string) => void;
};

//? CREATE TODO PROPS
export type CreateTodoProps = {
    allCategories: useAllCategories[];
    handleNewToDo: (data: useAllQuickDoData) => void;
};

//? DROPDOWN MULTI SELECT PROPS
export type DropdownMultiSelectProps = {
    position?: string;
    showCategories: boolean;
    allCategories: useAllCategories[];
    categories: useAllCategories[];
    handleCategories: (data: useAllCategories[]) => void;
};

//? LIST ITEM PROPS
export type ListItemProps = {
    todoData: useAllQuickDoData;
    allCategories: useAllCategories[];
    handleSaveToDo: (data: useAllQuickDoData) => void;
    handleDeleteTodo: (data: string) => void;
};

//? DRAWER PROPS
export type DrawerProps = {
    todoData: useAllQuickDoData;
    allCategories: useAllCategories[];
    handleSaveToDo: (data: useAllQuickDoData) => void;
    handleDeleteTodo: (data: string) => void;
    autoOpenDrawer?: boolean;
};

//? CONFIRM BOX PROPS
export type ConfirmBoxProps = {
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


// ? FILTERS
export interface useStatusFiltersItems {
    name: Status;
}