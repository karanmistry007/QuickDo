import type React from "react"

// ? ================================
// ? TYPE DEFINITIONS
// ? ================================

export interface useStatusFiltersItems {
    name: string
}

export interface useSortDataItems {
    name: string
    sort: string
}

export type DashboardProps = {}

// ? ================================
// ? STATIC DATA - REUSABLE ACROSS PAGES
// ? ================================

// ? STATUS FILTER DATA
export const useStatusFilterData: useStatusFiltersItems[] = [
    { name: "Open" },
    { name: "Completed" },
    { name: "Cancelled" },
]

// ? SORT DATA
export const useSortData: useSortDataItems[] = [
    { name: "Created", sort: "creation" },
    { name: "Modified", sort: "modified" },
    { name: "Importance", sort: "is_important" },
    { name: "Due Date", sort: "date" },
    { name: "Reminder", sort: "send_reminder" },
    { name: "Status", sort: "status" },
    { name: "Description", sort: "description" },
]

// ? ================================
// ? FILTER HANDLER FUNCTIONS
// ? ================================

// ? DYNAMIC HANDLE FILTERS FUNCTION - REUSABLE ACROSS PAGES
export const createFilterHandler = (
    setFilters: React.Dispatch<React.SetStateAction<any[]>>,
    defaultFilter: any[] = [],
) => {
    return (key: string, value: string, filter_type: "single" | "multi" = "multi", child_table = "") => {
        setFilters((prevFilters) => {
            // ? GET DEFAULT FILTER KEYS TO PRESERVE
            const defaultFilterKeys = defaultFilter.map((filter) => filter[0])

            let updatedNonDefaultFilters = prevFilters.filter((f) => !defaultFilterKeys.includes(f[0])) // Start with non-default filters from previous state

            const filterKeyForAction = child_table || key

            // ? APPLY USER ACTION ONLY TO NON-DEFAULT FILTERS
            // ? If the action is on a default filter key, we only allow it if it's a multi-value filter
            // ? and the action is to add a new value, not remove a default value or change a single default value.
            if (!defaultFilterKeys.includes(filterKeyForAction)) {
                // This block handles non-default filters normally
                if (filter_type === "single") {
                    if (value === "" || value === null) {
                        updatedNonDefaultFilters = updatedNonDefaultFilters.filter(
                            (filter: any) => filter[0] !== filterKeyForAction,
                        )
                    } else {
                        const existingIndex = updatedNonDefaultFilters.findIndex((filter: any) => filter[0] === filterKeyForAction)
                        if (existingIndex !== -1) {
                            if (
                                updatedNonDefaultFilters[existingIndex][2] === value ||
                                updatedNonDefaultFilters[existingIndex][1] === value
                            ) {
                                updatedNonDefaultFilters.splice(existingIndex, 1)
                            } else {
                                updatedNonDefaultFilters[existingIndex] = child_table
                                    ? [child_table, key, "=", value]
                                    : [key, "=", value]
                            }
                        } else {
                            updatedNonDefaultFilters.push(child_table ? [child_table, key, "=", value] : [key, "=", value])
                        }
                    }
                } else {
                    // Multi-value
                    const index = updatedNonDefaultFilters.findIndex((filter: any) => filter[0] === filterKeyForAction)
                    const fieldIndex = child_table ? 3 : 2

                    if (index !== -1) {
                        const values = updatedNonDefaultFilters[index][fieldIndex] || []
                        if (values.includes(value)) {
                            updatedNonDefaultFilters[index][fieldIndex] = values.filter((item: string) => item !== value)
                            if (updatedNonDefaultFilters[index][fieldIndex].length === 0) {
                                updatedNonDefaultFilters.splice(index, 1)
                            }
                        } else {
                            updatedNonDefaultFilters[index][fieldIndex] = [...values, value]
                        }
                    } else {
                        updatedNonDefaultFilters.push(child_table ? [child_table, key, "in", [value]] : [key, "in", [value]])
                    }
                }
            }
            // ? If the action was on a default filter key, we do nothing to the non-default filters.
            // ? The default filters will be added back in the final step.

            // ? COMBINE UPDATED NON-DEFAULT FILTERS WITH THE ORIGINAL DEFAULT FILTERS
            const finalFilters = [...updatedNonDefaultFilters, ...defaultFilter]
            return finalFilters
        })
    }
}

// ? HANDLE CLEAR FILTERS FUNCTION - REUSABLE ACROSS PAGES
export const createClearFiltersHandler = (
    setFilters: React.Dispatch<React.SetStateAction<any[]>>,
    defaultFilter: any[] = [],
) => {
    return () => {
        setFilters(defaultFilter)
    }
}

// ? ================================
// ? DATE FILTER UTILITY FUNCTIONS
// ? ================================

// ? GET CURRENT DATE FILTER FROM FILTERS ARRAY
export const getCurrentDateFilter = (filters: any[]) => {
    const dateFilter = filters.find((filter) => filter[0] === "date")
    if (!dateFilter) return null

    // Handle different filter structures
    if (dateFilter[1] === "in" && Array.isArray(dateFilter[2]) && dateFilter[2].length > 0) {
        return dateFilter[2][0] // Return first date from array
    }
    if (dateFilter[1] === "=" && dateFilter[2]) {
        return dateFilter[2] // Return direct value
    }
    return dateFilter[1] // Return direct value (fallback)
}

