import frappe
from frappe.core.doctype.user.user import generate_keys


#! api/method/quickdo.api.get_todo_with_categories
# ? TODO LIST API WITH CATEGORIES
@frappe.whitelist(allow_guest=1)
def get_quickdo_with_categories(
    doctype,
    filters=None,
    fields=None,
    order_by=None,
):
    # ? FINAL DATA
    final_data = []

    try:
        # ? PARENT TODO LIST
        todo_list = frappe.get_list(
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
        hash_map = {todo.name: todo for todo in todo_list}

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
        final_data = [todo for id, todo in hash_map.items()]

    except Exception as e:
        return f"Unexpected Error: {str(e)}"

    else:
        return final_data


#! api/method/quickdo.api.get_login_keys
# ? LOGIN API KEY AND API SECRET
@frappe.whitelist(allow_guest=1)
def get_login_keys(user):

    # ? FINAL DATA
    final_data = {}

    try:

        # ? CHECK IF THE USER EXIST WITH THE SAME ID
        if frappe.db.exists("User", user):
            print("\n\n\n\nUSER")

            api_key = frappe.db.get_value("User", user, "api_key")
            api_secret = (
                frappe.get_doc("User", user).get_password("api_secret")
                if frappe.db.get_value("User", user, "api_secret")
                else None
            )

            print("\n\n\n\n\n", frappe.get_doc("User", user).get("api_key"), api_secret)

            if api_key and api_secret:
                print("\n\n\n\nBOTH EXISTS")
                final_data["api_key"] = frappe.db.get_value("User", user, "api_key")
                final_data["api_secret"] = frappe.get_doc("User", user).get_password(
                    "api_secret"
                )

            elif api_key and not api_secret:
                print("\n\n\n\nELIF")
                final_data["api_key"] = frappe.db.get_value("User", user, "api_key")
                final_data["api_secret"] = generate_keys(user).get("api_secret")

            elif not api_key and not api_secret:
                print("\n\n\n\nELSE")
                final_data["api_secret"] = generate_keys(user).get("api_secret")
                final_data["api_key"] = frappe.db.get_value("User", user, "api_key")

    except Exception as e:
        frappe.db.rollback()
        frappe.throw(str(e))

    else:
        frappe.db.commit()
        return final_data
