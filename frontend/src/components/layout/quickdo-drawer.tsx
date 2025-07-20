"use client"

import { FaAngleRight } from "react-icons/fa6"
import { useEffect, useState } from "react"
import {
    PiBellRingingLight,
    PiCalendarCheckFill,
    PiCalendarDotsLight,
    PiListBullets,
    PiListChecks,
} from "react-icons/pi"
import { PiBellRingingFill } from "react-icons/pi"
import { FaCheck } from "react-icons/fa6"
import { HiOutlineStar } from "react-icons/hi2"
import { BiSolidStar } from "react-icons/bi"
import ConfirmBox from "@/components/ui/confirm"
import type { useAllCategories, DrawerProps, Status } from "../../types/Common"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { IoClose, IoInformationCircle } from "react-icons/io5"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { RxCross1 } from "react-icons/rx"

const QuickDoDrawer = (props: DrawerProps) => {
    // ? STATE HOOKS
    const [status, setStatus] = useState<Status>(props.todoData.status)
    const [isImportant, setIsImportant] = useState<boolean>(props.todoData.is_important)
    const [sendReminder, setSendReminder] = useState<boolean>(props.todoData.send_reminder)
    const [description, setDescription] = useState<string>(props.todoData.description)
    const [date, setdate] = useState<string>(props.todoData.date)
    const [showCategories, setShowCategories] = useState<boolean>(false)
    const [categories, setCategories] = useState<useAllCategories[]>(props.todoData.categories)
    const [allCategories, setAllCategories] = useState<useAllCategories[]>(props.allCategories)
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false)

    // ? RESPONSIVE: MOBILE SCREEN STATE
    const [isMobileScreen, setIsMobileScreen] = useState<boolean>(
        typeof window !== "undefined" ? window.innerWidth < 640 : false
    )

    // ? HANDLE RESPONSIVE SCREEN SIZE
    useEffect(() => {
        const handler = () => setIsMobileScreen(window.innerWidth < 640)
        handler()
        window.addEventListener("resize", handler)
        return () => window.removeEventListener("resize", handler)
    }, [])

    // ? RESET LOCAL STATE IF PROPS todoData CHANGE
    useEffect(() => {
        setStatus(props.todoData.status)
        setIsImportant(props.todoData.is_important)
        setSendReminder(props.todoData.send_reminder)
        setDescription(props.todoData.description)
        setdate(props.todoData.date)
        setCategories(props.todoData.categories)
        setIsDataChanged(false)
    }, [props.todoData])

    // ? RESET ALL CATEGORIES STATE IF PROPS CHANGE
    useEffect(() => {
        setAllCategories(props.allCategories)
    }, [props.allCategories])

    // ? HANDLE DELETING THE TODO
    const handleDeleteTodo = () => {
        props.handleDeleteTodo(props.todoData.name || "")
        props.onCloseRequest?.()
    }

    // ? HANDLE STATUS CYCLE CLICK
    const handleStatus = () => {
        setStatus((prevStatus) => {
            let newStatus: Status
            if (prevStatus === "Open") newStatus = "Completed"
            else if (prevStatus === "Completed") newStatus = "Cancelled"
            else newStatus = "Open"
            setIsDataChanged(true)
            return newStatus
        })
    }

    // ? HANDLE DESCRIPTION CHANGE
    const handleDescriptionChange = (val: string) => {
        setDescription(val)
        setIsDataChanged(true)
    }

    // ? HANDLE DUE DATE CHANGE
    const handleSetDate = (selectedDate: Date | undefined) => {
        const year = selectedDate?.getFullYear()
        const month = String((selectedDate?.getMonth() ?? 0) + 1).padStart(2, "0")
        const day = String(selectedDate?.getDate()).padStart(2, "0")
        const formattedDate = selectedDate ? `${year}-${month}-${day}` : ""
        setdate(formattedDate)
        setIsDataChanged(true)
    }

    // ? HANDLE IMPORTANCE
    const handleImportance = () => {
        setIsImportant((prev) => {
            setIsDataChanged(true)
            return !prev
        })
    }

    // ? HANDLE REMINDER
    const handleReminder = () => {
        setSendReminder((prev) => {
            setIsDataChanged(true)
            return !prev
        })
    }

    // ? CLEAR ALL CATEGORIES
    const handleClearCategory = () => {
        setCategories([])
        setIsDataChanged(true)
    }

    // ? MULTISELECT CATEGORY HANDLER
    const handleCategoryMultiSelect = (category: string) => {
        setCategories((prevCategories) => {
            let next: useAllCategories[]
            if (prevCategories.some((item) => item.category === category)) {
                next = prevCategories.filter((item) => item.category !== category)
            } else {
                next = [...prevCategories, { category }]
            }
            setIsDataChanged(true)
            return next
        })
    }

    // ? SAVE HANDLER (CALLED BY DRAWER ONCLOSE)
    const handleSaveToDo = () => {
        if (isDataChanged) {
            props.handleSaveToDo({
                name: props.todoData.name,
                owner: props.todoData.owner,
                creation: props.todoData.creation,
                modified: props.todoData.modified,
                modified_by: props.todoData.modified_by,
                status: status,
                is_important: isImportant,
                send_reminder: sendReminder,
                description: description,
                date: date,
                categories: categories,
            })
            setIsDataChanged(false)
        }
    }

    // ? RENDER
    return (
        <>
            {/* ? DRAWER COMPONENT (MOBILE=bottom, DESKTOP=right) */}
            <Drawer
                direction={isMobileScreen ? "bottom" : "right"}
                onClose={handleSaveToDo}
                open={props.autoOpenDrawer}
                onOpenChange={(openState) => {
                    // ? REQUEST PARENT TO CLOSE IF DRAWER CLOSES (BACK OR DRAG CLOSE)
                    if (!openState) {
                        props.onCloseRequest?.()
                    }
                }}
            >
                {/* ? DRAWER TRIGGER BUTTON */}
                <DrawerTrigger asChild className={`${props.autoOpenDrawer && "hidden"}`} title="Drawer">
                    <Button variant="link" className="p-0 h-auto">
                        <IoInformationCircle className="text-2xl ml-auto sm:m-auto lg:m-0" />
                    </Button>
                </DrawerTrigger>

                {/* ? DRAWER CONTENT */}
                <DrawerContent className="right-0 left-auto px-5 w-[100dvw] h-[100dvh] sm:w-[70dvw] md:w-[50dvw] lg:w-[40dvw] xl:w-[30dvw] ml-auto">
                    {/* ? DRAWER HEADER */}
                    <DrawerHeader className="text-left p-0 mt-5">
                        <DrawerTitle className="flex justify-between items-center">
                            <DrawerDescription className="hidden">Drawer Description</DrawerDescription>
                            <DrawerClose asChild title="Save QuickDo">
                                <Button
                                    variant="outline"
                                    className="text-xl rounded-full p-2 bg-transparent"
                                    onClick={() => props.onCloseRequest?.()}
                                >
                                    <FaAngleRight />
                                </Button>
                            </DrawerClose>
                            {/* ? DELETE CONFIRM BOX */}
                            <ConfirmBox
                                confirmTitle={"Delete QuickDo"}
                                confirmMessage={"Are you sure you want to delete QuickDo?"}
                                handleSuccess={handleDeleteTodo}
                            />
                        </DrawerTitle>
                    </DrawerHeader>

                    {/* ? MAIN CONTENT */}
                    <div className="drawer-content flex flex-col justify-center gap-5 mt-5">
                        {/* ? TODO DESCRIPTION FIELD */}
                        <div
                            title="Description"
                            className="todo-description bg-white border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md hover:bg-gray-100"
                        >
                            <Textarea
                                className="w-full min-h-[64px]"
                                value={description}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                            />
                        </div>

                        {/* ? FORM CONTAINER */}
                        <div className="form-container grid grid-cols-2 gap-5">

                            {/* ? TODO DUE DATE PICKER */}
                            <Popover>
                                <PopoverTrigger asChild title="Due Date">
                                    <div className="todo-due-data flex items-center bg-white py-0.5 px-2 sm:px-3 border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md cursor-pointer select-none hover:bg-gray-100">
                                        <div className="due-data cursor-pointer">
                                            <PiCalendarDotsLight className={`text-2xl ${date ? "hidden" : "show"}`} />
                                            <PiCalendarCheckFill className={`text-2xl ${date ? "show" : "hidden"}`} />
                                        </div>
                                        <Button variant={"transparent"} className={"w-auto pl-3"}>
                                            <h3 className="font-normal text-base">{date ? date : "Pick Due Date"}</h3>
                                        </Button>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date ? new Date(date) : undefined}
                                        onSelect={handleSetDate}
                                    />
                                </PopoverContent>
                            </Popover>

                            {/* ? TODO STATUS CYCLE */}
                            <div
                                className="todo-status flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 gap-2 cursor-pointer select-none border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md hover:bg-gray-100"
                                onClick={handleStatus}
                                title="Status"
                            >
                                <button className={`min-h-[18px] sm:min-h-5 min-w-[18px] sm:min-w-5 hover:bg-gray-100-todo-button bg-transparent rounded-full p-0.5 w-fit text-xs sm:text-sm border border-gray-600 cursor-pointer`}>
                                    <FaCheck className={`${status === "Completed" ? "show" : "hidden"}`} />
                                    <RxCross1 className={`${status === "Cancelled" ? "show" : "hidden"}`} />
                                </button>
                                <div className="text"><h3>Status QuickDo</h3></div>
                            </div>

                            {/* ? TODO IMPORTANCE BUTTON */}
                            <div
                                className="todo-importance flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none hover:bg-gray-100"
                                onClick={handleImportance}
                                title="Importance"
                            >
                                <button className="importance cursor-pointer">
                                    <HiOutlineStar className={`${isImportant ? "hidden" : "show"} text-2xl`} />
                                    <BiSolidStar className={`${isImportant ? "show" : "hidden"} text-2xl`} />
                                </button>
                                <h3>Importance</h3>
                            </div>

                            {/* ? TODO REMINDER BUTTON */}
                            <div
                                className="todo-reminder flex items-center bg-white py-1.5 px-2 sm:py-2 sm:px-3 border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none hover:bg-gray-100"
                                onClick={handleReminder}
                                title="Reminder"
                            >
                                <button className="send-reminder text-2xl">
                                    <PiBellRingingLight className={`${sendReminder ? "hidden" : "show"}`} />
                                    <PiBellRingingFill className={`${sendReminder ? "show" : "hidden"}`} />
                                </button>
                                <h3>Reminder</h3>
                            </div>
                        </div>

                        {/* ? TODO CATEGORIES SECTION */}
                        <div className="todo-categories bg-white py-1.5 px-2 sm:py-2 sm:px-3 border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md gap-2 cursor-pointer select-none relative">
                            <div
                                className="categories-toolbar pb-2 flex justify-between border-b border-gray-200 "
                                onClick={() => setShowCategories(!showCategories)}
                                title="Categories"
                            >
                                <div className="todo-categories flex item-center gap-2">
                                    <button className="categories text-2xl">
                                        <PiListBullets className={`${categories && categories.length === 0 ? "show" : "hidden"}`} />
                                        <PiListChecks className={`${categories && categories.length === 0 ? "hidden" : "show"}`} />
                                    </button>
                                    <h3>Categories</h3>
                                </div>
                                {/* ? CLEAR CATEGORIES */}
                                <button title="Clear Categories" onClick={handleClearCategory}>
                                    <IoClose className="text-2xl" />
                                </button>
                            </div>
                            <div className={`categories-items max-h-[40dvh] overflow-y-auto overflow-x-hidden whitespace-nowrap text-ellipsis bg-white p-1 rounded-md grid grid-cols-2 gap-1 justify-center`}>
                                {allCategories &&
                                    allCategories.map((data, index) => (
                                        <button
                                            key={data.category + index}
                                            title={data.category}
                                            className={`category cursor-pointer flex select-none justify-start items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md ${categories && categories.some((item) => item["category"] === data.category)
                                                    ? "bg-slate-100"
                                                    : ""
                                                }`}
                                            onClick={() => handleCategoryMultiSelect(data.category)}
                                        >
                                            <div className={`save-todo-button bg-transparent rounded-full p-0.5 w-fit text-[10px] border border-gray-600 cursor-pointer`}>
                                                <FaCheck
                                                    className={`${categories && categories.some((item) => item["category"] === data.category)
                                                            ? "opacity-1"
                                                            : "opacity-0"
                                                        }`}
                                                />
                                            </div>
                                            <div className="category-text w-[160px] text-left overflow-x-hidden whitespace-nowrap text-ellipsis">
                                                {data.category}
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default QuickDoDrawer
