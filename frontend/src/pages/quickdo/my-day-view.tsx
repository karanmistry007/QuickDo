"use client"

import { useEffect, useState } from "react"
import CreateQuickDo from "@/components/ui/create-quickdo"
import type { DashboardProps } from "@/types/Common"
import { toast } from "sonner"
import { addQuickDo, deleteQuickDo, fetchQuickDos, updateQuickDo } from "@/utils/quickdo"
import { fetchCategoryList } from "@/utils/quickdo-category"
import Filters from "@/components/layout/filters"
import Sort from "@/components/layout/sort"
import QuickdoList from "@/components/layout/quickdo-list"
import Navbar from "@/components/layout/navbar"
import Sidebar from "@/components/layout/sidebar"
import {
    useStatusFilterData,
    createFilterHandler,
    createClearFiltersHandler,
    getFormattedDate, // Import getFormattedDate
} from "@/utils/filter-utils"


const MyDayView = (props: DashboardProps) => {
    // ? HOOKS
    const jsDate = new Date()
    // ? Use getFormattedDate for consistency with filter-utils
    const todayDate = getFormattedDate(jsDate)
    const defaultFilter = [["date", "=", todayDate]]
    const [currentSort, setCurrentSort] = useState("creation")
    const [currentSortDirection, setCurrentSortDirection] = useState("desc")
    const [filters, setFilters] = useState<any[]>(defaultFilter)
    const [initialLoading, setInitialLoading] = useState(true)
    const [refreshState, setRefreshState] = useState(true)
    const [getAllCategories, setGetAllCategories] = useState<any[]>([])
    const [allTodoData, setAllTodoData] = useState<any[]>([])

    // ? DYNAMIC HANDLE FILTERS FUNCTION - PASS DEFAULT FILTER
    const handleFilters = createFilterHandler(setFilters, defaultFilter)
    // ? HANDLE CLEAR FILTERS
    const handleClearFilters = createClearFiltersHandler(setFilters, defaultFilter)

    // ? USE EFFECT ON FILTERS AND SORT CHANGES
    useEffect(() => {
        setRefreshState(true)
    }, [filters, currentSort, currentSortDirection])

    // ? FETCH DATA ON REFRESH STATE CHANGES
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [quickDos, categories] = await Promise.all([
                    fetchQuickDos(filters, currentSort, currentSortDirection),
                    fetchCategoryList(),
                ])
                setAllTodoData(quickDos)
                setGetAllCategories(categories)
            } catch (error) {
                console.error(error)
                toast.error("There Was A Problem Loading Data!")
            } finally {
                setInitialLoading(false)
                handleRefreshState(false)
            }
        }
        if (refreshState) {
            fetchData()
        }
    }, [refreshState])

    // ? UPDATE AN EXISTING QUICKDO HANDLER
    const handleUpdateQuickDo = async (data: any) => {
        try {
            await updateQuickDo({ ...data, doctype: "QuickDo" })
            handleRefreshState(true)
            toast.success("QuickDo Updated!")
        } catch (error) {
            console.error("Error Updating QuickDo:", error)
            toast.error("Problem Updating QuickDo!")
        }
    }

    // ? ADD A NEW QUICKDO HANDLER
    const handleAddQuickDo = async (data: any) => {
        try {
            await addQuickDo({ ...data, doctype: "QuickDo" })
            handleRefreshState(true)
            toast.success("QuickDo Created!")
        } catch (error) {
            console.error("Error Adding QuickDo:", error)
            toast.error("Problem Adding QuickDo!")
        }
    }

    // ? DELETE TODO HANDLER
    const handleDeleteTodo = async (id: string) => {
        try {
            await deleteQuickDo(id)
            handleRefreshState(true)
            toast.success("QuickDo Deleted!")
        } catch (error) {
            console.error("Error Deleting QuickDo:", error)
            toast.error("Problem Deleting QuickDo!")
        }
    }

    // ? UPDATE REFRESH STATE
    const handleRefreshState = (state: boolean) => setRefreshState(state)

    return (
        <>
            {/* NAVBAR */}
            <Navbar />
            {/* SIDEBAR */}
            <Sidebar />
            {/* DASHBOARD CONTAINER */}
            <div className="dashboard-container sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] mt-[134px] sm:mt-0 sm:h-[calc(100dvh_-_61px)] overflow-y-scroll">
                {/* CREATE TODO */}
                <div className="create-todo-container">
                    <CreateQuickDo handleNewToDo={handleAddQuickDo} allCategories={getAllCategories} />
                </div>
                {/* DASHBOARD */}
                <div className="dashboard-list-view-container">
                    {/* UTILS BAR */}
                    <div className="utils-container flex justify-start gap-5 py-1 px-4 sm:px-5">
                        {/* FILTERS */}
                        <Filters
                            filters={filters}
                            useStatusFilterData={useStatusFilterData}
                            getAllCategories={getAllCategories}
                            handleFilters={handleFilters}
                            handleClearFilters={handleClearFilters}
                            setRefreshState={setRefreshState}
                            defaultFilter={defaultFilter}
                        />
                        {/* SORT */}
                        <Sort
                            currentSort={currentSort}
                            currentSortDirection={currentSortDirection}
                            setCurrentSort={setCurrentSort}
                            setCurrentSortDirection={setCurrentSortDirection}
                            setRefreshState={setRefreshState}
                        />
                    </div>
                    {/* LIST VIEW */}
                    <QuickdoList
                        allTodoData={allTodoData}
                        getAllCategories={getAllCategories}
                        initialLoading={initialLoading}
                        handleUpdateQuickDo={handleUpdateQuickDo}
                        handleDeleteTodo={handleDeleteTodo}
                    />
                </div>
                {/* LOADING ANIMATION */}
                {initialLoading && (
                    <div className="loader-container absolute w-[100dvw] h-[100dvh] left-0 top-0 flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </>
    )
}

export default MyDayView
