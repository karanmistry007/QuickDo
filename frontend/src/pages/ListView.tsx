import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CreateTodo from "../components/ui/CreateTodo";
import ListItem from "../components/ui/ListItem";
import { BsSortUp } from "react-icons/bs";
import { BsSortDownAlt } from "react-icons/bs";
import {
    useAPISaveTodoData,
    useAllTodoData,
    useGetAllCategories,
    useSortDataItems,
    useAPITodoListData,
    DashboardProps,
} from "../types/Common";
import Toaster from "../components/ui/Toaster";


// ? DEFINE SORTING DATA
const useSortData: useSortDataItems[] = [
    { name: "Created", sort: "creation" },
    { name: "Modified", sort: "modified" },
    { name: "Importance", sort: "is_important" },
    { name: "Due Date", sort: "date" },
    { name: "Reminder", sort: "send_reminder" },
];


const ListView = (props: DashboardProps) => {

    //? HOOKS
    const [currentSort, setCurrentSort] = useState<string>("creation");
    const [currentSortDirection, setCurrentSortDirection] = useState<string>("desc");
    const [sortDropdownActive, setSortDropdownActive] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
    const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;

    // ? TOASTER HANDLERS
    const [showToaster, setShowToaster] = useState<boolean>(false);
    const [toasterMessage, setToasterMessage] = useState<string>("");
    const handleClose = (data: boolean) => {
        setShowToaster(data);
    };


    //? SORT CLICK HANDLER
    const handleSortDropdownClick = (event: MouseEvent) => {
        if (
            sortDropdownRef.current &&
            !sortDropdownRef.current.contains(event.target as Node)
        ) {
            setSortDropdownActive(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleSortDropdownClick);
        return () => {
            document.removeEventListener("mousedown", handleSortDropdownClick);
        };
    }, []);

    // TODO WILL REPLACE WITH THE SOCKET
    //? UPDATE STATE
    const [refreshState, setRefreshState] = useState<boolean>(true);
    const handleRefreshState = (state: boolean) => {
        setRefreshState(state);
    };

    //? CATEGORY API DATA
    const [getAllCategories, setGetAllCategories] = useState<useGetAllCategories[]>([]);

    //? ALL TODO API DATA
    const [allTodoData, setAllTodoData] = useState<useAllTodoData[]>([]);

    //? SAVE TODO HANDLER
    const handleSaveToDo = (data: useAllTodoData) => {
        //? MAP THE OBJECT TO FRAPPE'S DATA
        const finalData: useAPISaveTodoData = {
            name: data?.name,
            owner: data?.owner,
            creation: data?.creation,
            modified: data?.modified,
            modified_by: data?.modified_by,
            doctype: "QuickDo",
            status: data.completeTodo ? "Closed" : "Open",
            is_important: data.importantTodo,
            send_reminder: data.isSendReminder,
            description: data.descriptionTodo,
            date: data.selectDueDate,
            categories: data.selectedCategories,
        };

        //? FETCH SAVE TODO API FUNCTION
        const fetchAPI = async (finalData: useAPISaveTodoData) => {
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
                }
            } catch (error) {
                console.log(error);
                setShowToaster(true);
                setToasterMessage("Error Saving The QuickDo!");
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
                }
            } catch (error) {
                console.log(error);
                setShowToaster(true);
                setToasterMessage("Error Deleting The QuickDo!");
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
                    `${BASE_URL}/api/method/quickdo.api.get_quickdo_with_categories?doctype=QuickDo&fields=["*"]${currentSort && currentSortDirection
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
                    const finalData: useAllTodoData[] = [];
                    response.data.message.map(
                        (todo: useAPITodoListData, index: number) => {
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
                                completeTodo: todo.status == "Closed" ? true : false,
                                importantTodo: todo.is_important,
                                isSendReminder: todo.send_reminder,
                                descriptionTodo: description || "",
                                selectDueDate: todo.date || "",
                                selectedCategories: todo.categories || [],
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
                setShowToaster(true);
                setToasterMessage("Error Loading QuickDos!");
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
                setShowToaster(true);
                setToasterMessage("Error Loading Categories!");
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
            <div className="dashboard-container sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] h-auto mt-[calc(72px_+_55px)] sm:mt-0 sm:h-[calc(100dvh_-_80px)] overflow-y-scroll">
                {/* CREATE TODO */}
                <div className="create-todo-container">
                    <CreateTodo
                        handleNewToDo={handleSaveToDo}
                        allCategories={getAllCategories}
                    />
                </div>
                {/* END CREATE TODO */}

                {/* DASHBOARD */}
                <div className="dashboard-list-view-container">
                    {/* SORT SECTION*/}
                    <div
                        className="sort-section mx-4 sm:mx-5 w-fit relative select-none cursor-pointer"
                        ref={sortDropdownRef}
                    >
                        {/* SORT DROPDOWN */}
                        <div className="sort flex justify-start items-center  bg-white shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] text-nowrap w-fit rounded-md cursor-pointer select-none">
                            <button
                                className="sort p-1 px-2 md:px-3 md:py-1 hover:bg-gray-100"
                                title="Sort By"
                                onClick={() => setSortDropdownActive(!sortDropdownActive)}
                            >
                                {useSortData.find((item) => item.sort == currentSort)?.name}
                            </button>
                            <button
                                className="sort-direction p-1.5 px-2 md:px-3 md:py-1.5 border-l text-[20px] hover:bg-gray-100"
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
                        {/* SORT PROFILE DROPDOWN */}

                        {/* SORT ITEMS */}
                        <div
                            className={`user-profile-dropdown-items absolute fade-animation bg-white p-1 rounded-md left-0 top-[36px] flex flex-col justify-center items-start shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] ${sortDropdownActive ? "block" : "hidden"}`}
                        >
                            {useSortData.map((item, index) => {
                                return item.sort !== currentSort ? (
                                    <button
                                        key={index}
                                        className="user-profile-item text-start hover:bg-gray-100 rounded-md text-nowrap w-full"
                                    >
                                        <div
                                            className="frappe-ui-link w-full p-1 md:px-2 md:py-0.5 block"
                                            onClick={() => {
                                                setCurrentSort(item.sort),
                                                    setSortDropdownActive(false),
                                                    setRefreshState(true);
                                            }}
                                        >
                                            {item.name}
                                        </div>
                                    </button>
                                ) : null;
                            })}
                        </div>
                        {/* SORT PROFILE ITEMS */}
                    </div>
                    {/* END SORT SECTION*/}

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
                                <ListItem
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

                {/* TOASTER */}
                {showToaster && (
                    <Toaster
                        message={toasterMessage}
                        onClose={handleClose}
                        duration={5000}
                        // color="bg-blue-400"
                        color="bg-red-400"
                    />
                )}
                {/* TOASTER */}

            </div>
            {/* END DASHBOARD CONTAINER */}
        </>
    );
};

export default ListView;
