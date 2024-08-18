import { FrappeProvider } from "frappe-react-sdk";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Sidebar from "./components/shared/Sidebar";
import ListView from "./pages/ListView";
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
								element={<Navigate to="/my-day" replace />}
							/>
							<Route
								path="/auth/logout"
								element={<Logout />}
							/>
							{/* END PUBLIC ROUTES */}

							{/* PRIVATE ROUTES */}
							<Route
								path="/my-day"
								element={<PrivateRoutes element={<ListView name="My Day" link="/my-day" />} />}
							/>
							<Route
								path="/important"
								element={<PrivateRoutes element={<ListView name="Important" link="/important" />} />}
							/>
							<Route
								path="/inbox"
								element={<PrivateRoutes element={<ListView name="Inbox" link="/inbox" />} />}
							/>
							<Route
								path="/planned"
								element={<PrivateRoutes element={<ListView name="Planned" link="/planned" />} />}
							/>
							<Route
								path="/tasks"
								element={<PrivateRoutes element={<ListView name="Tasks" link="/tasks" />} />}
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
