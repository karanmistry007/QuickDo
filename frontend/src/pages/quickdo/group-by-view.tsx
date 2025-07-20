import { useEffect, useState } from "react";
import CreateQuickDo from "@/components/ui/create-quickdo";
import QuickDoItem from "@/components/layout/quickdo-item";
import {
    useAllQuickDoData,
    DashboardProps,
} from "@/types/Common";
import { toast } from 'sonner'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { IoChevronDownOutline } from "react-icons/io5";
import { addQuickDo, deleteQuickDo, fetchQuickDos, updateQuickDo } from "@/utils/quickdo";
import { fetchCategoryList } from "@/utils/quickdo-category";
import Filters from "@/components/layout/filters";
import Sort from "@/components/layout/sort";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import {
    useStatusFilterData,
    createFilterHandler,
    createClearFiltersHandler,
} from "@/utils/filter-utils"


const GroupByView = (props: DashboardProps) => {

    // ? HOOKS
    const [currentSort, setCurrentSort] = useState("creation");
    const [currentSortDirection, setCurrentSortDirection] = useState("desc");
    const [filters, setFilters] = useState<any[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshState, setRefreshState] = useState(true);
    const [getAllCategories, setGetAllCategories] = useState<any[]>([]);
    const [isCollapseOpen, setIsCollapseOpen] = useState<boolean>(true);
    const [isCollapseCompleted, setIsCollapseCompleted] = useState<boolean>(true);
    const [isCollapseCancelled, setIsCollapseCancelled] = useState<boolean>(true);

    //? ALL TODO API DATA
    const [allTodoData, setAllTodoData] = useState<any[]>([]);
    const [openQuickDoData, setOpenQuickDoData] = useState<useAllQuickDoData[]>([]);
    const [completedQuickDoData, setCompletedQuickDoData] = useState<useAllQuickDoData[]>([]);
    const [cancelledQuickDoData, setCancelledQuickDoData] = useState<useAllQuickDoData[]>([]);

    // ? DYNAMIC HANDLE FILTERS FUNCTION
    const handleFilters = createFilterHandler(setFilters);

    // ? HANDLE CLEAR FILTERS
    const handleClearFilters = createClearFiltersHandler(setFilters);

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

    //? FILTER OPEN, COMPLETED, AND CLOSED QUICKDO
    useEffect(() => {
        if (allTodoData) {
            setOpenQuickDoData(allTodoData.filter((item) => (item.status === "Open")))
            setCompletedQuickDoData(allTodoData.filter((item) => (item.status === "Completed")))
            setCancelledQuickDoData(allTodoData.filter((item) => (item.status === "Cancelled")))
        }
    }, [allTodoData])


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
                    <div className="list-view-container pt-0 p-4 sm:p-5 w-full">

                        {/* OPEN QUICKDO */}
                        <Collapsible
                            open={isCollapseOpen}
                            onOpenChange={setIsCollapseOpen}
                            className="my-2 py-2 border-b border-gray-300"
                        >
                            <div className="flex items-center justify-between space-x-4 w-full">
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start hover:bg-inherit border-0 shadow-none gap-2 text-base">
                                        <IoChevronDownOutline className={`${isCollapseOpen ? "" : "-rotate-90"} duration-150 text-lg`} />
                                        Open ({openQuickDoData.length})
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="">
                                {(openQuickDoData.length !== 0 ? openQuickDoData.map((item, index) => (
                                    <QuickDoItem
                                        key={index}
                                        todoData={item}
                                        allCategories={getAllCategories}
                                        handleSaveToDo={handleUpdateQuickDo}
                                        handleDeleteTodo={handleDeleteTodo}
                                    />
                                )) :
                                    (<>
                                        <div className="text-center my-20 sm:my-20 font-semibold">
                                            No Open QuickDos Are Available Please Create One!
                                        </div>
                                    </>))
                                }
                            </CollapsibleContent>
                        </Collapsible>

                        {/* COMPLETED QUICKDO */}
                        <Collapsible
                            open={isCollapseCompleted}
                            onOpenChange={setIsCollapseCompleted}
                            className="my-2 py-2 border-b border-gray-300"
                        >
                            <div className="flex items-center justify-between space-x-4 w-full">
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start hover:bg-inherit border-0 shadow-none gap-2 text-base">
                                        <IoChevronDownOutline className={`${isCollapseCompleted ? "" : "-rotate-90"} duration-150 text-lg`} />
                                        Completed ({completedQuickDoData.length})
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="">
                                {(completedQuickDoData.length !== 0 ? completedQuickDoData.map((item, index) => (
                                    <QuickDoItem
                                        key={index}
                                        todoData={item}
                                        allCategories={getAllCategories}
                                        handleSaveToDo={handleUpdateQuickDo}
                                        handleDeleteTodo={handleDeleteTodo}
                                    />
                                )) :
                                    (<>
                                        <div className="text-center my-20 sm:my-20 font-semibold">
                                            No Completed QuickDos Are Available Please Create One!
                                        </div>
                                    </>))
                                }
                            </CollapsibleContent>
                        </Collapsible>

                        {/* CANCELLED QUICKDO */}
                        <Collapsible
                            open={isCollapseCancelled}
                            onOpenChange={setIsCollapseCancelled}
                            className="my-2 py-2 border-b border-gray-300"
                        >
                            <div className="flex items-center justify-between space-x-4 w-full">
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start hover:bg-inherit border-0 shadow-none gap-2 text-base">
                                        <IoChevronDownOutline className={`${isCollapseCancelled ? "" : "-rotate-90"} duration-150 text-lg`} />
                                        Cancelled ({cancelledQuickDoData.length})
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="">
                                {(cancelledQuickDoData.length !== 0 ? cancelledQuickDoData.map((item, index) => (
                                    <QuickDoItem
                                        key={index}
                                        todoData={item}
                                        allCategories={getAllCategories}
                                        handleSaveToDo={handleUpdateQuickDo}
                                        handleDeleteTodo={handleDeleteTodo}
                                    />
                                )) :
                                    (<>
                                        <div className="text-center my-20 sm:my-20 font-semibold">
                                            No Cancelled QuickDos Are Available Please Create One!
                                        </div>
                                    </>))
                                }
                            </CollapsibleContent>
                        </Collapsible>
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

export default GroupByView;
