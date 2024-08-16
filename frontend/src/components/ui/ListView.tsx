import { useEffect, useState } from "react";
import ListItem from "./ListItem"

//? ALL CATEGORIES 
interface useGetAllCategories {
    category: string;
}

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
//? PROPS
type Props = {
    allTodoData: useAllTodoData[],
    allCategories: useGetAllCategories[],
    handleSaveToDo: (data: useAllTodoData) => void,
    handleDeleteTodo: (data: string) => void,
}


const ListView = (props: Props) => {

    //? HOOKS
    //? SET CATEGORY API DATA
    const [getAllCategories, setGetAllCategories] = useState<useGetAllCategories[]>(props?.allCategories || "[]");
    //? UPDATE CATEGORIES AS PROPS DATA CHANGES 
    useEffect(() => {
        setGetAllCategories(props.allCategories);
    }, [props.allCategories]);

    //? SET ALL TODO API DATA
    const [allTodoData, setAllTodoData] = useState<useAllTodoData[]>(props?.allTodoData || "[]")
    //? UPDATE THE STATE AS PROPS DATA CHANGES
    useEffect(() => {
        setAllTodoData(props.allTodoData);
    }, [props.allTodoData]);



    return (
        <>
            {/* LIST VIEW */}
            <div className="list-view-container pt-0 p-4 sm:pt-0 md:pt-0 sm:p-5 w-full">
                <div className="list-view bg-white  flex flex-col rounded-md">
                    {/* LIST HEADINGS */}
                    <div className="list-heading font-medium border-b border-gray-300 sm:font-semibold pb-2 px-1.5 sm:px-3 flex justify-between lg:grid  gap-1 sm:gap-y-2 sm:gap-x-5 lg:grid-cols-8 xl:grid-cols-10 xxl:grid-cols-12 items-center justify-items-center">
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
                    {allTodoData.map((item, index) => (
                        <ListItem key={index} todoData={item} allCategories={getAllCategories} handleSaveToDo={props.handleSaveToDo} handleDeleteTodo={props.handleDeleteTodo} />
                    ))}
                    {/* END LIST VIEW ITEMS */}
                </div>
            </div>
            {/* END LIST VIEW */}
        </>
    )
}

export default ListView