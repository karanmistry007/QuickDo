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
} from "../types/Common";
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ? DEFINE SORTING DATA
const useSortData: useSortDataItems[] = [
    { name: "Created", sort: "creation" },
    { name: "Modified", sort: "modified" },
    { name: "Importance", sort: "is_important" },
    { name: "Due Date", sort: "date" },
    { name: "Reminder", sort: "send_reminder" },
    { name: "Status", sort: "status" },
];

const ListView = (props: DashboardProps) => {

    //? HOOKS
    const [currentSort, setCurrentSort] = useState<string>("creation");
    const [currentSortDirection, setCurrentSortDirection] = useState<string>("desc");
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
    const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;


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
                    `${BASE_URL}/api/method/quickdo.api.get_quickdo_with_categories?doctype=QuickDo&filters=[["date","in",["","2024-10-16"]]]&fields=["*"]${currentSort && currentSortDirection
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
            <div className="dashboard-container sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] h-auto mt-[calc(72px_+_55px)] sm:mt-0 sm:h-[calc(100dvh_-_80px)] overflow-y-scroll">
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
                    {/* SORT SECTION*/}
                    <div className="sort-container  py-1 px-4 sm:px-5">

                        <div className="sort-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm">

                            <div className="sort-value">
                                <Select
                                    onValueChange={(e) => {
                                        setCurrentSort(e),
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