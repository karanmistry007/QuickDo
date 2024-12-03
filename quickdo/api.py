import frappe
from frappe.core.doctype.user.user import generate_keys

# import frappe.utils
from frappe.utils import add_days, add_months
from frappe.utils.dateutils import getdate
from datetime import datetime, timedelta


#! api/method/quickdo.api.get_todo_with_categories
# ? QUICKDO LIST API WITH CATEGORIES
@frappe.whitelist()
def get_quickdo_with_categories(
    doctype,
    filters=None,
    fields=None,
    order_by=None,
):
    # ? FINAL DATA
    final_data = []

    try:
        # ? PARENT QUICKDO LIST
        quickdo_list = frappe.get_list(
            doctype=doctype,
            filters=frappe.parse_json(filters) if filters else {},
            fields=frappe.parse_json(fields) if fields else ["name"],
            order_by=order_by,
        )

        # ? CHILD CATEGORY LIST
        categories_list = frappe.get_all(
            "QuickDo Categories",
            filters={},
            fields=["category", "parent"],
        )

        # ? HASH MAP FOR PARENT CHILD MAPPING
        hash_map = {}

        # ? Map categories directly to their parent
        for category in categories_list:
            if category.parent not in hash_map:
                hash_map[category.parent] = {"categories": []}
            hash_map[category.parent]["categories"].append(
                {"category": category.category}
            )

        # ? MAP THE CHILD RECORDS WITH PARENTS
        for quickdo in quickdo_list:
            quickdo_data = quickdo
            quickdo_data["categories"] = hash_map.get(quickdo.name, {}).get(
                "categories", []
            )
            final_data.append(quickdo_data)

    except Exception as e:
        return f"Unexpected Error: {str(e)}"

    else:
        return final_data


#! api/method/quickdo.api.get_quickdo_calendar_data
# ? QUICKDO CALENDAR DATA
@frappe.whitelist()
def get_quickdo_calendar_data(
    filters=None,
):

    try:
        # ? QUICKDO LIST
        quickdo_list = frappe.get_list(
            doctype="QuickDo",
            filters=frappe.parse_json(filters),
            fields=[
                "name",
                "date",
                "creation",
                "description",
                "color",
                "is_important",
                "send_reminder",
            ],
            # order_by="modified asc",
        )

        # ? MAP QUICKDO WITH THE NEW FIELDS
        for quickdo in quickdo_list:

            # ? IF THE DATE IS NOT SET MAKE CREATION AS END DATE
            if not quickdo.get("date"):
                quickdo["date"] = getdate(quickdo.get("creation"))

            # ? MAP FIELDS
            quickdo["title"] = quickdo.get("description")
            quickdo["start"] = quickdo.get("date")
            quickdo["end"] = quickdo.get("date")

            # ? REMOVE UNUSED FIELDS
            quickdo.pop("creation", None)
            quickdo.pop("description", None)
            quickdo.pop("date", None)

    except Exception as e:
        return f"Unexpected Error: {str(e)}"

    else:
        return quickdo_list


#! api/method/quickdo.api.get_total_upcoming_quickdo
# ? TOTAL UPCOMING QUICKDO
@frappe.whitelist()
def get_total_upcoming_quickdo():
    try:
        quickdo_list = frappe.get_list(
            "QuickDo",
            filters={
                "status": "Open",
            },
            fields=["name"],
        )
        quickdo_count = len(quickdo_list)

    except Exception as e:
        frappe.log_error("Error While Getting Total Upcoming QuickDos", str(e))
        return {
            "success": False,
            "message": "Error While Getting Total Upcoming QuickDos!",
            "data": None,
        }

    else:
        return {
            "success": True,
            "message": "Total Upcoming QuickDos Are Loaded Successfully!",
            "data": {
                "count": quickdo_count,
            },
        }


