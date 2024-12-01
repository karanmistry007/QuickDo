import React from "react";
import QuickDoItem from "@/components/layout/quickdo-item";

interface ListViewProps {
    allTodoData: any[];
    getAllCategories: any[];
    initialLoading: boolean;
    handleUpdateQuickDo: (data: any) => void;
    handleDeleteTodo: (id: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ allTodoData, getAllCategories, initialLoading, handleUpdateQuickDo, handleDeleteTodo }) => {
    return (
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
                            No QuickDos Are Available Please Create One!
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ListView;
