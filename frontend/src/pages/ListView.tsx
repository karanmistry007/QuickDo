import { useEffect, useRef, useState } from "react";
import { useFrappeGetCall, useFrappePostCall, useSWRConfig } from "frappe-react-sdk";
import axios from "axios";
import CreateTodo from "../components/ui/CreateTodo";
import ListItem from "../components/ui/ListItem";
import { BASE_URL, API_KEY, API_SECRET } from "../utils/Constants";
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
    const { mutate } = useSWRConfig()
    const [currentSort, setCurrentSort] = useState<string>("creation");
    const [currentSortDirection, setCurrentSortDirection] = useState<string>("asc");
    const [sortDropdownActive, setSortDropdownActive] = useState<boolean>(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

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

    // ? SAVE TODO HANDLER
    const { call: saveToDo } = useFrappePostCall('frappe.desk.form.save.savedocs')

    const handleSaveToDo = async (data: useAllTodoData) => {
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

        return saveToDo({
            doc: JSON.stringify(finalData),
            action: "Save",
        }).then((data) => {
            mutate("todo_with_categories", data);
        }).catch((err) => {
            console.log(err);
        });
    }


    // ? DELETE TODO HANDLER
    const { call: deleteToDo } = useFrappePostCall('frappe.client.delete')

    const handleDeleteTodo = async (data: string) => {

        return deleteToDo({
            doctype: "QuickDo",
            name: data,
        }).then(() => {
            mutate('todo_with_categories');
        }).catch((err) => {
            console.log(err);
        });
    }


    //? GET TODO LIST WITH CATEGORIES HANDLER
    const handleTodoListData = () => {
        const response = useFrappeGetCall<{ message: any }>(`quickdo.api.get_quickdo_with_categories`,
            {
                doctype: "QuickDo",
                fields: ["*"],
                order_by: currentSort && currentSortDirection ? currentSort + " " + currentSortDirection : "creation asc",
            },
            'todo_with_categories',
            {
                revalidateOnFocus: false,
                revalidateOnReconnect: false
            }
        )

        const finalData: useAllTodoData[] = [];
        if (response.data?.message) {

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
                    // handleRefreshState(false);
                }
            );
        }

        return finalData
    }

    const todoListData = handleTodoListData();

    //? GET TODO CATEGORIES HANDLER
    const handleTodoCategories = () => {
        `${BASE_URL}/api/method/frappe.client.get_list?doctype=QuickDo Category&fields=["category"]`
        const response = useFrappeGetCall<{ message: any }>(`frappe.client.get_list`,
            {
                doctype: "QuickDo Category",
                fields: ["category"],
                order_by: "name asc",
            },
            'todo_categories',
            {
                dedupingInterval: 1000 * 60 * 5, // 5 minutes - do not refetch if the data is fresh
            }
        )

        const finalData = [];
        if (response.data?.message) {
            finalData.push(...response.data?.message)
        }

        return finalData
    }

    const todoCategories = handleTodoCategories();


    return (
        <>
            {/* DASHBOARD CONTAINER */}
            <div className="dashboard-container w-full h-[calc(100dvh_-_80px)] overflow-y-scroll">
                {/* CREATE TODO */}
                <div className="create-todo-container">
                    <CreateTodo
                        handleNewToDo={handleSaveToDo}
                        allCategories={todoCategories}
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
                        <div className="sort flex justify-start items-center gap-2 px-1 bg-white shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] hover:bg-gray-100 text-nowrap w-fit rounded-md cursor-pointer select-none">
                            <div
                                className="sort p-1 md:px-2 md:py-1"
                                onClick={() => setSortDropdownActive(!sortDropdownActive)}
                            >
                                {useSortData.find((item) => item.sort == currentSort)?.name}
                            </div>
                            <div
                                className="sort-direction p-1 md:px-2 md:py-1 border-l"
                                onClick={() => {
                                    setCurrentSortDirection(
                                        currentSortDirection === "asc" ? "desc" : "asc"
                                    ),
                                        setRefreshState(true);
                                }}
                            >
                                <BsSortDownAlt
                                    title="Ascending"
                                    className={`text-xl ${currentSortDirection === "asc" ? "show" : "hidden"
                                        }`}
                                />
                                <BsSortUp
                                    title="Descending"
                                    className={`text-xl ${currentSortDirection === "desc" ? "show" : "hidden"
                                        }`}
                                />
                            </div>
                        </div>
                        {/* SORT PROFILE DROPDOWN */}

                        {/* SORT ITEMS */}
                        <div
                            className={`user-profile-dropdown-items absolute bg-white p-1 rounded-md left-0 top-[36px] flex flex-col justify-center items-start shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] ${sortDropdownActive ? "block" : "hidden"
                                }`}
                        >
                            {useSortData.map((item, index) => {
                                return item.sort !== currentSort ? (
                                    <div
                                        key={index}
                                        className="user-profile-item hover:bg-gray-100 rounded-md text-nowrap w-full"
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
                                    </div>
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
                            {todoListData.map((item, index) => (
                                <ListItem
                                    key={index}
                                    todoData={item}
                                    allCategories={todoCategories}
                                    handleSaveToDo={handleSaveToDo}
                                    handleDeleteTodo={handleDeleteTodo}
                                />
                            ))}
                            {/* END LIST VIEW ITEMS */}

                        </div>
                    </div>
                    {/* END LIST VIEW */}

                </div>
                {/* END DASHBOARD */}

            </div>
            {/* ENDDASHBOARD CONTAINER */}
        </>
    );
};

export default ListView;
