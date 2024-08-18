import { FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
    PiBellRingingLight,
    PiCalendarCheckFill,
    PiCalendarDotsLight,
    PiListBullets,
    PiListChecks,
} from "react-icons/pi";
import { PiBellRingingFill } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineStar } from "react-icons/hi2";
import { BiSolidStar } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import ConfirmBox from "./ConfirmBox";
import { useGetAllCategories, DrawerProps } from "../../types/Common";


const Drawer = (props: DrawerProps) => {

    //? HOOKS
    const [completeTodo, setCompleteTodo] = useState<boolean>(props.todoData.completeTodo);
    const [importantTodo, setImportantTodo] = useState<boolean>(props.todoData.importantTodo);
    const [isSendReminder, setIsSendReminder] = useState<boolean>(props.todoData.isSendReminder);
    const [descriptionTodo, setDescriptionTodo] = useState<string>(props.todoData.descriptionTodo);
    const [selectDueDate, setSelectDueDate] = useState<string>(props.todoData.selectDueDate);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<useGetAllCategories[]>(props.todoData.selectedCategories);
    const [allCategories, setAllCategories] = useState<useGetAllCategories[]>(props.allCategories);
    const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);

    //? DELETE BOX DISPLAY HANDLER
    const handleDeleteBoxDisplay = (display: boolean) => {
        setShowDeleteBox(display);
    };

    //? DELETE TODO HANDLER
    const handleDeleteTodo = () => {
        props.handleDeleteTodo(props.todoData.name || "");
        props.handleDrawerDisplay(false);
    };

    //? UPDATE CATEGORIES AS PROPS UPDATES
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);

    //? UPDATE TODO
    const handleSaveToDo = () => {
        props.handleSaveToDo({
            name: props.todoData.name,
            owner: props.todoData.owner,
            creation: props.todoData.creation,
            modified: props.todoData.modified,
            modified_by: props.todoData.modified_by,
            completeTodo: completeTodo,
            importantTodo: importantTodo,
            isSendReminder: isSendReminder,
            descriptionTodo: descriptionTodo,
            selectDueDate: selectDueDate,
            selectedCategories: selectedCategories,
        });
    };

    //? CATEGORIES MULTISELECT HANDLER
    const handleCategoryMultiSelect = (category: string) => {
        setSelectedCategories((prevCategories) => {
            if (prevCategories.some((item) => item.category === category)) {
                return prevCategories.filter((item) => item.category !== category);
            } else {
                return [...prevCategories, { category }];
            }
        });
    };

    return (
        <>
            {/* DRAWER CONTAINER */}
            <div
                className={`drawer-container bg-[#00000048] w-[100dvw] h-[100dvh] fixed left-0 top-0 z-50`}
            >

                {/* DRAWER */}
                <div className="drawer bg-[#00000046]  backdrop-blur-[2px] py-5 px-10 w-[100dvw] h-[100dvh] sm:w-[70dvw] md:w-[50dvw] lg:w-[40dvw] xl:w-[30dvw] ml-auto sm:rounded-s-3xl">
                    
                    {/* DRAWER COLLAPSE */}
                    <div className="drawer-navbar w-[calc(100%_-_80px)] pb-5 absolute">
                        <div className="nav-container flex justify-between  ">
                            <div
                                className="drawer-collapse w-fit p-1.5 bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-full text-xl cursor-pointer"
                                onClick={() => {
                                    handleSaveToDo(), props.handleDrawerDisplay(false);
                                }}
                            >
                                <FaAngleRight />
                            </div>
                            <div
                                className="delete-todo w-fit p-1.5 bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-full text-xl cursor-pointer"
                                onClick={() => {
                                    handleDeleteBoxDisplay(true);
                                }}
                            >
                                <BsTrash />
                            </div>
                        </div>
                    </div>
                    {/* END DRAWER COLLAPSE */}

                    <div className="drawer-content h-full flex flex-col justify-center gap-5 sm:mt-5">
                        
                        {/* TODO DESCRIPTION */}
                        <div className="todo-description bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md">
                            <input
                                type="text"
                                className="outline-0 placeholder:text-gray-700 py-1.5 px-2 sm:py-2 sm:px-3 w-full rounded-md"
                                name="ToDo"
                                id="ToDo"
                                value={descriptionTodo}
                                onChange={(e) => {
                                    setDescriptionTodo(e.target.value);
                                }}
                            />
                        </div>
                        {/* END TODO DESCRIPTION */}

                        {/* COMPLETE TODO */}
                        <div
                            className="todo-complete flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 gap-2 cursor-pointer select-none shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md"
                            onClick={() => {
                                setCompleteTodo(!completeTodo);
                            }}
                            title="Complete"
                        >
                            <div
                                className={`save hover:bg-gray-100-todo-button bg-transparent rounded-full p-0.5 w-fit text-xs sm:text-sm border border-gray-600 cursor-pointer`}
                            >
                                <FaCheck
                                    className={`${completeTodo ? "opacity-1" : "opacity-0"}`}
                                />
                            </div>
                            <div className="text">
                                <h3>Complete ToDo</h3>
                            </div>
                        </div>
                        {/* END COMPLETE TODO */}

                        {/* TODO IMPORTANCE */}
                        <div
                            className="todo-importance flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none"
                            onClick={() => {
                                setImportantTodo(!importantTodo);
                            }}
                        >
                            <div className="importance cursor-pointer">
                                <HiOutlineStar
                                    className={`${importantTodo ? "hidden" : "show"} text-2xl`}
                                />
                                <BiSolidStar
                                    className={`${importantTodo ? "show" : "hidden"} text-2xl`}
                                />
                            </div>
                            <h3>Importance</h3>
                        </div>
                        {/* END TODO IMPORTANCE */}

                        {/* TODO REMINDER */}
                        <div
                            className="todo-reminder flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none"
                            onClick={() => {
                                setIsSendReminder(!isSendReminder);
                            }}
                            title="Reminder"
                        >
                            <button className="send-reminder text-2xl">
                                <PiBellRingingLight
                                    className={`${isSendReminder ? "hidden" : "show"}`}
                                />
                                <PiBellRingingFill
                                    className={`${isSendReminder ? "show" : "hidden"}`}
                                />
                            </button>
                            <h3>Reminder</h3>
                        </div>
                        {/* END TODO REMINDER */}

                        {/* TODO DUE DATE */}
                        <div className="todo-due-data flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none">
                            <div className="due-data cursor-pointer">
                                <PiCalendarDotsLight
                                    className={`text-2xl ${selectDueDate ? "hidden" : "show"}`}
                                />
                                <PiCalendarCheckFill
                                    className={`text-2xl ${selectDueDate ? "show" : "hidden"}`}
                                />
                            </div>
                            <input
                                type="date"
                                className="outline-0 w-[124px] cursor-pointer"
                                name="dueDate"
                                id="dueDate"
                                value={selectDueDate}
                                onChange={(e) => {
                                    setSelectDueDate(e.target.value);
                                }}
                            />
                        </div>
                        {/* END TODO DUE DATE */}

                        {/* TODO CATEGORIES */}
                        <div className="todo-categories bg-white py-1.5 px-2 sm:py-2 sm:px-3 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none relative">
                            <div
                                className="todo-categories flex item-center gap-2 border-b border-gray-200 pb-2"
                                onClick={() => {
                                    setShowCategories(!showCategories);
                                }}
                                title="Categories"
                            >

                                {/* CATEGORIES ICON */}
                                <button className="categories text-2xl">
                                    <PiListBullets
                                        className={`${selectedCategories.length == 0 ? "show" : "hidden"
                                            }`}
                                    />
                                    <PiListChecks
                                        className={`${selectedCategories.length == 0 ? "hidden" : "show"
                                            }`}
                                    />
                                </button>
                                {/* END CATEGORIES ICON */}
                                <h3>Categories</h3>
                            </div>

                            {/* CATEGORIES ITEMS DROPDOWN*/}
                            <div
                                className={`categories-items bg-white p-1 rounded-md grid grid-cols-2 gap-1 justify-center max-h-[400px] overflow-y-auto`}
                            >
                                {allCategories.map((data, index) => (
                                    <div
                                        key={data.category + index}
                                        className={`category cursor-pointer flex select-none justify-start items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md ${selectedCategories.some(
                                            (item) => item["category"] === data.category
                                        )
                                            ? "bg-slate-100"
                                            : ""
                                            }`}
                                        onClick={() => handleCategoryMultiSelect(data.category)}
                                    >
                                        <div
                                            className={`save-todo-button bg-transparent rounded-full p-0.5 w-fit text-[10px] border border-gray-600 cursor-pointer`}
                                        >
                                            <FaCheck
                                                className={`${selectedCategories.some(
                                                    (item) => item["category"] === data.category
                                                )
                                                    ? "opacity-1"
                                                    : "opacity-0"
                                                    }`}
                                            />
                                        </div>
                                        <div className="category-text">{data.category}</div>
                                    </div>
                                ))}
                            </div>
                            {/* END CATEGORIES ITEMS DROPDOWN */}
                            
                        </div>
                        {/* END TODO CATEGORIES */}

                    </div>

                </div>
                {/* END DRAWER */}

            </div>
            {/* END DRAWER CONTAINER */}

            {/* CONFIRM BOX */}
            {showDeleteBox && (
                <ConfirmBox
                    confirmMessage={"Are you sure you want to delete?"}
                    handleConfirmBoxDisplay={handleDeleteBoxDisplay}
                    handleSuccess={handleDeleteTodo}
                />
            )}
            {/* END CONFIRM BOX */}
        </>
    );
};

export default Drawer;
