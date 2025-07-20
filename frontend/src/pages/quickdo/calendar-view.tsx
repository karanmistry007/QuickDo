"use client"

import type { CalendarEvents, DashboardProps, useAllQuickDoData, useAllCategories } from "@/types/Common"
import { Calendar, dayjsLocalizer } from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import dayjs from "dayjs"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import QuickDoDrawer from "@/components/layout/quickdo-drawer"
import Navbar from "@/components/layout/navbar"
import Sidebar from "@/components/layout/sidebar"

const localizer = dayjsLocalizer(dayjs)
const DnDCalendar = withDragAndDrop(Calendar)

const CalendarView = (props: DashboardProps) => {
    // ? HOOKS
    const [events, setEvents] = useState<CalendarEvents[]>([])
    const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin
    const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null

    // ? TODO WILL REPLACE WITH THE SOCKET
    // ? UPDATE STATE
    const [refreshState, setRefreshState] = useState<boolean>(true)
    const handleRefreshState = (state: boolean) => {
        setRefreshState(state)
    }

    // ? CATEGORY API DATA
    const [getAllCategories, setGetAllCategories] = useState<useAllCategories[]>([])

    // ? TODO DATA
    const [todoData, setTodoData] = useState<useAllQuickDoData | undefined>() // ? EXPLICITLY SET TO UNDEFINED

    // ? CATEGORIES LIST API
    useEffect(() => {
        // ? FETCH CATEGORY LIST API FUNCTION
        const fetchAPI = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/method/frappe.client.get_list?doctype=QuickDo Category&fields=["category"]`,
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    },
                )
                // ? IF THE API RETURNS DATA
                if (response.data.message) {
                    // ? SET ALL CATEGORIES STATE
                    setGetAllCategories(response.data.message)
                    // ? REFRESH STATE
                    handleRefreshState(false)
                }
            } catch (error) {
                console.log(error)
                toast.error("There was a problem while loading Categories!")
            }
        }
        // ? CALL THE FETCH API FUNCTION
        if (refreshState) {
            fetchAPI()
        }
    }, [refreshState, BASE_URL, AUTH_TOKEN])

    // ? SAVE TODO HANDLER
    const handleSaveToDo = (data: useAllQuickDoData) => {
        // ? MAP THE OBJECT TO FRAPPE'S DATA
        const finalData: useAllQuickDoData = {
            name: data?.name,
            owner: data?.owner,
            creation: data?.creation,
            modified: data?.modified,
            modified_by: data?.modified_by,
            doctype: "QuickDo",
            status: data.status === "Completed" ? "Completed" : "Open",
            is_important: data.is_important,
            send_reminder: data.send_reminder,
            description: data.description,
            date: data.date,
            categories: data.categories,
        }
        // ? FETCH SAVE TODO API FUNCTION
        const fetchAPI = async (finalData: useAllQuickDoData) => {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/method/frappe.desk.form.save.savedocs`,
                    {
                        doc: JSON.stringify(finalData),
                        action: "Save",
                    },
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    },
                )
                // ? REFRESH THE STATE
                if (response.status === 200) {
                    handleRefreshState(true)
                    // ? IF NEW CREATED
                    if (!finalData.name) {
                        toast.success("The QuickDo has been created!")
                    }
                    // ? IF UPDATED
                    else {
                        toast.success("The QuickDo has been updated!")
                    }
                    setTodoData(undefined) // ? CLEAR TODODATA TO CLOSE THE DRAWER
                }
            } catch (error) {
                console.log(error)
                toast.error("There was a problem while saving QuickDo!")
                setTodoData(undefined) // ? CLEAR TODODATA EVEN ON ERROR TO CLOSE THE DRAWER
            }
        }
        // ? FETCH POST API CALL
        fetchAPI(finalData)
    }

    // ? DELETE TODO HANDLER
    const handleDeleteTodo = (data: string) => {
        // ? FETCH DELETE TODO API FUNCTION
        const fetchAPI = async (data: string) => {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/method/frappe.client.delete`,
                    {
                        doctype: "QuickDo",
                        name: data,
                    },
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    },
                )
                // ? REFRESH THE STATE
                if (response.status === 200) {
                    handleRefreshState(true)
                    toast.success("The QuickDo has been deleted!")
                    setTodoData(undefined) // ? CLEAR TODODATA TO CLOSE THE DRAWER
                }
            } catch (error) {
                console.log(error)
                toast.error("There was a problem while deleting QuickDo!")
            }
        }
        // ? CALL FETCH API
        fetchAPI(data)
    }

    // ? GET TODO HANDLER
    const handleGetTodo = (data: string) => {
        // ? FETCH GET TODO API FUNCTION
        const fetchAPI = async (data: string) => {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/method/frappe.client.get`,
                    {
                        doctype: "QuickDo",
                        name: data,
                    },
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    },
                )
                // ? REFRESH THE STATE
                if (response.data.message) {
                    handleRefreshState(true)
                    const todoDoc = response.data.message
                    // ? PARSE THE TODO HTML
                    const parser = new DOMParser()
                    const description_doc = parser.parseFromString(todoDoc.description, "text/html")
                    const description: any = description_doc.querySelector(".ql-editor.read-mode p")?.textContent
                        ? description_doc.querySelector(".ql-editor.read-mode p")?.textContent
                        : todoDoc.description
                    // ? UPDATE THE FINAL DATA
                    const finalData: useAllQuickDoData = {
                        name: todoDoc.name,
                        owner: todoDoc.owner,
                        creation: todoDoc.creation,
                        modified: todoDoc.modified,
                        modified_by: todoDoc.modified_by,
                        status: todoDoc.status,
                        is_important: todoDoc.is_important,
                        send_reminder: todoDoc.send_reminder,
                        description: description || "",
                        date: todoDoc.date || "",
                        categories: todoDoc.categories || [],
                    }
                    setTodoData(finalData)
                }
            } catch (error) {
                console.log(error)
                toast.error("There was a problem while getting QuickDo!")
            }
        }
        // ? CALL FETCH API
        fetchAPI(data)
    }

    // ? UPDATE QUICKDO FUNCTION
    const updateQuickDo = async (name: string, value: string) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/method/frappe.client.set_value`,
                {
                    doctype: "QuickDo",
                    name: name,
                    fieldname: "date",
                    value: value,
                },
                {
                    headers: {
                        Authorization: AUTH_TOKEN,
                    },
                },
            )
            // ? IF QUICKDO UPDATED SUCCESSFULLY
            if (response.status === 200) {
                toast.success("The due date of the QuickDo has been updated!")
            }
        } catch (error) {
            console.log(error)
            toast.error("There was a problem while updating QuickDo!")
        }
    }

    // ? LOAD QUICKDO DATA API FUNCTION
    useEffect(() => {
        const loadQuickDoDataAPI = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/method/quickdo.api.get_quickdo_calendar_data`, {
                    headers: {
                        Authorization: AUTH_TOKEN,
                    },
                })
                // ? IF NO ERROR
                if (response.data.message) {
                    // ? DEFINE VARIABLES
                    const QuickDoData = response.data.message
                    QuickDoData.map((item: any) => {
                        item.start = dateTimeConverter("start", item.start)
                        item.end = dateTimeConverter("end", item.end)
                    })
                    // ? SET EVENT DATA
                    setEvents(QuickDoData)
                }
            } catch (error) {
                console.log(error)
                toast.error("There was a problem while loading QuickDos!")
            }
        }
        loadQuickDoDataAPI()
    }, [refreshState, BASE_URL, AUTH_TOKEN])

    // ? DATE TIME CONVERTER
    function dateTimeConverter(field = "start", date = "00-00-00") {
        if (field === "start") {
            return new Date(`${date} 00:00:00`)
        } else if (field === "end") {
            return new Date(`${date} 23:59:59`)
        }
    }

    // ? SELECT EVENT HANDLER
    const handleSelectEvent = (data: any) => {
        handleGetTodo(data.name)
    }

    // ? DROP EVENT HANDLER
    const handleDropEvent = (data: any) => {
        // ? CHECK IF THE EVENT IS ONE DAY EVENT MAKE THE END DATE PRIMARY
        const isSameDay = dayjs(data.start).isSame(dayjs(data.end), "day")
        // ? IF THE EVENT IS IN THE SAME DAY
        if (isSameDay) {
            // ? UPDATE THE EVENTS DATA
            setEvents((prevEvents) =>
                prevEvents.map((ev) => (ev.title === data.event.title ? { ...ev, start: data.start, end: data.end } : ev)),
            )
            // ? UPDATE THE DATA API
            updateQuickDo(data.event.name, data.end.toISOString().split("T")[0])
        }
        // ? IF THE EVENT IS NOT IN SAME DAY MAKE IT AS START DATE ONE DAY EVENT
        else {
            const startDate = dateTimeConverter("start", data.start.toISOString().split("T")[0])
            const endDate = dateTimeConverter("end", data.start.toISOString().split("T")[0])
            // ? UPDATE THE EVENTS DATA
            // @ts-ignore
            setEvents((prevEvents) =>
                prevEvents.map((ev) => (ev.title === data.event.title ? { ...ev, start: startDate, end: endDate } : ev)),
            )
            // ? UPDATE THE DATA API
            updateQuickDo(data.event.name, data.start.toISOString().split("T")[0])
        }
    }

    // ? EVENT COLOR STYLING USING THE EVENT PROP GETTER
    const eventPropGetter = (event: CalendarEvents) => {
        // ? DEFINE VARIABLES
        let backgroundColor = ""
        // ? SET COLORS AS PER NEEDS
        if (event.color) {
            backgroundColor = event.color
        } else if (event.is_important) {
            backgroundColor = "#CB2929"
        } else if (event.sent_reminder) {
            backgroundColor = "#EC864B"
        } else {
            backgroundColor = "#3c50e0"
        }
        return {
            style: { backgroundColor },
        }
    }

    return (
        <>
            {/* ? NAVBAR */}
            <Navbar />
            {/* ? SIDEBAR */}
            <Sidebar />
            {/* ? DASHBOARD CONTAINER */}
            <div className="dashboard-container sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] h-auto mt-[134px] sm:mt-0 sm:h-[calc(100dvh_-_61px)] overflow-y-scroll">
                <div className="calendar m-10">
                    <DnDCalendar
                        // @ts-ignore
                        startAccessor="start"
                        // @ts-ignore
                        endAccessor="end"
                        // @ts-ignore
                        eventPropGetter={eventPropGetter}
                        defaultView="month"
                        events={events}
                        views={["month", "week", "day"]}
                        localizer={localizer}
                        className="overflow-auto h-[800px]"
                        step={10}
                        showAllEvents
                        onEventDrop={handleDropEvent}
                        onSelectEvent={handleSelectEvent}
                        resizable={false}
                    />
                    {todoData && (
                        <QuickDoDrawer
                            autoOpenDrawer={!!todoData} // ? PASS THE BOOLEAN STATE DIRECTLY
                            todoData={todoData}
                            allCategories={getAllCategories}
                            handleSaveToDo={handleSaveToDo}
                            handleDeleteTodo={handleDeleteTodo}
                            onCloseRequest={() => setTodoData(undefined)} // ? CALLBACK TO CLOSE THE DRAWER
                        />
                    )}
                </div>
            </div>
            {/* ? END DASHBOARD CONTAINER */}
        </>
    )
}

export default CalendarView