#! api/method/quickdo.api.get_upcoming_important_quickdo
# ? UPCOMING QUICKDO
@frappe.whitelist()
def get_upcoming_important_quickdo():
    try:
        quickdo_list = frappe.get_list(
            "QuickDo",
            filters={
                "status": "Open",
                "is_important": 1,
            },
            fields=["name"],
        )
        quickdo_count = len(quickdo_list)

    except Exception as e:
        frappe.log_error(
            "Error While Getting Total Upcoming Important QuickDos", str(e)
        )
        return {
            "success": False,
            "message": "Error While Getting Upcoming Important QuickDos!",
            "data": None,
        }

    else:
        return {
            "success": True,
            "message": "Upcoming Important QuickDos Are Loaded Successfully!",
            "data": {
                "count": quickdo_count,
            },
        }


#! api/method/quickdo.api.get_overdue_quickdo
# ? OVERDUE QUICKDO
@frappe.whitelist()
def get_overdue_quickdo():
    try:
        current_date = getdate(datetime.today())
        quickdo_list = frappe.get_list(
            "QuickDo",
            filters={
                "status": "Open",
                "date": ["<", current_date],
            },
            fields=["name"],
        )
        quickdo_count = len(quickdo_list)

    except Exception as e:
        frappe.log_error("Error While Getting Total Overdue QuickDos", str(e))
        return {
            "success": False,
            "message": "Error While Getting Overdue QuickDos!",
            "data": None,
        }

    else:
        return {
            "success": True,
            "message": "Overdue QuickDos Are Loaded Successfully!",
            "data": {
                "count": quickdo_count,
            },
        }


#! api/method/quickdo.api.get_total_completed_quickdo
# ? TOTAL COMPLETED QUICKDO
@frappe.whitelist()
def get_total_completed_quickdo():
    try:
        quickdo_list = frappe.get_list(
            "QuickDo",
            filters={
                "status": "Completed",
            },
            fields=["name"],
        )
        quickdo_count = len(quickdo_list)

    except Exception as e:
        frappe.log_error("Error While Getting Total Completed QuickDos", str(e))
        return {
            "success": False,
            "message": "Error While Getting Total Completed QuickDos!",
            "data": None,
        }

    else:
        return {
            "success": True,
            "message": "Total Completed QuickDos Are Loaded Successfully!",
            "data": {
                "count": quickdo_count,
            },
        }


#! api/method/quickdo.api.get_quickdo_category_wise
# TODO NEED TO ADD PERMISSIONS
# ? QUICKDO CATEGORY WISE
@frappe.whitelist()
def get_quickdo_category_wise():
    try:

        # ? GET THE CATEGORY LIST
        quickdo_category_list = frappe.get_all(
            "QuickDo Category",
            fields=["name", "category"],
            order_by="category asc",
        )

        # ? GET QUICKDO LIST
        quickdo_data_list = frappe.get_all(
            "QuickDo Categories",
            fields=["category"],
            order_by="category asc",
        )

        # ? CREATE A HASH MAP FOR MAPPING DATA
        hash_map = {
            category.get("category"): sum(
                1
                for quickdo in quickdo_data_list
                if quickdo.get("category") == category.get("category")
            )
            for category in quickdo_category_list
        }

        # ? GET CATEGORY WISE QUICKDO COUNT
        quickdo_count = [
            {"category": key, "quickdo": value} for key, value in hash_map.items()
        ]

        # ? SORT QUICKDO COUNT WISE HIGH TO LOW
        quickdo_count = sorted(quickdo_count, key=lambda x: x["quickdo"], reverse=True)

    except Exception as e:
        frappe.log_error("Error While Getting Total Completed QuickDos", str(e))
        return {
            "success": False,
            "message": "Error While Getting Total Completed QuickDos!",
            "data": None,
        }

    return {
        "success": True,
        "message": "Total Completed QuickDos Are Loaded Successfully!",
        "data": quickdo_count,
    }