// ? CONVERT DATE STRING BACK TO DATE OBJECT
export const getDateFromString = (dateString: string | null) => {
    if (!dateString) return undefined
    try {
        // Parse YYYY-MM-DD format
        const [year, month, day] = dateString.split("-").map(Number)
        return new Date(year, month - 1, day) // month is 0-indexed
    } catch {
        return undefined
    }
}

// ? GET CURRENT SELECTED DATE FROM FILTERS (FOR CALENDAR COMPONENT)
export const getSelectedDate = (filters: any[]) => {
    const currentDateFilter = getCurrentDateFilter(filters)
    return getDateFromString(currentDateFilter)
}

// ? GET THE FORMATTED DATE STRING (YYYY-MM-DD)
export const getFormattedDate = (date: Date | undefined) => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

// ? CHECK IF TWO DATES ARE THE SAME DAY
export const isSameDay = (date1: Date | undefined, date2: Date | undefined) => {
    if (!date1 || !date2) return false
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}

// ? ================================
// ? FILTER STATE CHECKER FUNCTIONS
// ? ================================

// ? CHECK IF DATE FILTER IS ACTIVE
export const isDateFilterActive = (filters: any[]) => {
    return filters.some((filter) => filter[0] === "date")
}

// ? CHECK IF STATUS FILTER IS ACTIVE
export const isStatusFilterActive = (filters: any[]) => {
    return filters.some((filter) => filter[0] === "status")
}

// ? CHECK IF CATEGORY FILTER IS ACTIVE
export const isCategoryFilterActive = (filters: any[]) => {
    return filters.some((filter) => filter[0] === "QuickDo Categories")
}

// ? CHECK IF IMPORTANCE FILTER IS ACTIVE
export const isImportanceFilterActive = (filters: any[]) => {
    return filters.some((filter) => filter[0] === "is_important" && (filter[2] === "1" || filter[2]?.includes("1")))
}

// ? CHECK IF REMINDER FILTER IS ACTIVE
export const isReminderFilterActive = (filters: any[]) => {
    return filters.some((filter) => filter[0] === "send_reminder" && (filter[2] === "1" || filter[2]?.includes("1")))
}

// ? GET FILTER COUNT BY TYPE
export const getFilterCount = (filters: any[], filterType: string) => {
    const filter = filters.find((f) => f[0] === filterType)
    if (!filter) return 0

    // For array-based filters (multi-value)
    if (Array.isArray(filter[2])) return filter[2].length
    if (Array.isArray(filter[3])) return filter[3].length

    // For single-value filters
    return filter[2] ? 1 : 0
}

// ? ================================
// ? ADDITIONAL UTILITY FUNCTIONS
// ? ================================

// ? CHECK IF FILTER IS A DEFAULT FILTER (DEEP COMPARISON)
export const isDefaultFilter = (filter: any[], defaultFilters: any[]) => {
    const filterString = JSON.stringify(filter)
    return defaultFilters.some((defaultF) => JSON.stringify(defaultF) === filterString)
}

// ? GET NON-DEFAULT FILTERS ONLY
export const getNonDefaultFilters = (filters: any[], defaultFilters: any[]) => {
    const defaultFilterStrings = defaultFilters.map((filter) => JSON.stringify(filter))
    return filters.filter((filter) => !defaultFilterStrings.includes(JSON.stringify(filter)))
}

// ? GET DEFAULT FILTERS ONLY
export const getDefaultFilters = (filters: any[], defaultFilters: any[]) => {
    const defaultFilterStrings = defaultFilters.map((filter) => JSON.stringify(filter))
    return filters.filter((filter) => defaultFilterStrings.includes(JSON.stringify(filter)))
}

// ? GET ALL ACTIVE FILTER TYPES
export const getActiveFilterTypes = (filters: any[]) => {
    return filters.map((filter) => filter[0])
}

// ? CHECK IF ANY FILTERS ARE ACTIVE
export const hasActiveFilters = (filters: any[]) => {
    return filters.length > 0
}

// ? GET FILTER SUMMARY FOR DISPLAY
export const getFilterSummary = (filters: any[]) => {
    const summary: { [key: string]: any } = {}

    filters.forEach((filter) => {
        const filterType = filter[0]

        if (filter[2] && Array.isArray(filter[2])) {
            // Multi-value filter
            summary[filterType] = filter[2]
        } else if (filter[3] && Array.isArray(filter[3])) {
            // Child table multi-value filter
            summary[filterType] = filter[3]
        } else {
            // Single-value filter
            summary[filterType] = filter[2] || filter[1]
        }
    })

    return summary
}

// ? RESET SPECIFIC FILTER TYPE
export const createResetFilterHandler = (setFilters: React.Dispatch<React.SetStateAction<any[]>>) => {
    return (filterType: string) => {
        setFilters((prevFilters) => {
            return prevFilters.filter((filter) => filter[0] !== filterType)
        })
    }
}

// ? VALIDATE FILTER STRUCTURE
export const validateFilter = (filter: any[]) => {
    if (!Array.isArray(filter) || filter.length < 2) {
        return false
    }

    const [filterType, operator, value] = filter

    if (!filterType || !operator) {
        return false
    }

    // Check for valid operators
    const validOperators = ["=", "in", "!=", ">", "<", ">=", "<=", "like"]
    if (!validOperators.includes(operator)) {
        return false
    }

    return true
}

// ? SANITIZE FILTERS ARRAY
export const sanitizeFilters = (filters: any[]) => {
    return filters.filter(validateFilter)
}
