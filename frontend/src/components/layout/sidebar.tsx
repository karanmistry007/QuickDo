import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { TbMenu2 } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarItem } from "../../types/Common";
import { PiChartDonutDuotone } from "react-icons/pi";
import { BiSolidDoughnutChart } from "react-icons/bi";
import { BsCalendar4Range } from "react-icons/bs";
import { BsCalendarRangeFill } from "react-icons/bs";
import { PiKanbanDuotone } from "react-icons/pi";
import { PiKanbanFill } from "react-icons/pi";
import { MdOutlineCategory } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { PiCloudSunDuotone } from "react-icons/pi";
import { PiCloudSunFill } from "react-icons/pi";
import { IoLayersOutline } from "react-icons/io5";
import { IoLayers } from "react-icons/io5";





//? SIDEBAR ITEMS
const sidebarItems: SidebarItem[] = [
    {
        name: "Dashboard",
        link: "/dashboard",
        icon: PiChartDonutDuotone,
        activeIcon: BiSolidDoughnutChart,
    },
    {
        name: "My Day",
        link: "/my-day",
        icon: PiCloudSunDuotone,
        activeIcon: PiCloudSunFill,
    },
    {
        name: "Inbox",
        link: "/inbox",
        icon: IoHomeOutline,
        activeIcon: IoHome,
    },
    {
        name: "Group By",
        link: "/group-by",
        icon: IoLayersOutline,
        activeIcon: IoLayers,
    },
    {
        name: "Calendar",
        link: "/calendar",
        icon: BsCalendar4Range,
        activeIcon: BsCalendarRangeFill,
    },
    {
        name: "Kanban",
        link: "/kanban",
        icon: PiKanbanDuotone,
        activeIcon: PiKanbanFill,
    },
    {
        name: "Category",
        link: "/category",
        icon: MdOutlineCategory,
        activeIcon: MdCategory,
    },
];


export default function Sidebar() {

    //? HOOKS
    const location = useLocation();
    const navigate = useNavigate();

    //? SIDEBAR COLLAPSE
    const [sidebarCollapseActive, setSidebarCollapseActive] = useState<boolean>(false);

    //? ACTIVE SIDEBAR ITEMS
    const [activeSidebarItem, setActiveSidebarItem] = useState<string>(
        sidebarItems.filter((item) => item.link == location?.pathname)[0]?.name
            ? sidebarItems.filter((item) => item.link == location?.pathname)[0]?.name
            : "Dashboard"
    );

    return (
        <>
            {/* SIDEBAR */}
            <div
                className={`sidebar fixed left-0 top-[73px] sm:top-[61px] bg-white pt-4 sm:py-0 z-[99] border-t h-auto sm:h-[calc(100dvh_-_61px)] shadow-md sm:shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.25)] sm:pr-1 ${sidebarCollapseActive ? "w-full sm:max-w-[200px] sidebar-left-to-right" : "w-full sm:w-fit sidebar-right-to-left"} transition-all duration-300 overflow-hidden`}
                onMouseEnter={() => {
                    setSidebarCollapseActive(true);
                }}
                onMouseLeave={() => {
                    setSidebarCollapseActive(false);
                }}
            >

                {/* SIDEBAR HEAD */}
                <div className="sidebar-head pb-4 sm:py-0 flex gap-2 items-center px-4 sm:px-8 sm:mt-4 w-full sm:hidden">

                    {/* SIDEBAR COLLAPSE */}
                    <button
                        className="sidebar-collapse cursor-pointer"
                        title={`${sidebarCollapseActive ? "Collapse" : "Expand"}`}
                        onClick={() => {
                            setSidebarCollapseActive(!sidebarCollapseActive);
                        }}
                    >
                        <FaAngleRight className="w-6 h-6 hidden" />
                        <TbMenu2 className="w-6 h-6" />
                    </button>
                    {/* END SIDEBAR COLLAPSE */}

                    {/* ACTIVE TAB */}
                    <h2
                        className={`sidebar-heading text-xl font-semibold  select-none ${sidebarCollapseActive ? "" : "sm:hidden"
                            }`}
                    >
                        {activeSidebarItem}
                    </h2>
                    {/* END ACTIVE TAB */}

                </div>
                {/* END SIDEBAR HEAD */}

                {/* SIDEBAR ITEM CONTAINER */}
                <div
                    className={`sidebar-item-container top-to-bottom-animation sm:animate-none flex flex-col gap-1 items-center my-2 sm:my-4 rounded-lg ${sidebarCollapseActive
                        ? "w-full sm:max-w-[280px]"
                        : "hidden sm:flex w-fit"}`}
                >
                    {sidebarItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActiveSidebarItem(item.name);
                                navigate(item.link);
                            }}
                            title={item.name}
                            className={`sidebar-item text-nowrap flex items-center gap-2 w-full hover:bg-gray-200 rounded-r-lg  py-1.5 sm:py-2 ${sidebarCollapseActive ? "px-4 sm:px-4" : "px-4 sm:px-4"} ${activeSidebarItem == item.name ? "sidebar-active" : ""}`}
                        >
                            <div className="sidebar-icon">
                                <item.activeIcon
                                    className={`${activeSidebarItem == item.name ? "show" : "hidden"} h-6 w-6`}
                                />
                                <item.icon
                                    className={`${activeSidebarItem == item.name ? "hidden" : "show"} h-6 w-6`}
                                />
                            </div>
                            <div
                                className={`sidebar-link select-none ${sidebarCollapseActive ? "" : "hidden"}`}
                            >
                                {item.name}
                            </div>
                        </button>
                    ))}
                </div>
                {/* END SIDEBAR ITEM CONTAINER */}

            </div>
            {/* SIDEBAR */}
        </>
    );
}
