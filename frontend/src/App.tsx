import { FrappeProvider } from "frappe-react-sdk";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Sidebar from "./components/shared/Sidebar";
import Dashboard from "./pages/Dashboard";
import PrivateRoutes from "./routes/PrivateRoutes";
import Logout from './auth/Logout';


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
					<div className="sm:flex">
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
								path="/list"
								element={<PrivateRoutes element={<Dashboard name="List" link="/list" />} />}
							/>
							<Route
								path="/grid"
								element={<PrivateRoutes element={<Dashboard name="Grid" link="/grid" />} />}
							/>
							<Route
								path="/calendar"
								element={<PrivateRoutes element={<Dashboard name="Calendar" link="/calendar" />} />}
							/>
							<Route
								path="/kanban"
								element={<PrivateRoutes element={<Dashboard name="Kanban" link="/kanban" />} />}
							/>
							<Route
								path="/category"
								element={<PrivateRoutes element={<Dashboard name="Category" link="/category" />} />}
							/>
							{/* END PRIVATE ROUTES */}

						</Routes>
					</div>
				</Router>
			</FrappeProvider>
		</>
	);
}

export default App;
