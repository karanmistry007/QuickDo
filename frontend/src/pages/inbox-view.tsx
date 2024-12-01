import { useEffect, useState } from "react";
import CreateQuickDo from "../components/ui/create-quickdo";
import QuickDoItem from "../components/ui/quickdo-item";
import { BsSortUp } from "react-icons/bs";
import { BsSortDownAlt } from "react-icons/bs";
import {
    useSortDataItems,
    DashboardProps,
    useStatusFiltersItems,
} from "../types/Common";
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoClose } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { addQuickDo, deleteQuickDo, fetchQuickDos, updateQuickDo } from "@/utils/quickdo";
import { fetchCategoryList } from "@/utils/quickdo-category";

// ? DEFINE STATUS DROPDOWN DATA
const useStatusFilterData: useStatusFiltersItems[] = [
    { name: "Open" },
    { name: "Completed" },
    { name: "Cancelled" },
]

// ? DEFINE SORTING DATA
const useSortData: useSortDataItems[] = [
    { name: "Created", sort: "creation" },
    { name: "Modified", sort: "modified" },
    { name: "Importance", sort: "is_important" },
    { name: "Due Date", sort: "date" },
    { name: "Reminder", sort: "send_reminder" },
    { name: "Status", sort: "status" },
    { name: "Description", sort: "description" },
];

