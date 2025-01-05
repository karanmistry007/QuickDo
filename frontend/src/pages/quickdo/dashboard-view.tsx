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
import { useEffect, useState } from "react";
import { fetchDashboardData } from "@/utils/quickdo-dashboard";
import { toast } from "sonner";


const Dashboard = (props: DashboardProps) => {

    // ? HOOKS
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [refreshState, setRefreshState] = useState<boolean>(true);

    // ? NUMBER CARDS
    const [totalUpcomingQuickDoCount, setTotalUpcomingQuickDoCount] = useState<any>(0);
    const [upcomingImportantQuickDoCount, setUpcomingImportantQuickDoCount] = useState<any>(0);
    const [overdueQuickDoCount, setOverdueQuickDoCount] = useState<any>(0);
    const [totalCompletedQuickDoCount, setTotalCompletedQuickDoCount] = useState<any>(0);

    // ? CHARTS
    const [quickdoCreationData, setQuickdoCreationData] = useState<any>([]);
    const [quickdoDueDateData, setQuickdoDueDateData] = useState<any>([]);
    const [quickdoCategoryWiseData, setQuickdoCategoryWiseData] = useState<any>([]);
    const [quickdoStatusWiseData, setQuickdoStatusWiseData] = useState<any>([]);
    const [upcomingImportanceQuickdoData, setUpcomingImportanceQuickdoData] = useState<any>([]);

    // ? REFRESH HANDLER
    const handleRefreshState = (state: boolean) => setRefreshState(state);

    // ? FETCH DATA ON REFRESH STATE CHANGES
    useEffect(() => {

        // ? FETCH TOTAL UPCOMING QUICKDO
        const fetchTotalUpcomingQuickDo = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.get_total_upcoming_quickdo", null),
                ]);
                setTotalUpcomingQuickDoCount(data.data.count)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        // ? FETCH UPCOMING IMPORTANT QUICKDO
        const fetchUpcomingImportantQuickDo = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.get_upcoming_important_quickdo", null),
                ]);
                setUpcomingImportantQuickDoCount(data.data.count)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        // ? FETCH OVERDUE QUICKDO
        const fetchOverdueQuickDo = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.get_overdue_quickdo", null),
                ]);
                setOverdueQuickDoCount(data.data.count)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        // ? FETCH TOTAL COMPLETED QUICKDO
        const fetchTotalCompletedQuickDoCount = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.get_total_completed_quickdo", null),
                ]);
                setTotalCompletedQuickDoCount(data.data.count)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        // ? FETCH QUICKDO CREATION
        const fetchQuickDoCreation = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.quickdo_creation_trend_over_time", null),
                ]);
                setQuickdoCreationData(data.data)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        // ? FETCH QUICKDO DUE DATE
        const fetchQuickDoDueDate = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.quickdo_due_date_trend_over_time", null),
                ]);
                setQuickdoDueDateData(data.data)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        // ? FETCH QUICKDO CATEGORY WISE
        const fetchQuickDoCategoryWise = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.get_quickdo_category_wise", null),
                ]);
                setQuickdoCategoryWiseData(data.data)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        // ? FETCH QUICKDO STATUS WISE
        const fetchQuickDoStatusWise = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.get_status_wise_quickdo", null),
                ]);
                setQuickdoStatusWiseData(data.data)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        // ? FETCH UPCOMING IMPORTANT QUICKDO
        const fetchUpcomingImportanceQuickdo = async () => {
            try {
                const [data] = await Promise.all([
                    fetchDashboardData("quickdo.api.get_important_wise_quickdo", null),
                ]);
                setUpcomingImportanceQuickdoData(data.data)
            } catch (error) {
                console.error(error);
                toast.error("There Was A Problem Loading Data!");
            } finally {
                // setInitialLoading(false);
                // handleRefreshState(false);
            }
        };

        if (refreshState) {
            fetchTotalUpcomingQuickDo();
            fetchUpcomingImportantQuickDo();
            fetchOverdueQuickDo();
            fetchTotalCompletedQuickDoCount();
            fetchQuickDoCreation();
            fetchQuickDoDueDate();
            fetchQuickDoCategoryWise();
            fetchQuickDoStatusWise();
            fetchUpcomingImportanceQuickdo();
        }
    }, [refreshState]);


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
                        number={totalUpcomingQuickDoCount}
                        title="Total Upcoming QuickDo"
                    />
                    <NumberCard
                        icon={HiOutlineStar}
                        number={upcomingImportantQuickDoCount}
                        title="Upcoming Important QuickDo"
                    />
                    <NumberCard
                        icon={AiOutlineExclamationCircle}
                        number={overdueQuickDoCount}
                        title="Overdue QuickDo"
                    />
                    <NumberCard
                        icon={IoMdCheckmarkCircleOutline}
                        number={totalCompletedQuickDoCount}
                        title="Total Completed QuickDo"
                    />
                </div>
                {/* END NUMBER CARD SECTION */}

                {/* CHART ROW 1 */}
                <div className="line-chart-section m-4 sm:m-6 xl:m-10 grid xl:grid-cols-2 gap-4 sm:gap-6 xl:gap-10">
                    <CreationLineChart
                        data={quickdoCreationData}
                    />
                    <DueDateLineChart
                        data={quickdoDueDateData}
                    />
                </div>
                {/* END CHART ROW 1 */}

                {/* CHART ROW 2 */}
                <div className="line-chart-section m-4 sm:m-6 xl:m-10 grid xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-10">
                    <CategoryBarChart
                        data={quickdoCategoryWiseData}
                    />
                    <StatusDonutChart
                        data={quickdoStatusWiseData}
                    />
                    <ImportancePercentageChart
                        data={upcomingImportanceQuickdoData}
                    />
                </div>
                {/* END CHART ROW 2 */}


            </div>
            {/* END DASHBOARD CONTAINER  */}
        </>
    )
}

export default Dashboard