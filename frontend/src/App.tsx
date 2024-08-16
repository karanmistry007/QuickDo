import { FrappeProvider } from 'frappe-react-sdk'
import Header from './components/shared/Header'
import Sidebar from './components/shared/Sidebar'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';


function App() {

	//? GET SITE NAME
	const getSiteName = () => {
		// @ts-ignore
		if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
			// @ts-ignore
			return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME
		}
		return import.meta.env.VITE_SITE_NAME
	}

	return (
		<div className="App">
			<FrappeProvider
				socketPort={import.meta.env.VITE_SOCKET_PORT}
				siteName={getSiteName()}
				enableSocket={false}
			>
				<Router basename="/quickdo">
					<Header />
					<div className='sm:flex'>
						<Sidebar />
						<Routes>
							<Route path="/" element={<Navigate to="/my-day/list" replace />} />
							<Route path="/my-day/list" element={<Dashboard name="My Day" link="/my-day/list" />} />
							<Route path="/important/list" element={<Dashboard name="Important" link="/important/list" />} />
							<Route path="/inbox/list" element={<Dashboard name="Inbox" link="/inbox/list" />} />
							<Route path="/planned/list" element={<Dashboard name="Planned" link="/planned/list" />} />
							<Route path="/tasks/list" element={<Dashboard name="Tasks" link="/tasks/list" />} />
						</Routes>
					</div>
				</Router>
			</FrappeProvider>
		</div>
	)
}

export default App
