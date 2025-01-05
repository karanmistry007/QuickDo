app_name = "quickdo"
app_title = "QuickDo"
app_publisher = "Karan Mistry"
app_description = "Introducing our to-do management app, built with React and the Frappe framework. Simplify your task creation and management with an intuitive interface that allows you to categorize and organize your to-dos efficiently. Boost your productivity and stay on top of your tasks with ease."
app_email = "ksmistry007@gmail.com"
app_license = "agpl-3.0"
app_icon = "fa fa-th"
app_color = "#e74c3c"
source_link = "https://github.com/karanmistry007/QuickDo.git"
app_logo_url = "/assets/quickdo/logo.png"
app_home = "/app/quickdos"

# Apps
# ------------------

# required_apps = []

# ? ADD QUICKDO APP TO FRAPPE APPS PAGE
# Each item in the list will be shown as an app in the apps page
add_to_apps_screen = [
    {
        "name": "quickdo",
        "logo": "/assets/quickdo/favicon.png",
        "title": "QuickDo",
        "route": "/app/quickdos",
        # "has_permission": "quickdo.api.permission.has_app_permission",
    }
]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/quickdo/css/quickdo.css"
# app_include_js = "/assets/quickdo/js/quickdo.js"

# include js, css files in header of web template
# web_include_css = "/assets/quickdo/css/quickdo.css"
# web_include_js = "/assets/quickdo/js/quickdo.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "quickdo/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "quickdo/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "quickdo.utils.jinja_methods",
# 	"filters": "quickdo.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "quickdo.install.before_install"
# after_install = "quickdo.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "quickdo.uninstall.before_uninstall"
# after_uninstall = "quickdo.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "quickdo.utils.before_app_install"
# after_app_install = "quickdo.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "quickdo.utils.before_app_uninstall"
# after_app_uninstall = "quickdo.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "quickdo.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"quickdo.tasks.all"
# 	],
# 	"daily": [
# 		"quickdo.tasks.daily"
# 	],
# 	"hourly": [
# 		"quickdo.tasks.hourly"
# 	],
# 	"weekly": [
# 		"quickdo.tasks.weekly"
# 	],
# 	"monthly": [
# 		"quickdo.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "quickdo.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "quickdo.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "quickdo.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["quickdo.utils.before_request"]
# after_request = ["quickdo.utils.after_request"]

# Job Events
# ----------
# before_job = ["quickdo.utils.before_job"]
# after_job = ["quickdo.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"quickdo.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }


# ? SET WEBSITE DYNAMIC ROUTES FOR QUICKDO DASHBOARD
website_route_rules = [
    {"from_route": "/quickdo/<path:app_path>", "to_route": "quickdo"},
]

# ? FIXTURES
# fixtures = [
# {"dt": "Role", "filters": [["name", "in", ["QuickDo User"]]]},
# {"dt": "Custom DocPerm", "filters": [["role", "in", ["QuickDo User"]]]},
#     {"dt":"QuickDo Category","filters":[]},
#     {"dt":"Navbar Settings"},
#     {"dt":"Website Settings"},
#     {"dt": "Kanban Board", "filters": [["reference_doctype", "in", ["QuickDo"]]]},
# ]
