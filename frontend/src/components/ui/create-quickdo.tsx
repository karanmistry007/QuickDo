import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { PiBellRingingLight } from "react-icons/pi";
import { PiBellRingingFill } from "react-icons/pi";
import { IoInformationCircle } from "react-icons/io5";
import { PiCalendarDotsLight } from "react-icons/pi";
import { PiCalendarCheckFill } from "react-icons/pi";
import DropdownMultiSelect from "./dropdown-multiselect";
import { useAllCategories, CreateTodoProps, Status } from "../../types/Common";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const CreateQuickDo = (props: CreateTodoProps) => {

    //? HOOKS
    const [status, setStatus] = useState<Status>("Open");
    const [is_important, setIs_important] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const [send_reminder, setSend_reminder] = useState<boolean>(false);
    const [date, setdate] = useState<string>("");
    const [categories, setCategories] = useState<useAllCategories[]>([]);
    const [allCategories, setAllCategories] = useState<useAllCategories[]>(props.allCategories || "[]");
    const [saveNewTodo, setSaveNewTodo] = useState<boolean>(false);
    const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);

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
        if (description) {
            //? SET THE TICK MARK
            setSaveNewTodo(true);

            //? SAVE TODO DATA
            props.handleNewToDo({
                name: "",
                status: status,
                is_important: is_important,
                send_reminder: send_reminder,
                description: description,
                date: date,
                categories: categories,
            });

            //? RESET ALL OF THE STATES
            // setTimeout(() => {
            setSaveNewTodo(false);
            setStatus("Open");
            setIs_important(false);
            setDescription("");
            setSend_reminder(false);
            setdate("");
            setCategories([]);
            // }, 200);
        }
    };

    //? UPDATE CATEGORIES AS PER NEW ARE ADDED
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);

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
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
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
                                                className={`text-2xl ${date ? "hidden" : "show"}`}
                                            />
                                            <PiCalendarCheckFill
                                                className={`text-2xl ${date ? "show" : "hidden"}`}
                                            />
                                        </div>
                                    </button>
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
                        {/* END DUE DATE PICKER */}

                        {/* REMINDER */}
                        <button
                            className="send-reminder text-2xl"
                            onClick={() => {
                                setSend_reminder(!send_reminder);
                            }}
                            title="Reminder"
                        >
                            <PiBellRingingLight
                                className={`${send_reminder ? "hidden" : "show"}`}
                            />
                            <PiBellRingingFill
                                className={`${send_reminder ? "show" : "hidden"}`}
                            />
                        </button>
                        {/* END REMINDER */}

                        {/* CATEGORIES MULTISELECT */}
                        <DropdownMultiSelect
                            position={"right"}
                            showCategories={false}
                            allCategories={allCategories}
                            categories={categories}
                            handleCategories={handleCategories}
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

export default CreateQuickDo;