#! api/method/quickdo.api.get_status_wise_quickdo
# ? STATUS WISE QUICKDO
@frappe.whitelist()
def get_status_wise_quickdo():
    try:

        # ? OPEN QUICKDO LIST
        open_quickdo_list = frappe.get_list(
            "QuickDo",
            filters={
                "status": "Open",
            },
            fields=["name"],
        )

        # ? OPEN QUICKDO COUNT
        open_quickdo_count = len(open_quickdo_list)

        # ? CANCELLED QUICKDO LIST
        cancelled = frappe.get_list(
            "QuickDo",
            filters={
                "status": "Cancelled",
            },
            fields=["name"],
        )

        # ? CANCELLED QUICKDO COUNT
        cancelled_quickdo_count = len(cancelled)

        # ? COMPLETED QUICKDO LIST
        completed_quickdo_list = frappe.get_list(
            "QuickDo",
            filters={
                "status": "Completed",
            },
            fields=["name"],
        )

        # ? COMPLETED QUICKDO COUNT
        completed_quickdo_count = len(completed_quickdo_list)

        # ? MERGE DATASET
        final_data = [
            {"status": "Open", "quickdo": open_quickdo_count, "fill": "#3c50e0"},
            {
                "status": "Completed",
                "quickdo": completed_quickdo_count,
                "fill": "#29CD42",
            },
            {
                "status": "Cancelled",
                "quickdo": cancelled_quickdo_count,
                "fill": "#CB2929",
            },
        ]
    except Exception as e:
        frappe.log_error("Error While Getting Total Completed QuickDos", str(e))
        return {
            "success": False,
            "message": "Error While Getting Total Completed QuickDos!",
            "data": None,
        }

    else:
        return {
            "success": True,
            "message": "Total Completed QuickDos Are Loaded Successfully!",
            "data": {
                "count": final_data,
            },
        }


#! api/method/quickdo.api.get_important_wise_quickdo
# ? IMPORTANCE WISE QUICKDO
@frappe.whitelist()
def get_important_wise_quickdo():
    try:

        # ? TOTAL QUICKDO LIST
        total_quickdo_list = frappe.get_list(
            "QuickDo",
            filters={},
            fields=["name"],
        )

        # ? TOTAL QUICKDO COUNT
        total_quickdo_count = len(total_quickdo_list)

        # ? IMPORTANT QUICKDO LIST
        important_quickdo_list = frappe.get_list(
            "QuickDo",
            filters={
                "is_important": 1,
            },
            fields=["name"],
        )

        # ? IMPORTANT QUICKDO COUNT
        important_quickdo_count = len(important_quickdo_list)

        # ? MERGE DATASET
        final_data = [
            {
                "important": important_quickdo_count,
                "total": total_quickdo_count,
                "fill": "#3c50e0",
            }
        ]

    except Exception as e:
        frappe.log_error("Error While Getting Total Completed QuickDos", str(e))
        return {
            "success": False,
            "message": "Error While Getting Total Completed QuickDos!",
            "data": None,
        }

    else:
        return {
            "success": True,
            "message": "Total Completed QuickDos Are Loaded Successfully!",
            "data": {
                "count": final_data,
            },
        }


