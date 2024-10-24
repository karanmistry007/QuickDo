import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineStar } from "react-icons/hi2";
import { BiSolidStar } from "react-icons/bi";
import DropdownMultiSelect from "./DropdownMultiSelect";
import {
    useGetAllCategories,
    ListItemProps,
} from "../../types/Common";
import QuickDoDrawer from "./QuickDoDrawer";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./button";
import { PiCalendarCheckFill, PiCalendarDotsLight } from "react-icons/pi";

const ListItem = (props: ListItemProps) => {

    //? HOOKS
    const [completeTodo, setCompleteTodo] = useState<boolean>(props.todoData.completeTodo);
    const [importantTodo, setImportantTodo] = useState<boolean>(props.todoData.importantTodo);
    const [descriptionTodo, setDescriptionTodo] = useState<string>(props.todoData.descriptionTodo);
    const [selectDueDate, setSelectDueDate] = useState<string>(props.todoData.selectDueDate);
    const [selectedCategories, setSelectedCategories] = useState<useGetAllCategories[]>(props.todoData.selectedCategories);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [allCategories, setAllCategories] = useState<useGetAllCategories[]>(props.allCategories);

    //? UPDATE CATEGORIES DATA AS PROP DATA CHANGES
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);

    //? UPDATE THE LIST DATA AS MAIN DATA UPDATES
    useEffect(() => {
        setCompleteTodo(props.todoData.completeTodo);
        setImportantTodo(props.todoData.importantTodo);
        setDescriptionTodo(props.todoData.descriptionTodo);
        setSelectDueDate(props.todoData.selectDueDate);
        setSelectedCategories(props.todoData.selectedCategories);
        setShowCategories(false);
    }, [props.todoData]);

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
            isSendReminder: props.todoData.isSendReminder,
            descriptionTodo: descriptionTodo,
            selectDueDate: selectDueDate,
            selectedCategories: selectedCategories,
        });
    };

    //? UPDATE THE SELECTED CATEGORIES HANDLER
    const handleSelectedCategories = (data: useGetAllCategories[]) => {
        setSelectedCategories(data);
    };

    //? HANDLE SET DATE
    const handleSetDate = (e: any) => {
        const year = e?.getFullYear();
        const month = String(e?.getMonth() + 1).padStart(2, '0'); // Add 1 to get the correct month
        const day = String(e?.getDate()).padStart(2, '0');

        //? FORMAT DATE AS YYYY-MM-DD
        const formattedDate = e ? `${year}-${month}-${day}` : "";

        setSelectDueDate(formattedDate); // Updates the selected date state
    };

    //? SAVE ON STATUS CHANGE
    useEffect(() => {
        if (completeTodo !== props.todoData.completeTodo) {
            handleSaveToDo();
        }
    }, [completeTodo]);

    //? SAVE ON PRIORITY CHANGE
    useEffect(() => {
        if (importantTodo !== props.todoData.importantTodo) {
            handleSaveToDo();
        }
    }, [importantTodo]);

    //? SAVE ON DUE DATE CHANGE
    useEffect(() => {
        const debouncingDueDate = setTimeout(() => {
            if (selectDueDate !== props.todoData.selectDueDate) {
                handleSaveToDo();
            }
        }, 500);

        return () => clearTimeout(debouncingDueDate);
    }, [selectDueDate]);

    //? SAVE ON CATEGORIES CHANGE
    useEffect(() => {
        if (selectedCategories !== props.todoData.selectedCategories) {
            handleSaveToDo();
        }
    }, [selectedCategories]);

    return (
        <>
            {/* LIST ITEMS */}
            <div className="list-items scale-animation rounded-md border-gray-300 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] my-2 py-2 px-4 sm:py-3 flex justify-between lg:grid sm:gap-y-2 sm:gap-x-5  lg:grid-cols-8 xl:grid-cols-10 xxl:grid-cols-12 items-center">

                {/* EDIT AND CLOSE TASK */}
                <div className="item flex justify-start items-center gap-1 sm:gap-5 w-[85%] sm:w-[80%] text-center lg:w-auto lg:col-span-3 xl:col-span-5 xxl:col-span-7">
                    <button
                        className={`complete align-middle hover:bg-gray-100-todo-button bg-transparent rounded-full p-0.5 w-fit text-xs sm:text-sm border border-gray-600 cursor-pointer`}
                        title="Complete"
                        onClick={() => {
                            setCompleteTodo(!completeTodo);
                        }}
                    >
                        <FaCheck
                            className={`${completeTodo ? "opacity-1" : "opacity-0"}`}
                        />
                    </button>
                    <div className="input w-full">
                        <input
                            type="text"
                            className="outline-0 placeholder:text-gray-700 py-1.5 px-2 w-full"
                            name="ToDo"
                            id="ToDo"
                            value={descriptionTodo}
                            onChange={(e) => {
                                setDescriptionTodo(e.target.value);
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                handleSaveToDo();
                            }}
                        />
                    </div>
                </div>
                {/* EDIT AND CLOSE TASK */}

                {/* DUE DATE */}

                <div className="item hidden lg:block lg:col-span-2 justify-self-center">

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"transparent"}
                                className={"w-auto pl-3 flex gap-1.5 items-center justify-center"}
                            >
                                <h3 className="font-normal text-base">
                                    {selectDueDate ? (selectDueDate) : (
                                        "Pick Due Date"
                                    )}
                                </h3>
                                <div className="due-data cursor-pointer">
                                    <PiCalendarDotsLight
                                        className={`text-xl mt-0.5 ${selectDueDate ? "hidden" : "show"}`}
                                    />
                                    <PiCalendarCheckFill
                                        className={`text-xl mt-0.5 ${selectDueDate ? "show" : "hidden"}`}
                                    />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={(new Date(selectDueDate))}
                                onSelect={handleSetDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    {/* <div className="due-date">
                        <input
                            className="outline-0 cursor-pointer rounded-md px-1 w-[124px]"
                            type="date"
                            name="Date"
                            id="Date"
                            value={selectDueDate}
                            onChange={(e) => {
                                setSelectDueDate(e.target.value);
                            }}
                        />
                    </div> */}
                </div>
                {/* END DUE DATE */}

                {/* IMPORTANCE */}
                <div className="item hidden lg:block lg:col-span-1 justify-self-center">
                    <button
                        className="importance cursor-pointer align-middle"
                        onClick={() => {
                            setImportantTodo(!importantTodo);
                        }}
                    >
                        <HiOutlineStar
                            className={`${importantTodo ? "hidden" : "show"} text-2xl`}
                        />
                        <BiSolidStar
                            className={`${importantTodo ? "show" : "hidden"} text-2xl`}
                        />
                    </button>
                </div>
                {/* END IMPORTANCE */}

                {/* CATEGORIES */}
                <div className="item hidden lg:block lg:col-span-1 justify-self-center">

                    {/* CATEGORIES MULTISELECT */}
                    <DropdownMultiSelect
                        position={"left"}
                        showCategories={showCategories}
                        allCategories={allCategories}
                        selectedCategories={selectedCategories}
                        handleSelectedCategories={handleSelectedCategories}
                    />
                    {/* END CATEGORIES MULTISELECT */}

                </div>
                {/* END CATEGORIES */}

                {/* MORE */}
                <QuickDoDrawer
                    todoData={props.todoData}
                    allCategories={allCategories}
                    handleSaveToDo={props.handleSaveToDo}
                    handleDeleteTodo={props.handleDeleteTodo}
                />
                {/* END MORE */}

            </div>
            {/* END LIST ITEMS */}
        </>
    );
};

export default ListItem;
