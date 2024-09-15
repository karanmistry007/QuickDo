import { DashboardProps } from "@/types/Common"
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import dayjs from 'dayjs'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dayjsLocalizer(dayjs)

const CalendarView = (props: DashboardProps) => {
    const DnDCalendar = withDragAndDrop(Calendar);
    return (
        <>
            {/* DASHBOARD CONTAINER  */}
            <div className="dashboard-container  sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] h-auto mt-[calc(72px_+_55px)] sm:mt-0 sm:h-[calc(100dvh_-_80px)] overflow-y-scroll">
                <div className="calendar m-10">
                    <DnDCalendar
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="month"
                        events={[]}
                        localizer={localizer}
                        className="overflow-auto h-[calc(100dvh_-_140px)]"
                        step={10}
                        showAllEvents
                    />
                </div>

            </div>
            {/* END DASHBOARD CONTAINER  */}
        </>
    )
}

export default CalendarView