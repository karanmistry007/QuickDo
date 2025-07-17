frappe.views.calendar["QuickDo"] = {
	field_map: {
		start: "date",
		end: "date",
		id: "id",
		title: "description",
		allDay: 1,
		progress: 100,
		color: "color",
	},
	gantt: true,
	color: "color",
	filters: [],
	get_events_method: "frappe.desk.calendar.get_events",
};
