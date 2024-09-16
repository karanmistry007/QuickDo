import { CalendarEvents, DashboardProps } from "@/types/Common";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import dayjs from "dayjs";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast"

const localizer = dayjsLocalizer(dayjs);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarView = (props: DashboardProps) => {

    //? HOOKS
    const { toast } = useToast();
    const [events, setEvents] = useState<CalendarEvents[]>([]);
    const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
    const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;

    // ? UPDATE QUICKDO FUNCTION
    const updateQuickDo = async (name: string, value: string) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/method/frappe.client.set_value`,
                {
                    doctype: "QuickDo",
                    name: name,
                    fieldname: "date",
                    value: value
                },
                {
                    headers: {
                        Authorization: AUTH_TOKEN,
                    },
                }
            );

            //? IF QUICKDO UPDATED SUCCESSFULLY
            if (response.status === 200) {
                toast({
                    title: "QuickDo Updated!",
                    description: "The due date of the QuickDo has been updated!",
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Something Went Wrong!",
                description: "There was a problem while updating QuickDo!",
            });
        }
    };


    // ? LOAD QUICKDO DATA API FUNCTION
    const loadQuickDoDataAPI = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/method/quickdo.api.get_quickdo_calendar_data`, {
                headers: {
                    Authorization: AUTH_TOKEN,
                },
            });

            //? IF NO ERROR
            if (response.data.message) {

                // ? DEFINE VARIABLES
                const QuickDoData = response.data.message;

                QuickDoData.map((item: any) => {
                    item.start = dateTimeConverter("start", item.start);
                    item.end = dateTimeConverter("end", item.end);
                });

                // ? SET EVENT DATA
                setEvents(QuickDoData);
            }
        }
        catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Something Went Wrong!",
                description: "There was a problem while loading QuickDos!",
            });
        }
    }


    // ? FETCH THE API FOR THE CALENDER VIEW DATA
    useEffect(() => {
        loadQuickDoDataAPI();
    }, []);


    // ? DATE TIME CONVERTER
    function dateTimeConverter(field: string = "start", date: string = "00-00-00") {
        if (field === "start") {
            return new Date(`${date} 00:00:00`)
        }
        else if (field === "end") {
            return new Date(`${date} 23:59:59`)
        }
    }


    //? DROP EVENT HANDLER
    const handleDropEvent = (data: any) => {

        //? CHECK IF THE EVENT IS ONE DAY EVENT MAKE THE END DATE PRIMARY
        const isSameDay = dayjs(data.start).isSame(dayjs(data.end), "day");

        //? IF THE EVENT IS IN THE SAME DAY
        if (isSameDay) {

            // ? UPDATE THE EVENTS DATA
            setEvents((prevEvents) =>
                prevEvents.map((ev) =>
                    ev.title === data.event.title ? { ...ev, start: data.start, end: data.end } : ev
                )
            );

            // ? UPDATE THE DATA API
            updateQuickDo(data.event.name, data.end.toISOString().split('T')[0]);
        }

        // ? IF THE EVENT IS NOT IN SAME DAY MAKE IT AS START DATE ONE DAY EVENT
        else {
            const startDate = dateTimeConverter("start", data.start.toISOString().split('T')[0]);
            const endDate = dateTimeConverter("end", data.start.toISOString().split('T')[0]);

            // ? UPDATE THE EVENTS DATA
            // @ts-ignore
            setEvents((prevEvents) =>
                prevEvents.map((ev) =>
                    ev.title === data.event.title ? { ...ev, start: startDate, end: endDate } : ev
                )
            );

            // ? UPDATE THE DATA API
            updateQuickDo(data.event.name, data.start.toISOString().split('T')[0]);
        }
    };



    // ? EVENT COLOR STYLING USING THE EVENT PROP GETTER
    const eventPropGetter = (event: CalendarEvents) => {

        // ? DEFINE VARIABLES
        let backgroundColor = "";

        // ? SET COLORS AS PER NEEDS
        if (event.color) {
            backgroundColor = event.color;
        } else if (event.is_important) {
            backgroundColor = "#CB2929";
        } else if (event.sent_reminder) {
            backgroundColor = "#EC864B";
        } else {
            backgroundColor = "#3c50e0";
        }

        return {
            style: { backgroundColor },
        };
    };
    return (
        <>
            {/* DASHBOARD CONTAINER */}
            <div className="dashboard-container sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] h-auto mt-[calc(72px_+_55px)] sm:mt-0 sm:h-[calc(100dvh_-_80px)] overflow-y-scroll">
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
                        resizable={false}
                    />
                </div>
            </div>
            {/* END DASHBOARD CONTAINER */}
        </>
    );
};

export default CalendarView;
