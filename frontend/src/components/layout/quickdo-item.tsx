"use client"

import { useEffect, useState, useCallback } from "react"
import { FaCheck } from "react-icons/fa6"
import { HiOutlineStar } from "react-icons/hi2"
import { BiSolidStar } from "react-icons/bi"
import DropdownMultiSelect from "../ui/dropdown-multiselect"
import type { useAllCategories, ListItemProps, Status } from "../../types/Common"
import QuickDoDrawer from "./quickdo-drawer"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "../ui/button"
import { PiCalendarCheckFill, PiCalendarDotsLight } from "react-icons/pi"
import { RxCross1 } from "react-icons/rx"
import { IoInformationCircle } from "react-icons/io5"

const QuickDoItem = (props: ListItemProps) => {
    // ? HOOKS
    const [status, setStatus] = useState<Status>(props.todoData.status)
    const [is_important, setIs_important] = useState<boolean>(props.todoData.is_important)
    const [description, setDescription] = useState<string>(props.todoData.description)
    const [date, setdate] = useState<string>(props.todoData.date)
    const [categories, setCategories] = useState<useAllCategories[]>(props.todoData.categories)
    const [showCategories, setShowCategories] = useState<boolean>(false)
    const [allCategories, setAllCategories] = useState<useAllCategories[]>(props.allCategories)
    const [datePopupOpen, setDatePopupOpen] = useState<boolean>(false)

    // ? DRAWER OPEN/CLOSE STATE
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    // ? UPDATE STATE WHEN PROPS CHANGE
    useEffect(() => {
        setStatus(props.todoData.status)
        setIs_important(props.todoData.is_important)
        setDescription(props.todoData.description)
        setdate(props.todoData.date)
        setCategories(props.todoData.categories)
        setShowCategories(false)
    }, [props.todoData])

    // ? UPDATE CATEGORIES MASTER LIST IF CHANGED
    useEffect(() => {
        setAllCategories(props.allCategories)
    }, [props.allCategories])

    // ? SAVE TO PARENT WHENEVER IMPORTANT FIELDS CHANGE (EXCEPT DESCRIPTION -- SEE BELOW)
    useEffect(() => {
        // ? ONLY SAVE IF CHANGED FROM PROPS (TO PREVENT LOOP)
        // ? DESCRIPTION HANDLING IS BELOW (ON BLUR)
        if (
            status !== props.todoData.status ||
            is_important !== props.todoData.is_important ||
            date !== props.todoData.date ||
            categories !== props.todoData.categories
        ) {
            props.handleSaveToDo({
                name: props.todoData.name,
                owner: props.todoData.owner,
                creation: props.todoData.creation,
                modified: props.todoData.modified,
                modified_by: props.todoData.modified_by,
                status,
                is_important,
                send_reminder: props.todoData.send_reminder,
                description, // ? EVEN IF IT'S CHANGED, ONLY SAVED ON BLUR/PARENT CALL
                date,
                categories,
            })
        }
        // eslint-disable-next-line
        // ^ if using eslint, you might have to handle exhaustive deps here, but above is correct for your case
        // Don't pass [description] in deps!
    }, [status, is_important, date, categories])

    // ? HANDLE STATUS CLICK
    const handleStatus = useCallback(() => {
        setStatus(prev => {
            if (prev === "Open") return "Completed"
            if (prev === "Completed") return "Cancelled"
            return "Open"
        })
    }, [])

    // ? HANDLE IMPORTANCE CLICK
    const handleImportance = useCallback(() => {
        setIs_important(prev => !prev)
    }, [])

    // ? HANDLE CATEGORY CHANGE
    const handleCategories = useCallback((data: useAllCategories[]) => {
        setCategories(data || [])
    }, [])

    // ? HANDLE DATE SELECTION
    const handleSetDate = useCallback((selectedDate: Date | undefined) => {
        const year = selectedDate?.getFullYear()
        const month = String(selectedDate?.getMonth() || 0 + 1).padStart(2, "0")
        const day = String(selectedDate?.getDate()).padStart(2, "0")
        const formattedDate = selectedDate ? `${year}-${month}-${day}` : ""
        setdate(formattedDate)
    }, [])

    // ? HANDLE DESCRIPTION CHANGE AND SAVE ONLY ON BLUR
    const handleDescriptionChange = (value: string) => {
        setDescription(value)
    }
    const handleDescriptionBlur = () => {
        if (description.trim() !== props.todoData.description.trim()) {
            props.handleSaveToDo({
                ...props.todoData,
                status,
                is_important,
                description,
                date,
                categories,
            })
        }
    }

    // ? DRAWER HANDLER
    const handleDrawerCloseRequest = useCallback(() => {
        setIsDrawerOpen(false)
    }, [])
    const handleDeleteTodoAndCloseDrawer = useCallback(
        (name: string) => {
            props.handleDeleteTodo(name)
            setIsDrawerOpen(false)
        },
        [props.handleDeleteTodo]
    )
    const handleSaveToDoAndCloseDrawer = useCallback(
        (data: any) => {
            props.handleSaveToDo(data)
            setIsDrawerOpen(false)
        },
        [props.handleSaveToDo]
    )

    // ? RENDER
    return (
        <>
            {/* ? LIST ITEMS */}
            <div className="list-items quickdo-item rounded-md border-gray-200 border shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] my-2 py-2 px-4 sm:py-3 flex justify-between lg:grid sm:gap-y-2 sm:gap-x-5 lg:grid-cols-8 xl:grid-cols-10 xxl:grid-cols-12 items-center">
                {/* ? EDIT AND CLOSE TASK */}
                <div className="item flex justify-start items-center gap-1 sm:gap-5 w-[85%] sm:w-[80%] text-center lg:w-auto lg:col-span-3 xl:col-span-5 xxl:col-span-7">
                    <button
                        className={`complete min-h-[18px] sm:min-h-5 min-w-[18px] sm:min-w-5 align-middle hover:bg-gray-100-todo-button bg-transparent rounded-full p-0.5 w-fit text-xs sm:text-sm border border-gray-600 cursor-pointer`}
                        title="Complete"
                        onClick={handleStatus}
                    >
                        <FaCheck className={`${status === "Completed" ? "show" : "hidden"}`} />
                        <RxCross1 className={`${status === "Cancelled" ? "show" : "hidden"}`} />
                    </button>
                    <div className="input w-full">
                        <input
                            type="text"
                            className="outline-0 placeholder:text-gray-700 py-1.5 px-2 w-full"
                            name="ToDo"
                            id="ToDo"
                            value={description}
                            onChange={(e) => {
                                handleDescriptionChange(e.target.value)
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    e.currentTarget.blur()
                                }
                            }}
                            onBlur={handleDescriptionBlur}
                        />
                    </div>
                </div>
                {/* ? END EDIT AND CLOSE TASK */}

                {/* ? DUE DATE */}
                <div className="item hidden lg:block lg:col-span-2 justify-self-center">
                    <Popover open={datePopupOpen} onOpenChange={setDatePopupOpen}>
                        <PopoverTrigger asChild>
                            <Button variant={"transparent"} className={"w-auto pl-3 flex gap-1.5 items-center justify-center"}>
                                <h3 className="font-normal text-base">{date ? date : "Pick Due Date"}</h3>
                                <div className="due-data cursor-pointer">
                                    <PiCalendarDotsLight className={`text-xl mt-0.5 ${date ? "hidden" : "show"}`} />
                                    <PiCalendarCheckFill className={`text-xl mt-0.5 ${date ? "show" : "hidden"}`} />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date ? new Date(date) : undefined}
                                onSelect={(e) => {
                                    handleSetDate(e)
                                    setDatePopupOpen(false)
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                {/* ? END DUE DATE */}

                {/* ? IMPORTANCE */}
                <div className="item hidden lg:block lg:col-span-1 justify-self-center">
                    <button
                        className="importance cursor-pointer align-middle"
                        onClick={handleImportance}
                    >
                        <HiOutlineStar className={`${is_important ? "hidden" : "show"} text-2xl`} />
                        <BiSolidStar className={`${is_important ? "show" : "hidden"} text-2xl`} />
                    </button>
                </div>
                {/* ? END IMPORTANCE */}

                {/* ? CATEGORIES */}
                <div className="item hidden lg:block lg:col-span-1 justify-self-center">
                    <DropdownMultiSelect
                        position={"left"}
                        showCategories={showCategories}
                        allCategories={allCategories}
                        categories={categories}
                        handleCategories={handleCategories}
                    />
                </div>
                {/* ? END CATEGORIES */}

                {/* ? MORE / DRAWER TRIGGER BUTTON */}
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsDrawerOpen(true)}>
                    <IoInformationCircle className="text-2xl ml-auto sm:m-auto lg:m-0" />
                </Button>

                {/* ? QUICKDODRAWER - CONDITIONALLY RENDERED */}
                {isDrawerOpen && (
                    <QuickDoDrawer
                        autoOpenDrawer={isDrawerOpen}
                        todoData={props.todoData}
                        allCategories={allCategories}
                        handleSaveToDo={handleSaveToDoAndCloseDrawer}
                        handleDeleteTodo={handleDeleteTodoAndCloseDrawer}
                        onCloseRequest={handleDrawerCloseRequest}
                    />
                )}
            </div>
            {/* ? END LIST ITEMS */}
        </>
    )
}

export default QuickDoItem