const InboxView = (props: DashboardProps) => {

    // ? HOOKS
    const [currentSort, setCurrentSort] = useState("creation");
    const [currentSortDirection, setCurrentSortDirection] = useState("desc");
    const [filters, setFilters] = useState<any[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshState, setRefreshState] = useState(true);
    const [getAllCategories, setGetAllCategories] = useState<any[]>([]);
    const [allTodoData, setAllTodoData] = useState<any[]>([]);

    // ? HANDLE FILTERS DATA
    const handleFilters = (key: string, value: string, child_table = "") => {
        setFilters((prevFilters) => {
            // ? FIND THE INDEX OF EXISTING FILTER BASED ON KEY OR CHILD TABLE
            const index = prevFilters.findIndex(
                (filter: any) => filter[0] === (child_table || key)
            );

            const updatedFilters = [...prevFilters];
            const fieldIndex = child_table ? 3 : 2; // ? DETERMINE FIELD BASED ON CHILD TABLE

            if (index !== -1) {
                const values = updatedFilters[index][fieldIndex] || [];

                // ? REMOVE VALUE IF IT EXISTS
                if (values.includes(value)) {
                    updatedFilters[index][fieldIndex] = values.filter(
                        (item: string) => item !== value
                    );

                    // ? REMOVE FILTER COMPLETELY IF EMPTY
                    if (updatedFilters[index][fieldIndex].length === 0) {
                        updatedFilters.splice(index, 1);
                    }
                } else {
                    // ? ADD VALUE IF NOT EXISTS
                    updatedFilters[index][fieldIndex] = [...values, value];
                }
            } else {
                // ? ADD NEW FILTER IF NOT EXISTS
                updatedFilters.push(
                    child_table
                        ? [child_table, key, "in", [value]]
                        : [key, "in", [value]]
                );
            }

            return updatedFilters;
        });
    };

    // ? HANDLE CLEAR FILTERS
    const handleClearFilters = () => setFilters([]);

    // ? USE EFFECT ON FILTERS AND SORT CHANGES
    useEffect(() => {
        setRefreshState(true);
    }, [filters, currentSort, currentSortDirection]);

    // ? FETCH DATA ON REFRESH STATE CHANGES
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [quickDos, categories] = await Promise.all([
                    fetchQuickDos(filters, currentSort, currentSortDirection),
                    fetchCategoryList(),
                ]);
                setAllTodoData(quickDos);
                setGetAllCategories(categories);
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                setInitialLoading(false);
                handleRefreshState(false);
            }
        };

        if (refreshState) {
            fetchData();
        }
    }, [refreshState]);

    // ? UPDATE AN EXISTING QUICKDO HANDLER
    const handleUpdateQuickDo = async (data: any) => {
        try {
            await updateQuickDo({ ...data, doctype: "QuickDo" });
            handleRefreshState(true);
            toast.success("QuickDo Updated!");
        } catch (error) {
            console.error("Error Updating QuickDo:", error);
            toast.error("Problem Updating QuickDo!");
        }
    };

    // ? ADD A NEW QUICKDO HANDLER
    const handleAddQuickDo = async (data: any) => {
        try {
            await addQuickDo({ ...data, doctype: "QuickDo" });
            handleRefreshState(true);
            toast.success("QuickDo Created!");
        } catch (error) {
            console.error("Error Adding QuickDo:", error);
            toast.error("Problem Adding QuickDo!");
        }
    };

    // ? DELETE TODO HANDLER
    const handleDeleteTodo = async (id: string) => {
        try {
            await deleteQuickDo(id);
            handleRefreshState(true);
            toast.success("QuickDo Deleted!");
        } catch (error) {
            console.error("Error Deleting QuickDo:", error);
            toast.error("Problem Deleting QuickDo!");
        }
    };

    // ? UPDATE REFRESH STATE
    const handleRefreshState = (state: boolean) => setRefreshState(state);


    return (
        <>
            {/* DASHBOARD CONTAINER */}
            <div className="dashboard-container sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] mt-[134px] sm:mt-0 sm:h-[calc(100dvh_-_80px)] overflow-y-scroll">

                {/* CREATE TODO */}
                <div className="create-todo-container">
                    <CreateQuickDo handleNewToDo={handleAddQuickDo} allCategories={getAllCategories} />
                </div>

                {/* DASHBOARD */}
                <div className="dashboard-list-view-container">

                    {/* UTILS BAR */}
                    <div className="utils-container flex justify-start gap-5 py-1 px-4 sm:px-5">

                        {/* FILTERS */}
                        <div className="filters-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm sm:order-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="font-normal">Filters</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Filters</DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        {/* STATUS FILTERS */}
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {useStatusFilterData.length > 0 && useStatusFilterData.map((data, index) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={index}
                                                            checked={filters.some(filter => filter[0] === "status" && filter[2]?.includes(data.name))}
                                                            onCheckedChange={() => handleFilters("status", data.name)}
                                                        >
                                                            {data.name}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>

                                        {/* CATEGORY FILTERS */}
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {getAllCategories.length > 0 && getAllCategories.map((data, index) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={index}
                                                            checked={filters.some(filter => filter[0] === "QuickDo Categories" && filter[3]?.includes(data.category))}
                                                            onCheckedChange={() => handleFilters("category", data.category, "QuickDo Categories")}
                                                        >
                                                            {data.category}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>

                                        {/* DUE DATE FILTER */}
                                        <DropdownMenuItem>Due Date</DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        {/* IMPORTANCE FILTER */}
                                        <DropdownMenuCheckboxItem
                                            checked={filters.some(filter => filter[0] === "is_important" && filter[2]?.includes("1"))}
                                            onCheckedChange={() => handleFilters("is_important", "1")}
                                        >
                                            Importance
                                        </DropdownMenuCheckboxItem>

                                        {/* REMINDER FILTER */}
                                        <DropdownMenuCheckboxItem
                                            checked={filters.some(filter => filter[0] === "send_reminder" && filter[2]?.includes("1"))}
                                            onCheckedChange={() => handleFilters("send_reminder", "1")}
                                        >
                                            Reminder
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* CLEAR FILTERS */}
                            <button
                                className="clear-filters px-3 py-2 text-[20px]"
                                onClick={() => {
                                    handleClearFilters();
                                    setRefreshState(true);
                                }}
                            >
                                <IoClose title="Clear Filters" className="text-xl" />
                            </button>
                        </div>

                        {/* SORT */}
                        <div className="sort-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm sm:order-1">
                            <Select onValueChange={(e) => { setCurrentSort(e); setRefreshState(true); }}>
                                <SelectTrigger className="w-fit border-0 border-r py-0">
                                    <SelectValue
                                        defaultValue={useSortData.find(item => item.sort === currentSort)?.sort}
                                        placeholder={useSortData.find(item => item.sort === currentSort)?.name}
                                    />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] w-fit">
                                    {useSortData.map((item, index) => (
                                        <SelectItem key={index} value={item.sort}>{item.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <button
                                className="sort-direction px-3 py-2 text-[20px]"
                                onClick={() => {
                                    setCurrentSortDirection(currentSortDirection === "asc" ? "desc" : "asc");
                                    setRefreshState(true);
                                }}
                            >
                                {currentSortDirection === "desc" ? (
                                    <BsSortDownAlt title="Descending" className="text-xl" />
                                ) : (
                                    <BsSortUp title="Ascending" className="text-xl" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* LIST VIEW */}
                    <div className="list-view-container pt-0 p-4 sm:p-5 w-full">
                        <div className="list-view bg-white flex flex-col rounded-md">
                            {/* LIST HEADINGS */}
                            <div className="list-heading font-medium border-b border-gray-300 sm:font-semibold py-2 px-1.5 sm:px-3 flex justify-between lg:grid gap-1 sm:gap-y-2 lg:grid-cols-8 xl:grid-cols-10 xxl:grid-cols-12 items-center">
                                <div className="heading w-[85%] sm:w-[80%] text-center lg:w-auto lg:col-span-3 xl:col-span-5 xxl:col-span-7">Title</div>
                                <div className="heading hidden lg:block lg:col-span-2">Due Date</div>
                                <div className="heading hidden lg:block lg:col-span-1">Importance</div>
                                <div className="heading hidden lg:block lg:col-span-1">Categories</div>
                                <div className="heading w-[15%] sm:w-[20%] text-center lg:w-auto lg:col-span-1">More</div>
                            </div>

                            {/* LIST ITEMS */}
                            {!initialLoading && (
                                allTodoData.length > 0 ? allTodoData.map((item, index) => (
                                    <QuickDoItem
                                        key={index}
                                        todoData={item}
                                        allCategories={getAllCategories}
                                        handleSaveToDo={handleUpdateQuickDo}
                                        handleDeleteTodo={handleDeleteTodo}
                                    />
                                )) : (
                                    <div className="text-center my-20 sm:my-20 font-semibold">
                                        No Open QuickDos Are Available Please Create One!
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* LOADING ANIMATION */}
                {initialLoading && (
                    <div className="loader-container absolute w-[100dvw] h-[100dvh] left-0 top-0 flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </>
    );
};

export default InboxView;
