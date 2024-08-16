import { useEffect, useRef, useState } from "react";
import CreateTodo from "../components/ui/CreateTodo"
import ListView from "../components/ui/ListView"
import axios from 'axios';
import { BASE_URL, API_KEY, API_SECRET } from "../utils/constants";
import { BsSortUp } from "react-icons/bs";
import { BsSortDownAlt } from "react-icons/bs";

//? SELECTED CATEGORIES 
interface useGetAllCategories {
    category: string;
};

//? TODO ITEMS
interface useAllTodoData {
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
interface useAPITodoListData {
    owner?: string,
    creation?: string,
    modified?: string,
    modified_by?: string,
    name?: string,
    status: string,
    priority: string,
    custom_send_reminder: boolean,
    description: string,
    date: string,
    custom_categories: useGetAllCategories[],
}

//? API TODO CREATE DATA 
interface useAPISaveTodoData {
    owner?: string,
    creation?: string,
    modified?: string,
    modified_by?: string,
    name?: string,
    doctype: string,
    status: string,
    priority: string,
    custom_send_reminder: boolean,
    description: string,
    date: string,
    custom_categories: useGetAllCategories[],
}


//? SORT ITEMS
interface useSortDataItems {
    name: string;
    sort: string;
}

const useSortData: useSortDataItems[] = [
    { name: "Created", sort: "creation" },
    { name: "Modified", sort: "modified" },
    { name: "Importance", sort: "priority" },
    { name: "Due Date", sort: "date" },
    { name: "Reminder", sort: "custom_send_reminder" },
];


//? PROPS 
type Props = {
    name: string,
    link: string,
}

const Dashboard = (props: Props) => {

    // HOOKS
    const [currentSort, setCurrentSort] = useState<string>("creation");
    const [currentSortDirection, setCurrentSortDirection] = useState<string>("asc");

    const [sortDropdownActive, setSortDropdownActive] = useState<boolean>(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const handleSortDropdownClick = (event: MouseEvent) => {
        if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
            setSortDropdownActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleSortDropdownClick);
        return () => {
            document.removeEventListener('mousedown', handleSortDropdownClick);
        };
    }, []);



    //? UPDATE STATE
    const [refreshState, setRefreshState] = useState<boolean>(true);
    const handleRefreshState = (state: boolean) => {
        setRefreshState(state);
    }

    //? CATEGORY API DATA
    const [getAllCategories, setGetAllCategories] = useState<useGetAllCategories[]>([]);

    //? ALL TODO API DATA
    const [allTodoData, setAllTodoData] = useState<useAllTodoData[]>([])

    //? SAVE TODO HANDLER
    const handleSaveToDo = (data: useAllTodoData) => {

        //! SET MODIFIED DATE


        //? MAP THE OBJECT TO FRAPPE'S DATA 
        const finalData: useAPISaveTodoData = {
            name: data?.name,
            owner: data?.owner,
            creation: data?.creation,
            modified: data?.modified,
            modified_by: data?.modified_by,
            doctype: "ToDo",
            status: data.completeTodo ? "Closed" : "Open",
            priority: data.importantTodo ? "High" : "Medium",
            custom_send_reminder: data.isSendReminder,
            description: data.descriptionTodo,
            date: data.selectDueDate,
            custom_categories: data.selectedCategories,
        }

        const fetchAPI = async (finalData: useAPISaveTodoData) => {
            try {
                const response = await axios.post(
                    `${BASE_URL}api/method/frappe.desk.form.save.savedocs`,
                    {
                        doc: JSON.stringify(finalData),
                        action: 'Save',
                    },
                    {
                        headers: {
                            Authorization: `token ${API_KEY}:${API_SECRET}`,
                        },
                    }
                );

                //? REFRESH THE STATE 
                if (response.status === 200) {
                    handleRefreshState(true);
                }
            } catch (error) {
                console.log(error);
            }
        }

        //? FETCH POST API CALL  
        fetchAPI(finalData);
    }

    //? DELETE TODO HANDLER
    const handleDeleteTodo = (data: string) => {
        const fetchAPI = async (data: string) => {
            try {
                const response = await axios.post(
                    `${BASE_URL}api/method/frappe.client.delete`,
                    {
                        doctype: "ToDo",
                        name: data
                    },
                    {
                        headers: {
                            Authorization: `token ${API_KEY}:${API_SECRET}`,
                        },
                    }
                );

                //? REFRESH THE STATE 
                if (response.status === 200) {
                    handleRefreshState(true);
                }
            } catch (error) {
                console.log(error);
            }
        }

        //? CALL FETCH API 
        fetchAPI(data);
    }