# ! api/method/quickdo.api.quickdo_creation_trend_over_time
# ? QUICKDO CREATION TREND OVER TIME
@frappe.whitelist()
def quickdo_creation_trend_over_time(
    frequency="monthly",
    month=None,
    year=None,
):
    # DEFINE A DICTIONARY FOR MONTHS
    months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    }
    try:
        # ? GET TODAY'S DATE AND SET DEFAULT MONTH AND YEAR
        today = getdate(datetime.today())
        month = month or today.month
        year = year or today.year

        # ? INITIALIZE VARIABLES FOR CHART DATA
        data = []

        # ? FREQUENCY BASED CONDITIONS: DAILY, WEEKLY, OR MONTHLY
        # ? LOGIC FOR DAILY FREQUENCY
        if frequency == "daily":
            # CALCULATE DAYS IN THE MONTH
            start_date = getdate(f"{year}-{month}-01")
            days_in_month = (add_months(start_date, 1) - start_date).days

            for day in range(1, days_in_month + 1):
                day_label = f"{str(day).zfill(2)}-{str(month).zfill(2)}-{year}"
                count_data = frappe.db.get_list(
                    "QuickDo",
                    filters=[
                        ["creation", "=", getdate(f"{year}-{month}-{day}")],
                    ],
                    fields=["count(name) as task_count"],
                )
                count = count_data[0].task_count if count_data else 0
                data.append({"label": day_label, "value": count})

        elif frequency == "weekly":
            # ? LOGIC FOR WEEKLY FREQUENCY
            start_date = getdate(f"{year}-{month}-01")
            week = 1

            # ? GET THE LAST DAY OF THE MONTH
            last_day_of_month = add_months(start_date, 1) - timedelta(days=1)

            while start_date <= last_day_of_month:
                week_end = min(add_days(start_date, 6), last_day_of_month)
                count_data = frappe.db.get_list(
                    "QuickDo",
                    filters=[
                        ["creation", "between", [start_date, week_end]],
                    ],
                    fields=["count(name) as task_count"],
                )
                count = count_data[0].task_count if count_data else 0
                data.append({"label": f"Week {week}", "value": count})

                week += 1
                start_date = add_days(week_end, 1)

        elif frequency == "monthly":
            # ? LOGIC FOR MONTHLY FREQUENCY
            for month_num in range(1, 13):
                start_date = getdate(f"{year}-{month_num}-01")
                end_date = add_months(start_date, 1) - timedelta(days=1)
                count_data = frappe.db.get_list(
                    "QuickDo",
                    filters=[
                        ["creation", "between", [start_date, end_date]],
                    ],
                    fields=["count(name) as task_count"],
                )
                count = count_data[0].task_count if count_data else 0
                data.append({"label": months[month_num], "value": count})

        # ? IF DATA IS EMPTY, LOG FOR DEBUGGING
        if not data:
            frappe.log_error(
                "task_completions_trend_over_time",
                "No data found for the frequency: {frequency} in {month}/{year}",
            )

    except Exception as e:
        # ? LOG ERROR IF AN EXCEPTION OCCURS
        frappe.log_error("Error in task_completions_trend", str(e))
        return {
            "success": False,
            "message": str(e),
            "data": None,
        }

    else:
        # ? RETURN RESPONSE WITH SUCCESS MESSAGE AND DATA
        return {
            "success": True,
            "data": data,
        }


