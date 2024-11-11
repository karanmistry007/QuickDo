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
import ConfirmBox from "./confirm";
import { useAllCategories, DrawerProps, Status } from "../../types/Common";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { Button } from "./button";
import { IoInformationCircle } from "react-icons/io5";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "./textarea";
import { RxCross1 } from "react-icons/rx";


const QuickDoDrawer = (props: DrawerProps) => {

    //? HOOKS
    const [status, setStatus] = useState<Status>(props.todoData.status);
    const [is_important, setIs_important] = useState<boolean>(props.todoData.is_important);
    const [send_reminder, setSend_reminder] = useState<boolean>(props.todoData.send_reminder);
    const [description, setDescription] = useState<string>(props.todoData.description);
    const [date, setdate] = useState<string>(props.todoData.date);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [categories, setCategories] = useState<useAllCategories[]>(props.todoData.categories);
    const [allCategories, setAllCategories] = useState<useAllCategories[]>(props.allCategories);
    const [autoOpenDrawer, setAutoOpenDrawer] = useState<boolean>(props.autoOpenDrawer || false);

    //? DELETE TODO HANDLER
    const handleDeleteTodo = () => {
        props.handleDeleteTodo(props.todoData.name || "");
    };

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


    // ? UPDATE DATA AS PROPS CHANGES
    useEffect(() => {

        setStatus(props.todoData.status);
        setIs_important(props.todoData.is_important);
        setSend_reminder(props.todoData.send_reminder);
        setDescription(props.todoData.description);
        setdate(props.todoData.date);
        setCategories(props.todoData.categories);

    }, [props.todoData]);

    //? UPDATE CATEGORIES AS PROPS UPDATES
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);

    //? UPDATE AUTO OPEN DRAWER AS PER THE PARENT
    useEffect(() => {
        setAutoOpenDrawer(props.autoOpenDrawer || false);
    }, [props.autoOpenDrawer])

    //? HANDLE SET DATE
    const handleSetDate = (e: any) => {
        const year = e?.getFullYear();
        const month = String(e?.getMonth() + 1).padStart(2, '0');
        const day = String(e?.getDate()).padStart(2, '0');

        //? FORMAT DATE AS YYYY-MM-DD
        const formattedDate = e ? `${year}-${month}-${day}` : "";

        setdate(formattedDate);
    };

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
            send_reminder: send_reminder,
            description: description,
            date: date,
            categories: categories,
        });
    };

    //? CATEGORIES MULTISELECT HANDLER
    const handleCategoryMultiSelect = (category: string) => {
        setCategories((prevCategories) => {
            if (prevCategories.some((item) => item.category === category)) {
                return prevCategories.filter((item) => item.category !== category);
            } else {
                return [...prevCategories, { category }];
            }
        });
    };

    return (
        <>
            <Drawer
                direction={"right"}
                onClose={() => { handleSaveToDo() }}
                open={autoOpenDrawer || undefined}
            >
                <DrawerTrigger asChild className={`${autoOpenDrawer && "hidden"}`}>
                    <Button variant="link" className="p-0 h-auto">
                        <IoInformationCircle className="text-2xl ml-auto sm:m-auto lg:m-0" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="right-0 left-auto px-5  w-[100dvw] h-[100dvh] sm:w-[70dvw] md:w-[50dvw] lg:w-[40dvw] xl:w-[30dvw] ml-auto">

                    <DrawerHeader className="text-left p-0 mt-5">
                        <DrawerTitle className="flex justify-between items-center">

                            <DrawerDescription className="hidden">
                                Drawer Description
                            </DrawerDescription>

                            <DrawerClose asChild>
                                <Button variant="outline" className="text-xl rounded-full p-2">
                                    <FaAngleRight />
                                </Button>
                            </DrawerClose>

                            <ConfirmBox
                                confirmTitle={"Delete QuickDo"}
                                confirmMessage={"Are you sure you want to delete QuickDo?"}
                                handleSuccess={handleDeleteTodo}
                            />


                        </DrawerTitle>
                    </DrawerHeader>

                    <div className="drawer-content flex flex-col justify-center gap-5 mt-5">

                        {/* TODO DESCRIPTION */}
                        <div className="todo-description bg-white border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md hover:bg-gray-100">
                            <Textarea
                                autoFocus
                                className="w-full min-h-[64px]"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            ></Textarea>
                        </div>
                        {/* END TODO DESCRIPTION */}

                        {/* TODO DUE DATE */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="todo-due-data flex items-center bg-white py-0.5 px-2 sm:px-3 border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md cursor-pointer select-none hover:bg-gray-100">
                                    <div className="due-data cursor-pointer">
                                        <PiCalendarDotsLight
                                            className={`text-2xl ${date ? "hidden" : "show"}`}
                                        />
                                        <PiCalendarCheckFill
                                            className={`text-2xl ${date ? "show" : "hidden"}`}
                                        />
                                    </div>

                                    <Button
                                        variant={"transparent"}
                                        className={"w-auto pl-3"}
                                    >
                                        <h3 className="font-normal text-base">
                                            {date ? (date) : (
                                                "Pick Due Date"
                                            )}
                                        </h3>
                                    </Button>
                                </div>
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
                        {/* END TODO DUE DATE */}

                        {/* COMPLETE TODO */}
                        <div
                            className="todo-complete flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 gap-2 cursor-pointer select-none border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md hover:bg-gray-100"
                            onClick={() => {
                                handleStatus(status);
                            }}
                            title="Complete"
                        >
                            <button
                                className={`min-h-[18px] sm:min-h-5 min-w-[18px] sm:min-w-5 hover:bg-gray-100-todo-button bg-transparent rounded-full p-0.5 w-fit text-xs sm:text-sm border border-gray-600 cursor-pointer`}
                            >
                                <FaCheck
                                    className={`${status === "Completed" ? "show" : "hidden"}`}
                                />
                                <RxCross1
                                    className={`${status === "Cancelled" ? "show" : "hidden"}`}
                                />
                            </button>
                            <div className="text">
                                <h3>Complete ToDo</h3>
                            </div>
                        </div>
                        {/* END COMPLETE TODO */}

                        {/* TODO IMPORTANCE */}
                        <div
                            className="todo-importance flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none hover:bg-gray-100"
                            onClick={() => {
                                setIs_important(!is_important);
                            }}
                        >
                            <button className="importance cursor-pointer">
                                <HiOutlineStar
                                    className={`${is_important ? "hidden" : "show"} text-2xl`}
                                />
                                <BiSolidStar
                                    className={`${is_important ? "show" : "hidden"} text-2xl`}
                                />
                            </button>
                            <h3>Importance</h3>
                        </div>
                        {/* END TODO IMPORTANCE */}

                        {/* TODO REMINDER */}
                        <div
                            className="todo-reminder flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none hover:bg-gray-100"
                            onClick={() => {
                                setSend_reminder(!send_reminder);
                            }}
                            title="Reminder"
                        >
                            <button className="send-reminder text-2xl">
                                <PiBellRingingLight
                                    className={`${send_reminder ? "hidden" : "show"}`}
                                />
                                <PiBellRingingFill
                                    className={`${send_reminder ? "show" : "hidden"}`}
                                />
                            </button>
                            <h3>Reminder</h3>
                        </div>
                        {/* END TODO REMINDER */}

                        {/* TODO CATEGORIES */}
                        <div className="todo-categories bg-white py-1.5 px-2 sm:py-2 sm:px-3 border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none relative">
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
                                        className={`${categories && categories.length == 0 ? "show" : "hidden"
                                            }`}
                                    />
                                    <PiListChecks
                                        className={`${categories && categories.length == 0 ? "hidden" : "show"
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
                                {allCategories && allCategories.map((data, index) => (
                                    <button
                                        key={data.category + index}
                                        className={`category cursor-pointer flex select-none justify-start items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md ${categories && categories.some(
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
                                                className={`${categories && categories.some(
                                                    (item) => item["category"] === data.category
                                                )
                                                    ? "opacity-1"
                                                    : "opacity-0"
                                                    }`}
                                            />
                                        </div>
                                        <div className="category-text">{data.category}</div>
                                    </button>
                                ))}
                            </div>
                            {/* END CATEGORIES ITEMS DROPDOWN */}

                        </div>
                        {/* END TODO CATEGORIES */}

                    </div>


                </DrawerContent >
            </Drawer >

        </>
    );
};

export default QuickDoDrawer;
