import frappe
from frappe.core.doctype.user.user import generate_keys
import frappe.utils
from frappe.utils.dateutils import getdate


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
            filters=frappe.parse_json(filters),
            fields=frappe.parse_json(fields),
            order_by=order_by,
        )

        # ? CHILD CATEGORY LIST
        categories_list = frappe.get_all(
            "QuickDo Categories",
            filters={},
            fields=["category", "parent"],
        )

        # ? HASH MAP FOR PARENT CHILD MAPPING
        hash_map = {quickdo.name: quickdo for quickdo in quickdo_list}

        # ? MAP THE CHILD RECORDS WITH PARENTS
        for category in categories_list:

            # ? IF PARENT EXISTS IN HASH MAP
            if category.parent in hash_map:

                # ? IF CATEGORIES LIST EXISTS IN HASH MAP
                if hash_map.get(category.parent).get("categories"):
                    hash_map[category.parent]["categories"].append(
                        {"category": category.category}
                    )
                else:
                    hash_map[category.parent]["categories"] = [
                        {"category": category.category}
                    ]

        # ? FINAL DATA MAPPING
        final_data = [quickdo for id, quickdo in hash_map.items()]

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
            fields=["name","date", "creation", "description","color","is_important","send_reminder"],
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
