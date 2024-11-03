import { FrappeProvider } from "frappe-react-sdk";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Sidebar from "./components/shared/Sidebar";
import Dashboard from "./pages/DashboardView";
import MyDayView from "./pages/MyDayView";
import PrivateRoutes from "./routes/PrivateRoutes";
import Logout from './auth/Logout';
import CalendarView from "./pages/CalendarView";
import { Toaster } from "sonner"
import KanbanView from "./pages/KanbanView";
import InboxView from "./pages/InboxView";
import GroupByView from "./pages/GroupByView";


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
					<Navbar />
					<Sidebar />

					<Routes>

						{/* PUBLIC ROUTES */}
						<Route
							path="/"
							element={<Navigate to="/dashboard" replace />}
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
							element={<PrivateRoutes element={<MyDayView name="Category" link="/category" />} />}
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
