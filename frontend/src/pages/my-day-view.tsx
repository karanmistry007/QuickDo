import { useEffect, useState } from "react";
import axios from "axios";
import CreateQuickDo from "../components/ui/create-quickdo";
import QuickDoItem from "../components/ui/quickdo-item";
import { BsSortUp } from "react-icons/bs";
import { BsSortDownAlt } from "react-icons/bs";
import {
    useAllQuickDoData,
    useAllCategories,
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
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

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

const ListView = (props: DashboardProps) => {

    //? HOOKS
    const currDate = new Date();
    const currISODate = currDate.toISOString().split("T")[0];
    const [currentSort, setCurrentSort] = useState<string>("creation");
    const [currentSortDirection, setCurrentSortDirection] = useState<string>("desc");
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<any>([["date", "<=", currISODate]]);
    const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
    const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;


    // ? HANDLE FILTERS DATA
    const handleFilters = (key: string, value: string, child_table: string = "") => {

        // ? IF DEALING WITH A CHILD TABLE
        if (child_table) {
            // ? CHECK IF THE CHILD TABLE EXISTS IN FILTERS
            const existingFilterIndex = filters.findIndex(
                (filter: any) => filter[0] === child_table
            );

            // ? IF THE CHILD TABLE FILTER EXISTS
            if (existingFilterIndex !== -1) {
                const inFilters = filters[existingFilterIndex][3];

                // ? IF THE VALUE EXISTS IN THE FILTER, REMOVE IT
                if (inFilters.includes(value)) {
                    const updatedFilters = [...filters];
                    updatedFilters[existingFilterIndex] = [
                        child_table,
                        key,
                        "in",
                        inFilters.filter((item: string) => item !== value),
                    ];

                    // ? REMOVE THE FILTER ENTRY IF THE LIST IS EMPTY
                    if (updatedFilters[existingFilterIndex][3].length === 0) {
                        updatedFilters.splice(existingFilterIndex, 1);
                    }

                    setFilters(updatedFilters);
                }
                // ? IF THE VALUE DOES NOT EXIST IN THE FILTER, ADD IT
                else {
                    const updatedFilters = [...filters];
                    updatedFilters[existingFilterIndex] = [
                        child_table,
                        key,
                        "in",
                        [...inFilters, value],
                    ];

                    setFilters(updatedFilters);
                }
            }
            // ? IF THE KEY DOES NOT EXIST IN FILTERS, ADD IT
            else {
                setFilters((prevFilters: any) => [
                    ...prevFilters,
                    [child_table, key, "in", [value]],
                ]);
            }
        }

        // ? IF NOT DEALING WITH A CHILD TABLE
        else {
            // ? CHECK IF THE KEY EXISTS IN FILTERS
            const existingFilterIndex = filters.findIndex(
                (filter: any) => filter[0] === key
            );

            // ? IF THE KEY EXISTS IN FILTERS
            if (existingFilterIndex !== -1) {
                const inFilters = filters[existingFilterIndex][2];

                // ? IF THE VALUE EXISTS IN THE FILTER, REMOVE IT
                if (inFilters.includes(value)) {
                    const updatedFilters = [...filters];
                    updatedFilters[existingFilterIndex] = [
                        key,
                        "in",
                        inFilters.filter((item: string) => item !== value),
                    ];

                    // ? REMOVE THE FILTER ENTRY IF THE LIST IS EMPTY
                    if (updatedFilters[existingFilterIndex][2].length === 0) {
                        updatedFilters.splice(existingFilterIndex, 1);
                    }

                    setFilters(updatedFilters);
                }
                // ? IF THE VALUE DOES NOT EXIST IN THE FILTER, ADD IT
                else {
                    const updatedFilters = [...filters];
                    updatedFilters[existingFilterIndex] = [
                        key,
                        "in",
                        [...inFilters, value],
                    ];

                    setFilters(updatedFilters);
                }
            }
            // ? IF THE KEY DOES NOT EXIST IN FILTERS, ADD IT
            else {
                setFilters((prevFilters: any) => [
                    ...prevFilters,
                    [key, "in", [value]],
                ]);
            }
        }
    };

    // ? HANDLE CLEAR FILTERS
    const handleClearFilters = () => {
        setFilters([["date", "<=", currISODate]]);
    }

    // ? USE EFFECT ON THE FILTERS CHANGES
    useEffect(() => {
        setRefreshState(true);
    }, [filters])

    // TODO WILL REPLACE WITH THE SOCKET
    //? UPDATE STATE
    const [refreshState, setRefreshState] = useState<boolean>(true);
    const handleRefreshState = (state: boolean) => {
        setRefreshState(state);
    };

    //? CATEGORY API DATA
    const [getAllCategories, setGetAllCategories] = useState<useAllCategories[]>([]);

    //? ALL TODO API DATA
    const [allTodoData, setAllTodoData] = useState<useAllQuickDoData[]>([]);

    //? SAVE TODO HANDLER
    const handleSaveToDo = (data: useAllQuickDoData) => {

        //? MAP THE OBJECT TO FRAPPE'S DATA
        const finalData: useAllQuickDoData = {
            name: data?.name,
            owner: data?.owner,
            creation: data?.creation,
            modified: data?.modified,
            modified_by: data?.modified_by,
            doctype: "QuickDo",
            status: data.status,
            is_important: data.is_important,
            send_reminder: data.send_reminder,
            description: data.description,
            date: data.date,
            categories: data.categories,
        };

        //? FETCH SAVE TODO API FUNCTION
        const fetchAPI = async (finalData: useAllQuickDoData) => {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/method/frappe.desk.form.save.savedocs`,
                    {
                        doc: JSON.stringify(finalData),
                        action: "Save",
                    },
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    }
                );

                //? REFRESH THE STATE
                if (response.status === 200) {
                    handleRefreshState(true);

                    // ? IF NEW CREATED
                    if (!finalData.name) {
                        toast.success('The QuickDo has been created!')
                    }

                    // ? IF UPDATED
                    else {
                        toast.success('The QuickDo has been updated!')
                    }


                }
            } catch (error) {
                console.log(error);
                toast.error('There was a problem while saving QuickDo!')
            }
        };

        //? FETCH POST API CALL
        fetchAPI(finalData);
    };

    //? DELETE TODO HANDLER
    const handleDeleteTodo = (data: string) => {
        //? FETCH DELETE TODO API FUNCTION
        const fetchAPI = async (data: string) => {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/method/frappe.client.delete`,
                    {
                        doctype: "QuickDo",
                        name: data,
                    },
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    }
                );
                //? REFRESH THE STATE
                if (response.status === 200) {
                    handleRefreshState(true);
                    toast.success("The QuickDo has been deleted!");
                }
            } catch (error) {
                console.log(error);
                toast.error("There was a problem while deleting QuickDo!");
            }
        };

        //? CALL FETCH API
        fetchAPI(data);
    };

    //? TODO LIST API
    useEffect(() => {

        //? FETCH TODO LIST API MAIN DATA LOADER API FUNCTION
        const fetchAPI = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/method/quickdo.api.get_quickdo_with_categories?doctype=QuickDo&fields=["*"]&filters=${JSON.stringify(filters)}${currentSort && currentSortDirection
                        ? "&order_by=" + currentSort + " " + currentSortDirection
                        : ""
                    }`,
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    }
                );

                //? IF THE API RETURNS DATA MAP THE DATA IN DESIRED FORMAT
                if (response.data.message) {
                    const finalData: useAllQuickDoData[] = [];
                    response.data.message.map(
                        (todo: useAllQuickDoData) => {
                            //? PARSE THE TODO HTML
                            const parser = new DOMParser();
                            const description_doc = parser.parseFromString(
                                todo.description,
                                "text/html"
                            );
                            const description: any = description_doc.querySelector(
                                ".ql-editor.read-mode p"
                            )?.textContent
                                ? description_doc.querySelector(".ql-editor.read-mode p")
                                    ?.textContent
                                : todo.description;

                            //? UPDATE THE FINAL DATA
                            finalData.push({
                                name: todo.name,
                                owner: todo.owner,
                                creation: todo.creation,
                                modified: todo.modified,
                                modified_by: todo.modified_by,
                                status: todo.status,
                                is_important: todo.is_important,
                                send_reminder: todo.send_reminder,
                                description: description || "",
                                date: todo.date || "",
                                categories: todo.categories || [],
                            });

                            //? REFRESH STATE
                            handleRefreshState(false);
                        }
                    );

                    //? SET THE FINAL DATA TO STATE
                    setAllTodoData(finalData);

                    //? SET INITIAL LOADING
                    setInitialLoading(false);
                }
            } catch (error) {
                console.log(error);
                toast.error("There was a problem while loading QuickDos!");
            }
        };

        //? CALL THE FETCH API FUNCTION
        if (refreshState) {
            fetchAPI();
        }
    }, [refreshState]);

    //? CATEGORIES LIST API
    useEffect(() => {
        //? FETCH CATEGORY LIST API FUNCTION
        const fetchAPI = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}//api/method/frappe.client.get_list?doctype=QuickDo Category&fields=["category"]`,
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    }
                );

                //? IF THE API RETURNS DATA
                if (response.data.message) {
                    //? SET ALL CATEGORIES STATE
                    setGetAllCategories(response.data.message);

                    //? REFRESH STATE
                    handleRefreshState(false);
                }
            } catch (error) {
                console.log(error);
                toast.error('There was a problem while loading Categories!')
            }
        };

        //? CALL THE FETCH API FUNCTION
        if (refreshState) {
            fetchAPI();
        }
    }, [refreshState]);

    return (
        <>
            {/* DASHBOARD CONTAINER */}
            <div className="dashboard-container sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] h-auto mt-[134px] sm:mt-0 sm:h-[calc(100dvh_-_80px)] overflow-y-scroll">
                {/* CREATE TODO */}
                <div className="create-todo-container">
                    <CreateQuickDo
                        handleNewToDo={handleSaveToDo}
                        allCategories={getAllCategories}
                    />
                </div>
                {/* END CREATE TODO */}

                {/* DASHBOARD */}
                <div className="dashboard-list-view-container">

                    {/* UTILS BAR */}
                    <div className="utils-container flex justify-start gap-5 py-1 px-4 sm:px-5">

                        {/* FILTERS SECTION */}
                        <div className="filters-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm sm:order-2">

                            <div className="filter-value">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="font-normal">
                                            Filters
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>
                                            Filters
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {/* GROUP 1 */}
                                        <DropdownMenuGroup>

                                            {/* STATUS FILTERS */}
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    Status
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>

                                                        {useStatusFilterData.length !== 0 &&
                                                            useStatusFilterData.map((data: useStatusFiltersItems, index: number) => (

                                                                <DropdownMenuCheckboxItem
                                                                    checked={
                                                                        filters.some(
                                                                            (filter: any) => filter[0] === "status" && filter[2]?.includes(data.name)
                                                                        )
                                                                    }
                                                                    onCheckedChange={() => {
                                                                        handleFilters("status", data.name)
                                                                    }}
                                                                    key={index}
                                                                >
                                                                    {data.name}
                                                                </DropdownMenuCheckboxItem>
                                                            ))

                                                        }
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            {/* END STATUS FILTERS */}


                                            {/* CATEGORY FILTERS */}
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    Category
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>

                                                        {getAllCategories.length !== 0 &&
                                                            getAllCategories.map((data: useAllCategories, index: number) => (

                                                                <DropdownMenuCheckboxItem
                                                                    checked={
                                                                        filters.some(
                                                                            (filter: any) => filter[0] === "QuickDo Categories" && filter[3]?.includes(data.category)
                                                                        )}
                                                                    onCheckedChange={() => {
                                                                        handleFilters("category", data.category, "QuickDo Categories")
                                                                    }}
                                                                    key={index}
                                                                >
                                                                    {data.category}
                                                                </DropdownMenuCheckboxItem>
                                                            ))

                                                        }
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            {/* END CATEGORY FILTERS */}

                                        </DropdownMenuGroup>
                                        {/* END GROUP 1 */}

                                        <DropdownMenuSeparator />

                                        {/* GROUP 2 */}
                                        <DropdownMenuGroup>

                                            {/* IMPORTANCE FILTERS */}
                                            <DropdownMenuCheckboxItem
                                                checked={
                                                    filters.some(
                                                        (filter: any) => filter[0] === "is_important" && filter[2]?.includes("1")
                                                    ) ? true : false
                                                }
                                                onCheckedChange={() => handleFilters("is_important", "1")}
                                            >
                                                Importance
                                            </DropdownMenuCheckboxItem>
                                            {/* END IMPORTANCE FILTERS */}

                                            {/* REMINDER FILTERS */}
                                            <DropdownMenuCheckboxItem
                                                checked={
                                                    filters.some(
                                                        (filter: any) => filter[0] === "send_reminder" && filter[2]?.includes("1")
                                                    ) ? true : false
                                                }
                                                onCheckedChange={() => handleFilters("send_reminder", "1")}
                                            >
                                                Reminder
                                            </DropdownMenuCheckboxItem>
                                            {/* END REMINDER FILTERS */}

                                        </DropdownMenuGroup>
                                        {/* END GROUP 2 */}

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="clear-filters">
                                <button
                                    className="clear-filters px-3 py-2 text-[20px]"
                                    onClick={() => {
                                        handleClearFilters();
                                        setRefreshState(true);
                                    }}
                                >
                                    <IoClose
                                        title="Clear Filters"
                                        className={`text-xl`}
                                    />
                                </button>
                            </div>

                        </div>
                        {/* END FILTERS SECTION */}

                        {/* SORT */}
                        <div className="sort-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm sm:order-1">

                            <div className="sort-value">
                                <Select
                                    onValueChange={(e) => {
                                        setCurrentSort(e);
                                        setRefreshState(true);
                                    }}
                                >
                                    <SelectTrigger className="w-fit border-0 border-r py-0">
                                        <SelectValue
                                            defaultValue={useSortData.find((item) => item.sort == currentSort)?.sort}
                                            placeholder={useSortData.find((item) => item.sort == currentSort)?.name}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px] w-fit">
                                        {useSortData.map((item, index) => {
                                            return (
                                                <SelectItem key={index} value={item.sort} >{item.name}</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="sort-direction">
                                <button
                                    className="sort-direction px-3 py-2 text-[20px]"
                                    onClick={() => {
                                        setCurrentSortDirection(
                                            currentSortDirection === "asc" ? "desc" : "asc"
                                        ),
                                            setRefreshState(true);
                                    }}
                                >
                                    <BsSortDownAlt
                                        title="Descending"
                                        className={`text-xl ${currentSortDirection === "desc" ? "show" : "hidden"
                                            }`}
                                    />
                                    <BsSortUp
                                        title="Ascending"
                                        className={`text-xl ${currentSortDirection === "asc" ? "show" : "hidden"
                                            }`}
                                    />
                                </button>
                            </div>

                        </div>
                        {/* END SORT */}

                    </div>
                    {/* END UTILS BAR */}

                    {/* LIST VIEW */}
                    <div className="list-view-container pt-0 p-4 sm:pt-0 md:pt-0 sm:p-5 w-full">
                        <div className="list-view bg-white  flex flex-col rounded-md">

                            {/* LIST HEADINGS */}
                            <div className="list-heading font-medium border-b border-gray-300 sm:font-semibold py-2 px-1.5 sm:px-3 flex justify-between lg:grid  gap-1 sm:gap-y-2 sm:gap-x-5 lg:grid-cols-8 xl:grid-cols-10 xxl:grid-cols-12 items-center justify-items-center">
                                <div className="heading w-[85%] sm:w-[80%] text-center lg:w-auto lg:col-span-3 xl:col-span-5 xxl:col-span-7">
                                    Title
                                </div>
                                <div className="heading hidden lg:block lg:col-span-2">
                                    Due Date
                                </div>
                                <div className="heading hidden lg:block lg:col-span-1">
                                    Importance
                                </div>
                                <div className="heading hidden lg:block lg:col-span-1">
                                    Categories
                                </div>
                                <div className="heading w-[15%] sm:w-[20%] text-center lg:w-auto lg:col-span-1">
                                    More
                                </div>
                            </div>
                            {/* END LIST HEADINGS */}

                            {/* LIST VIEW ITEMS */}
                            {!initialLoading && (allTodoData.length !== 0 ? allTodoData.map((item, index) => (
                                <QuickDoItem
                                    key={index}
                                    todoData={item}
                                    allCategories={getAllCategories}
                                    handleSaveToDo={handleSaveToDo}
                                    handleDeleteTodo={handleDeleteTodo}
                                />
                            )) :
                                (<>
                                    <div className="text-center my-20 sm:my-20 font-semibold">
                                        No QuickDos Are Available Please Create One!
                                    </div>
                                </>))
                            }
                            {/* END LIST VIEW ITEMS */}

                        </div>
                    </div>
                    {/* END LIST VIEW */}

                </div>
                {/* END DASHBOARD */}

                {/* LOADING ANIMATION */}
                {initialLoading && (
                    <div className="loader-container absolute w-[100dvw] h-[100dvh] left-0 top-0 flex justify-center items-center">
                        <div className="loader">
                        </div>
                    </div>
                )}
                {/* END LOADING ANIMATION */}

            </div>
            {/* END DASHBOARD CONTAINER */}
        </>
    );
};

export default ListView;
