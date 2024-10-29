import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineStar } from "react-icons/hi2";
import { BiSolidStar } from "react-icons/bi";
import DropdownMultiSelect from "./DropdownMultiSelect";
import {
    useAllCategories,
    ListItemProps,
    Status,
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
import { RxCross1 } from "react-icons/rx";

const ListItem = (props: ListItemProps) => {

    //? HOOKS
    const [status, setStatus] = useState<Status>(props.todoData.status);
    const [is_important, setIs_important] = useState<boolean>(props.todoData.is_important);
    const [description, setDescription] = useState<string>(props.todoData.description);
    const [date, setdate] = useState<string>(props.todoData.date);
    const [categories, setCategories] = useState<useAllCategories[]>(props.todoData.categories);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [allCategories, setAllCategories] = useState<useAllCategories[]>(props.allCategories);


    //? STATUS HANDLER
    const handleStatus = (status: Status) => {
        if (status === "Open") {
            setStatus("Completed");
        } else if (status === "Completed") {
            setStatus("Cancelled");
        } else {
            setStatus("Open");
        }
    }

    //? UPDATE CATEGORIES DATA AS PROP DATA CHANGES
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);

    //? UPDATE THE LIST DATA AS MAIN DATA UPDATES
    useEffect(() => {
        setStatus(props.todoData.status);
        setIs_important(props.todoData.is_important);
        setDescription(props.todoData.description);
        setdate(props.todoData.date);
        setCategories(props.todoData.categories);
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
            status: status,
            is_important: is_important,
            send_reminder: props.todoData.send_reminder,
            description: description,
            date: date,
            categories: categories,
        });
    };

    //? UPDATE THE SELECTED CATEGORIES HANDLER
    const handleCategories = (data: useAllCategories[]) => {
        setCategories(data);
    };

    //? HANDLE SET DATE
    const handleSetDate = (e: any) => {
        const year = e?.getFullYear();
        const month = String(e?.getMonth() + 1).padStart(2, '0'); // Add 1 to get the correct month
        const day = String(e?.getDate()).padStart(2, '0');

        //? FORMAT DATE AS YYYY-MM-DD
        const formattedDate = e ? `${year}-${month}-${day}` : "";

        setdate(formattedDate); // Updates the selected date state
    };

    //? SAVE ON STATUS CHANGE
    useEffect(() => {
        if (status !== props.todoData.status) {
            handleSaveToDo();
        }
    }, [status]);

    //? SAVE ON PRIORITY CHANGE
    useEffect(() => {
        if (is_important !== props.todoData.is_important) {
            handleSaveToDo();
        }
    }, [is_important]);

    //? SAVE ON DUE DATE CHANGE
    useEffect(() => {
        const debouncingDueDate = setTimeout(() => {
            if (date !== props.todoData.date) {
                handleSaveToDo();
            }
        }, 500);

        return () => clearTimeout(debouncingDueDate);
    }, [date]);

    //? SAVE ON CATEGORIES CHANGE
    useEffect(() => {
        if (categories !== props.todoData.categories) {
            handleSaveToDo();
        }
    }, [categories]);

    return (
        <>
            {/* LIST ITEMS */}
            <div className="list-items scale-animation rounded-md border-gray-300 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] my-2 py-2 px-4 sm:py-3 flex justify-between lg:grid sm:gap-y-2 sm:gap-x-5  lg:grid-cols-8 xl:grid-cols-10 xxl:grid-cols-12 items-center">

                {/* EDIT AND CLOSE TASK */}
                <div className="item flex justify-start items-center gap-1 sm:gap-5 w-[85%] sm:w-[80%] text-center lg:w-auto lg:col-span-3 xl:col-span-5 xxl:col-span-7">
                    <button
                        className={`complete min-h-[18px] sm:min-h-5 min-w-[18px] sm:min-w-5 align-middle hover:bg-gray-100-todo-button bg-transparent rounded-full p-0.5 w-fit text-xs sm:text-sm border border-gray-600 cursor-pointer`}
                        title="Complete"
                        onClick={() => {
                            handleStatus(status);
                        }}
                    >
                        <FaCheck
                            className={`${status === "Completed" ? "show" : "hidden"}`}
                        />
                        <RxCross1 
                            className={`${status === "Cancelled" ? "show" : "hidden"}`}
                        />
                    </button>
                    <div className="input w-full">
                        <input
                            type="text"
                            className="outline-0 placeholder:text-gray-700 py-1.5 px-2 w-full"
                            name="ToDo"
                            id="ToDo"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
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
                                    {date ? (date) : (
                                        "Pick Due Date"
                                    )}
                                </h3>
                                <div className="due-data cursor-pointer">
                                    <PiCalendarDotsLight
                                        className={`text-xl mt-0.5 ${date ? "hidden" : "show"}`}
                                    />
                                    <PiCalendarCheckFill
                                        className={`text-xl mt-0.5 ${date ? "show" : "hidden"}`}
                                    />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={(new Date(date))}
                                onSelect={handleSetDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                {/* END DUE DATE */}

                {/* IMPORTANCE */}
                <div className="item hidden lg:block lg:col-span-1 justify-self-center">
                    <button
                        className="importance cursor-pointer align-middle"
                        onClick={() => {
                            setIs_important(!is_important);
                        }}
                    >
                        <HiOutlineStar
                            className={`${is_important ? "hidden" : "show"} text-2xl`}
                        />
                        <BiSolidStar
                            className={`${is_important ? "show" : "hidden"} text-2xl`}
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
                        categories={categories}
                        handleCategories={handleCategories}
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