# ! api/method/quickdo.api.quickdo_due_date_trend_over_time
# ? QUICKDO DUE DATE TREND OVER TIME
@frappe.whitelist()
def quickdo_due_date_trend_over_time(
    frequency="monthly",
    month=None,
    year=None,
):
    # DEFINE A DICTIONARY FOR MONTHS
    months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    }
    try:
        # ? GET TODAY'S DATE AND SET DEFAULT MONTH AND YEAR
        today = getdate(datetime.today())
        month = month or today.month
        year = year or today.year

        # ? INITIALIZE VARIABLES FOR CHART DATA
        data = []

        # ? FREQUENCY BASED CONDITIONS: DAILY, WEEKLY, OR MONTHLY
        # ? LOGIC FOR DAILY FREQUENCY
        if frequency == "daily":
            # CALCULATE DAYS IN THE MONTH
            start_date = getdate(f"{year}-{month}-01")
            days_in_month = (add_months(start_date, 1) - start_date).days

            for day in range(1, days_in_month + 1):
                day_label = f"{str(day).zfill(2)}-{str(month).zfill(2)}-{year}"
                count_data = frappe.db.get_list(
                    "QuickDo",
                    filters=[
                        ["date", "=", getdate(f"{year}-{month}-{day}")],
                    ],
                    fields=["count(name) as task_count"],
                )
                count = count_data[0].task_count if count_data else 0
                data.append({"label": day_label, "value": count})

        elif frequency == "weekly":
            # ? LOGIC FOR WEEKLY FREQUENCY
            start_date = getdate(f"{year}-{month}-01")
            week = 1

            # ? GET THE LAST DAY OF THE MONTH
            last_day_of_month = add_months(start_date, 1) - timedelta(days=1)

            while start_date <= last_day_of_month:
                week_end = min(add_days(start_date, 6), last_day_of_month)
                count_data = frappe.db.get_list(
                    "QuickDo",
                    filters=[
                        ["date", "between", [start_date, week_end]],
                    ],
                    fields=["count(name) as task_count"],
                )
                count = count_data[0].task_count if count_data else 0
                data.append({"label": f"Week {week}", "value": count})

                week += 1
                start_date = add_days(week_end, 1)

        elif frequency == "monthly":
            # ? LOGIC FOR MONTHLY FREQUENCY
            for month_num in range(1, 13):
                start_date = getdate(f"{year}-{month_num}-01")
                end_date = add_months(start_date, 1) - timedelta(days=1)
                count_data = frappe.db.get_list(
                    "QuickDo",
                    filters=[
                        ["date", "between", [start_date, end_date]],
                    ],
                    fields=["count(name) as task_count"],
                )
                count = count_data[0].task_count if count_data else 0
                data.append({"label": months[month_num], "value": count})

        # ? IF DATA IS EMPTY, LOG FOR DEBUGGING
        if not data:
            frappe.log_error(
                "task_completions_trend_over_time",
                "No data found for the frequency: {frequency} in {month}/{year}",
            )

    except Exception as e:
        # ? LOG ERROR IF AN EXCEPTION OCCURS
        frappe.log_error("Error in task_completions_trend", str(e))
        return {
            "success": False,
            "message": str(e),
            "data": None,
        }

    else:
        # ? RETURN RESPONSE WITH SUCCESS MESSAGE AND DATA
        return {
            "success": True,
            "data": data,
        }


# ! api/method/quickdo.api.register_user
# ? USER REGISTER API
@frappe.whitelist(allow_guest=1)
def register_user(full_name, email, password, redirect_to="/quickdo"):
    try:
        # ? CHECK IF THE USER IS ALREADY REGISTERED
        user = frappe.db.get("User", {"email": email})

        # ? IF THE USER IS REGISTERED
        if user:

            # ? IF THE USE IS ENABLED
            if user.enabled:
                return {
                    "success": False,
                    "message": f"User is already registered!: {email}",
                }

            # ? IF THE USE IS DISABLED
            else:
                return {
                    "success": False,
                    "message": f"User is disabled!: {email}",
                }

        # ? IF THE USE DOES NOT EXISTS
        else:
            user = frappe.get_doc(
                {
                    "doctype": "User",
                    "email": email,
                    "first_name": full_name,
                    "enabled": 1,
                    "new_password": password,
                    "user_type": "System User",
                }
            )
            user.flags.ignore_permissions = True
            user.flags.ignore_password_policy = True
            user.insert()

            # ! FOR NOW AS A SYSTEM MANAGER
            # ? SET DEFAULT ROLES TO THE USER
            default_role = "System Manager"
            if default_role:
                user.add_roles(default_role)

            # ? SET THE DEFAULT REDIRECT PATH AFTER LOGIN
            if redirect_to:
                frappe.cache.hset("redirect_after_login", user.name, redirect_to)

            frappe.db.commit()

    # ? IF ERROR OCCURRED
    except Exception as e:
        frappe.db.rollback()
        return {
            "success": False,
            "message": f"Something went wrong!: {str(e)}",
        }

    # ? IF EVERYTHING GOES WELL
    else:
        return {
            "success": True,
            "message": f"User has been registered successfully!: {email}",
        }
