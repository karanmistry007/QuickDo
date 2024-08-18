import { IconType } from "react-icons";

// ! COMMON

//? SELECTED CATEGORIES 
export interface useGetAllCategories {
    category: string;
};

//? TODO ITEMS
export interface useAllTodoData {
    owner?: string,
    creation?: string,
    modified?: string,
    modified_by?: string,
    name?: string,
    completeTodo: boolean,
    importantTodo: boolean,
    isSendReminder: boolean,
    descriptionTodo: string,
    selectDueDate: string,
    selectedCategories: useGetAllCategories[],
}

//? API TODO LIST ITEMS
export interface useAPITodoListData {
    owner?: string,
    creation?: string,
    modified?: string,
    modified_by?: string,
    name?: string,
    status: string,
    is_important: boolean,
    send_reminder: boolean,
    description: string,
    date: string,
    categories: useGetAllCategories[],
}

//? API TODO CREATE DATA 
export interface useAPISaveTodoData {
    owner?: string,
    creation?: string,
    modified?: string,
    modified_by?: string,
    name?: string,
    doctype: string,
    status: string,
    is_important: boolean,
    send_reminder: boolean,
    description: string,
    date: string,
    categories: useGetAllCategories[],
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
    name: string,
    link: string,
    icon: IconType
}

// ! END COMMON


// ! PROPS

//? PRIVATE ROUTES PROPS
export type PrivateRoutesProps ={
    element:JSX.Element
}

//? DASHBOARD PROPS 
export type DashboardProps = {
    name: string,
    link: string,
}

//? LIST VIEW PROPS
export type ListViewProps = {
    allTodoData: useAllTodoData[],
    allCategories: useGetAllCategories[],
    handleSaveToDo: (data: useAllTodoData) => void,
    handleDeleteTodo: (data: string) => void,
}

//? CREATE TODO PROPS
export type CreateTodoProps = {
    allCategories: useGetAllCategories[],
    haldleNewToDo: (data: useAllTodoData) => void,
}

//? DROPDOWN MULTI SELECT PROPS
export type DropdownMultiSelectProps = {
    position?: string,
    showCategories: boolean,
    allCategories: useGetAllCategories[],
    selectedCategories: useGetAllCategories[],
    handleSelectedCategories: (data: useGetAllCategories[]) => void,
}

//? LIST ITEM PROPS
export type ListItemProps = {
    todoData: useAllTodoData,
    allCategories: useGetAllCategories[],
    handleSaveToDo: (data: useAllTodoData) => void,
    handleDeleteTodo: (data: string) => void
}

//? DRAWER PROPS
export type DrawerProps = {
    handleDrawerDisplay: (data: boolean) => void,
    todoData: useAllTodoData,
    allCategories: useGetAllCategories[],
    handleSaveToDo: (data: useAllTodoData) => void,
    handleDeleteTodo: (data: string) => void,
}

//? COMFIRM BOX PROPS
export type ComfirmBoxProps = {
    handleConfirmBoxDisplay: (data: boolean) => void
    handleSuccess: () => void,
    confirmMessage: string
}

// ! END PROPS