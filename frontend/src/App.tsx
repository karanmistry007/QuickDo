import { FrappeProvider } from "frappe-react-sdk";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Dashboard from "@/pages/quickdo/dashboard-view";
import MyDayView from "@/pages/quickdo/my-day-view";
import PrivateRoutes from "./routes/PrivateRoutes";
import Logout from './auth/Logout';
import CalendarView from "@/pages/quickdo/calendar-view";
import { Toaster } from "sonner"
import KanbanView from "@/pages/quickdo/kanban-view";
import InboxView from "@/pages/quickdo/inbox-view";
import GroupByView from "@/pages/quickdo/group-by-view";
import CategoryView from "@/pages/category/category-view";
import Login from "@/pages/auth/login";
import SignUp from "@/pages/auth/sign-up";


const App = () => {

	//? GET SITE NAME
	const getSiteName = () => {
		// @ts-ignore
		if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith("15") || window.frappe.boot.versions.frappe.startsWith("16"))) {
			// @ts-ignore
			return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME;
		}
		return import.meta.env.VITE_SITE_NAME;
	};

	return (
		<>
			<FrappeProvider
				socketPort={import.meta.env.VITE_SOCKET_PORT}
				siteName={getSiteName()}
				enableSocket={false}
			>
				<Router basename="/quickdo">
					<Routes>

						{/* PUBLIC ROUTES */}
						<Route
							path="/"
							element={<Navigate to="/dashboard" replace />}
						/>
						<Route
							path="/auth/login"
							element={<Login />}
						/>
						<Route
							path="/auth/sign-up"
							element={<SignUp />}
						/>
						<Route
							path="/auth/logout"
							element={<Logout />}
						/>
						{/* END PUBLIC ROUTES */}

						{/* PRIVATE ROUTES */}
						<Route
							path="/dashboard"
							element={<PrivateRoutes element={<Dashboard name="Dashboard" link="/dashboard" />} />}
						/>
						<Route
							path="/my-day"
							element={<PrivateRoutes element={<MyDayView name="My Day" link="/my-day" />} />}
						/>
						<Route
							path="/group-by"
							element={<PrivateRoutes element={<GroupByView name="Group By" link="/group-by" />} />}
						/>
						<Route
							path="/inbox"
							element={<PrivateRoutes element={<InboxView name="Inbox" link="/inbox" />} />}
						/>
						<Route
							path="/kanban"
							element={<PrivateRoutes element={<KanbanView name="Inbox" link="/kanban" />} />}
						/>
						<Route
							path="/calendar"
							element={<PrivateRoutes element={<CalendarView name="Calendar" link="/calendar" />} />}
						/>
						<Route
							path="/category"
							element={<PrivateRoutes element={<CategoryView name="Category" link="/category" />} />}
						/>
						{/* END PRIVATE ROUTES */}

					</Routes>
				</Router>
				<Toaster richColors />
			</FrappeProvider>
		</>
	);
}

export default App;
