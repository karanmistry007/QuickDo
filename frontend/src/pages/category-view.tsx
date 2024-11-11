import { useEffect, useState } from "react";
import axios from "axios";
import CreateCategory from "../components/ui/create-category";
import CategoryItem from "../components/ui/category-item";
import { BsSortUp } from "react-icons/bs";
import { BsSortDownAlt } from "react-icons/bs";
import {
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
    { name: "Category", sort: "category" },
];


const CategoryView = (props: DashboardProps) => {


    // ? HOOKS
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

    //? SAVE CATEGORY HANDLER
    const handleSaveCategory = (data: useAllCategories) => {

        //? MAP THE OBJECT TO FRAPPE'S DATA
        const finalData: useAllCategories = {
            name: data?.name,
            owner: data?.owner,
            creation: data?.creation,
            modified: data?.modified,
            modified_by: data?.modified_by,
            doctype: "QuickDo Category",
            category: data.category,
        };

        //? FETCH SAVE CATEGORY API FUNCTION
        const fetchAPI = async (finalData: useAllCategories) => {
            try {

                // ? IF THE CATEGORY IS NEW
                if (!finalData.name) {
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
                        toast.success('The QuickDo Category has been created!')
                    }
                }
                // ? IF THE CATEGORY IS OLD
                else {
                    const response = await axios.post(
                        `${BASE_URL}/api/method/frappe.client.rename_doc`,
                        {
                            old_name: data?.name,
                            doctype: "QuickDo Category",
                            new_name: data.category,
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
                        toast.success('The QuickDo Category has been updated!')
                    }
                }

            } catch (error) {
                console.log(error);
                toast.error('There was a problem while saving QuickDo Category!')
            }
        };

        //? FETCH POST API CALL
        fetchAPI(finalData);
    };

    //? DELETE CATEGORY HANDLER
    const handleDeleteCategory = (data: string) => {

        //? FETCH DELETE CATEGORY API FUNCTION
        const fetchAPI = async (data: string) => {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/method/frappe.client.delete`,
                    {
                        doctype: "QuickDo Category",
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
                    toast.success("The QuickDo Category has been deleted!");
                }
            } catch (error: any) {
                console.log(error);
                const rawError = JSON.parse(JSON.parse(error?.response?.data?._server_messages)[0])?.message;
                const cleanError = rawError ? rawError.replace(/<[^>]*>/g, '') : "There was a problem while deleting QuickDo Category!";
                toast.error(cleanError);
            }
        };

        //? CALL FETCH API
        fetchAPI(data);
    };

    //? CATEGORIES LIST API
    useEffect(() => {

        //? FETCH CATEGORY LIST API FUNCTION
        const fetchAPI = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/method/frappe.client.get_list?doctype=QuickDo Category&fields=["name","owner","creation","modified","modified_by","doctype","category"]${currentSort && currentSortDirection
                        ? "&order_by=" + currentSort + " " + currentSortDirection
                        : ""
                    }`,
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

                    // ? SET INITIAL LOADING FALSE
                    setInitialLoading(false);
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

                {/* CREATE CATEGORY */}
                <div className="create-todo-container">
                    <CreateCategory
                        handleSaveCategory={handleSaveCategory}
                        allCategories={getAllCategories}
                    />
                </div>
                {/* END CREATE CATEGORY */}

                {/* DASHBOARD */}
                <div className="dashboard-list-view-container">

                    {/* UTILS BAR */}
                    <div className="utils-container flex justify-start gap-5 py-1 px-4 sm:px-5">

                        {/* SORT */}
                        <div className="sort-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm">

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
                                <div className="heading text-center lg:w-auto lg:col-span-7 xl:col-span-9 xxl:col-span-11">
                                    Title
                                </div>
                                <div className="heading text-center lg:col-span-1 justify-self-center">
                                    Delete
                                </div>
                            </div>
                            {/* END LIST HEADINGS */}

                            {/* LIST VIEW ITEMS */}
                            {!initialLoading && (getAllCategories.length !== 0 ? getAllCategories.map((item, index) => (
                                <CategoryItem
                                    key={index}
                                    CategoryData={item}
                                    handleSaveCategory={handleSaveCategory}
                                    handleDeleteCategory={handleDeleteCategory}
                                />
                            )) :
                                (<>
                                    <div className="text-center my-20 sm:my-20 font-semibold">
                                        No QuickDos Categories Are Available Please Create One!
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

            </div >
            {/* END DASHBOARD CONTAINER */}

        </>
    )
}

export default CategoryView