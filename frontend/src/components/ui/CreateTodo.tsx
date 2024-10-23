import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { PiBellRingingLight } from "react-icons/pi";
import { PiBellRingingFill } from "react-icons/pi";
import { IoInformationCircle } from "react-icons/io5";
import { PiCalendarDotsLight } from "react-icons/pi";
import { PiCalendarCheckFill } from "react-icons/pi";
import DropdownMultiSelect from "./DropdownMultiSelect";
import { useGetAllCategories, CreateTodoProps } from "../../types/Common";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";

const CreateTodo = (props: CreateTodoProps) => {

    //? HOOKS
    const [completeTodo, setCompleteTodo] = useState<boolean>(false);
    const [importantTodo, setImportantTodo] = useState<boolean>(false);
    const [descriptionTodo, setDescriptionTodo] = useState<string>("");
    const [isSendReminder, setIsSendReminder] = useState<boolean>(false);
    const [selectDueDate, setSelectDueDate] = useState<string>("");
    const [selectedCategories, setSelectedCategories] = useState<useGetAllCategories[]>([]);
    const [allCategories, setAllCategories] = useState<useGetAllCategories[]>(props.allCategories || "[]");
    const [saveNewTodo, setSaveNewTodo] = useState<boolean>(false);
    const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);

    //? SET MOBILE SCREEN
    const [isMobileScreen, setIsMobileScreen] = useState<boolean>(window.innerWidth < 640 ? true : false);

    useEffect(() => {
        //? SET SCREEN WIDTH HANDLER
        const screenWidthHandler = () => {
            if (window.innerWidth < 640) {
                setIsMobileScreen(true);
            } else {
                setIsMobileScreen(false);
            }
        };
        screenWidthHandler();
        window.addEventListener("resize", screenWidthHandler);
    }, [window.screen.width]);

    //? SAVE TODO HANDLER
    const handleSaveTodo = () => {
        //? IF THE TODO DESCRIPTION EXISTS
        if (descriptionTodo) {
            //? SET THE TICK MARK
            setSaveNewTodo(true);

            //? SAVE TODO DATA
            props.handleNewToDo({
                name: "",
                completeTodo: completeTodo,
                importantTodo: importantTodo,
                isSendReminder: isSendReminder,
                descriptionTodo: descriptionTodo,
                selectDueDate: selectDueDate,
                selectedCategories: selectedCategories,
            });

            //? RESET ALL OF THE STATES
            setTimeout(() => {
                setSaveNewTodo(false);
                setCompleteTodo(false);
                setImportantTodo(false);
                setDescriptionTodo("");
                setIsSendReminder(false);
                setSelectDueDate("");
                setSelectedCategories([]);
            }, 200);
        }
    };

    //? UPDATE CATEGORIES AS PER NEW ARE ADDED
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);

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

    return (
        <>
            {/* CREATE TODO */}
            <div className="create-todo-container p-4 sm:p-5 w-full">
                <div className="create-todo bg-white py-2 px-4 sm:p-5 flex flex-col shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md">

                    {/* ROW 1 */}
                    <div className="row-1 flex gap-1 sm:gap-5 justify-between items-center">

                        {/* SAVE TICK BOX */}
                        <div
                            className={`save hover:bg-gray-100-todo-button bg-transparent rounded-full p-0.5 w-fit text-xs sm:text-sm border border-gray-600 cursor-pointer`}
                            onClick={() => {
                                handleSaveTodo();
                            }}
                            title="Create"
                        >
                            <FaCheck
                                className={`${saveNewTodo ? "opacity-1" : "opacity-0"}`}
                            />
                        </div>
                        {/* END SAVE TICK BOX */}

                        {/* TODO INPUT BOX */}
                        <input
                            type="text"
                            className="outline-0 placeholder:text-gray-700 py-1.5 px-2 w-full"
                            placeholder="Add a QuickDo..."
                            name="createTodo"
                            id="createTodo"
                            value={descriptionTodo}
                            onChange={(e) => {
                                setDescriptionTodo(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                e.key === "Enter" ? handleSaveTodo() : "";
                            }}
                        />
                        {/* END TODO INPUT BOX */}

                        {/* MORE BUTTON */}
                        <div
                            className="show-more text-2xl"
                            onClick={() => {
                                setShowMoreOptions(!showMoreOptions);
                            }}
                        >
                            <IoInformationCircle
                                className={`${isMobileScreen ? "show" : "hidden"}`}
                            />
                        </div>
                        {/* END MORE BUTTON */}

                    </div>
                    {/* END ROW 1 */}

                    {/* ROW 2 */}
                    <div
                        className={`row-2 flex gap-2.5 sm:gap-5 justify-start items-center sm:mt-2.5 pt-2 sm:pt-2.5 border-t ${isMobileScreen ? (showMoreOptions ? "show" : "hidden") : "show"}`}
                    >

                        {/* DUE DATE PICKER */}
                        <div className="due-date relative cursor-pointer">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="todo-due-data flex items-center cursor-pointer select-none">
                                        <div className="due-data cursor-pointer">
                                            <PiCalendarDotsLight
                                                className={`text-2xl ${selectDueDate ? "hidden" : "show"}`}
                                            />
                                            <PiCalendarCheckFill
                                                className={`text-2xl ${selectDueDate ? "show" : "hidden"}`}
                                            />
                                        </div>
                                    </button>
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
                        </div>
                        {/* END DUE DATE PICKER */}

                        {/* REMINDER */}
                        <button
                            className="send-reminder text-2xl"
                            onClick={() => {
                                setIsSendReminder(!isSendReminder);
                            }}
                            title="Reminder"
                        >
                            <PiBellRingingLight
                                className={`${isSendReminder ? "hidden" : "show"}`}
                            />
                            <PiBellRingingFill
                                className={`${isSendReminder ? "show" : "hidden"}`}
                            />
                        </button>
                        {/* END REMINDER */}

                        {/* CATEGORIES MULTISELECT */}
                        <DropdownMultiSelect
                            position={"right"}
                            showCategories={showCategories}
                            allCategories={allCategories}
                            selectedCategories={selectedCategories}
                            handleSelectedCategories={handleSelectedCategories}
                        />
                        {/* END CATEGORIES MULTISELECT */}

                    </div>
                    {/* END ROW 2 */}

                </div>
            </div>
            {/* END CREATE TODO */}
        </>
    );
};

export default CreateTodo;
