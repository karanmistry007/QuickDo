import NumberCard from "@/components/charts/NumberCard";
import { DashboardProps } from "@/types/Common"


import { MdOutlineUpcoming } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi2";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CreationLineChart } from "@/components/charts/CreationLineChart";
import { DueDateLineChart } from "@/components/charts/DueDateLineChart";
import { CategoryBarChart } from "@/components/charts/CategoryBarChart";
import { StatusDonutChart } from "@/components/charts/StatusDonutChart";
import { ImportancePercentageChart } from "@/components/charts/ImportancePercentageChart";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";


const Dashboard = (props: DashboardProps) => {
    return (
        <>

            {/* NAVBAR */}
            <Navbar />

            {/* SIDEBAR */}
            <Sidebar />

            {/* DASHBOARD CONTAINER  */}
            <div className="dashboard-container  sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] h-auto mt-[134px] sm:mt-0 sm:h-[calc(100dvh_-_60px)] overflow-y-scroll">

                {/* NUMBER CARD SECTION */}
                <div className="number-card-section m-4 sm:m-6 xl:m-10 grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-10">
                    <NumberCard
                        icon={MdOutlineUpcoming}
                        number={0}
                        title="Total Upcoming QuickDo"
                    />
                    <NumberCard
                        icon={HiOutlineStar}
                        number={0}
                        title="Upcoming Important QuickDo"
                    />
                    <NumberCard
                        icon={AiOutlineExclamationCircle}
                        number={0}
                        title="Overdue QuickDo"
                    />
                    <NumberCard
                        icon={IoMdCheckmarkCircleOutline}
                        number={0}
                        title="Total Completed QuickDo"
                    />
                </div>
                {/* END NUMBER CARD SECTION */}

                {/* CHART ROW 1 */}
                <div className="line-chart-section m-4 sm:m-6 xl:m-10 grid xl:grid-cols-2 gap-4 sm:gap-6 xl:gap-10">
                    <CreationLineChart />
                    <DueDateLineChart />
                </div>
                {/* END CHART ROW 1 */}

                {/* CHART ROW 2 */}
                <div className="line-chart-section m-4 sm:m-6 xl:m-10 grid xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-10">
                    <CategoryBarChart />
                    <StatusDonutChart />
                    <ImportancePercentageChart />
                </div>
                {/* END CHART ROW 2 */}


            </div>
            {/* END DASHBOARD CONTAINER  */}
        </>
    )
}

export default Dashboard