    //? TODO LIST API
    useEffect(() => {
        //? FUNCTION TO FETCH API 
        const fetchAPI = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/method/quickdo.api.get_quickdo_with_categories?doctype=QuickDo&fields=["*"]${currentSort && currentSortDirection ? "&order_by=" + currentSort + " " + currentSortDirection : ""}`, {
                    headers: {
                        "Authorization": `token ${API_KEY}:${API_SECRET}`
                    }
                });

                //? IF THE API RETURNS DATA MAP THE DATA IN DESIRED FORMAT
                if (response.data.message) {
                    const finalData: useAllTodoData[] = [];
                    response.data.message.map((todo: useAPITodoListData, index: number) => {

                        //? PARSE THE TODO HTML  
                        const parser = new DOMParser();
                        const description_doc = parser.parseFromString(todo.description, 'text/html');
                        const description: any = description_doc.querySelector('.ql-editor.read-mode p')?.textContent ? description_doc.querySelector('.ql-editor.read-mode p')?.textContent : todo.description;

                        //? UPDATE THE FINAL DATA
                        finalData.push({
                            name: todo.name,
                            owner: todo.owner,
                            creation: todo.creation,
                            modified: todo.modified,
                            modified_by: todo.modified_by,
                            completeTodo: todo.status == "Closed" ? true : false,
                            importantTodo: todo.priority === "High" ? true : false,
                            isSendReminder: todo.custom_send_reminder,
                            descriptionTodo: description || "",
                            selectDueDate: todo.date || "",
                            selectedCategories: todo.custom_categories || [],
                        });


                        //? REFRESH STATE 
                        handleRefreshState(false);
                    });

                    //? SET THE FINAL DATA TO STATE
                    setAllTodoData(finalData);
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        //? CALL THE FETCH API FUNCTION
        if (refreshState) {
            fetchAPI();
        }
    }, [refreshState]);

    //? CATEGORIES LIST API
    useEffect(() => {
        //? FETCH API FUNCTION 
        const fetchAPI = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/method/frappe.client.get_list?doctype=QuickDo Category&fields=["category"]`,
                    {
                        headers: {
                            Authorization: `token ${API_KEY}:${API_SECRET}`,
                        },
                    });

                //? IF THE API RETURNS DATA 
                if (response.data.message) {
                    //? SET ALL CATEGORIES STATE 
                    setGetAllCategories(response.data.message);
                    // console.log(response.data.message)

                    //? REFRESH STATE 
                    handleRefreshState(false);
                }
            } catch (error) {
                console.log(error);
            }
        }

        //? CALL THE FETCH API FUNCTION 
        if (refreshState) {
            fetchAPI();
        }
    }, [refreshState])

    return (
        <>
            <div className="dashboard-container w-full h-[calc(100dvh_-_80px)] overflow-y-scroll">

                {/* CREATE TODO */}
                <div className="create-todo-container">
                    <CreateTodo haldleNewToDo={handleSaveToDo} allCategories={getAllCategories} />
                </div>
                {/* END CREATE TODO */}


                {/* LIST VIEW */}
                <div className="list-view-container">

                    {/* SORT SECTION*/}
                    <div className='sort-section mx-4 sm:mx-5 w-fit relative select-none cursor-pointer' ref={sortDropdownRef}>
                        {/* SORT DROPDOWN */}
                        <div className="sort flex justify-start items-center gap-2 px-1 bg-white shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] hover:bg-gray-100 text-nowrap w-fit rounded-md cursor-pointer select-none">
                            <div className="sort p-1 md:px-2 md:py-1" onClick={() => setSortDropdownActive(!sortDropdownActive)}>
                                {useSortData.find((item) => item.sort == currentSort)?.name}
                            </div>
                            <div className="sort-direction p-1 md:px-2 md:py-1 border-l" onClick={() => { setCurrentSortDirection(currentSortDirection === "asc" ? "desc" : "asc"), setRefreshState(true) }}>
                                <BsSortDownAlt title="Ascending" className={`text-xl ${currentSortDirection === "asc" ? "show" : "hidden"}`} />
                                <BsSortUp title="Descending" className={`text-xl ${currentSortDirection === "desc" ? "show" : "hidden"}`} />
                            </div>
                        </div>
                        {/* SORT PROFILE DROPDOWN */}

                        {/* SORT ITEMS */}
                        <div className={`user-profile-dropdown-items absolute bg-white p-1 rounded-md left-0 top-[36px] flex flex-col justify-center items-start shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] ${sortDropdownActive ? "block" : "hidden"}`}>
                            {useSortData.map((item, index) => {
                                return item.sort !== currentSort ? (
                                    <div key={index} className="user-profile-item hover:bg-gray-100 rounded-md text-nowrap w-full">
                                        <div className="frappe-ui-link w-full p-1 md:px-2 md:py-0.5 block" onClick={() => { setCurrentSort(item.sort), setSortDropdownActive(false), setRefreshState(true) }}>
                                            {item.name}
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>
                        {/* SORT PROFILE ITEMS */}
                    </div>
                    {/* END SORT SECTION*/}


                    <ListView allTodoData={allTodoData} allCategories={getAllCategories} handleSaveToDo={handleSaveToDo} handleDeleteTodo={handleDeleteTodo} />
                </div>
                {/* END LIST VIEW */}

            </div>
        </>
    )
}

export default Dashboard