"use client"

import type React from "react"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// ? IMPORT ALL UTILITY FUNCTIONS FROM SINGLE FILE
import {
    getSelectedDate,
    getFormattedDate,
    isSameDay,
    isDateFilterActive,
    isStatusFilterActive,
    isCategoryFilterActive,
    isImportanceFilterActive,
    isReminderFilterActive,
    type useStatusFiltersItems,
} from "@/utils/filter-utils"

interface FiltersProps {
    filters: any[]
    useStatusFilterData: useStatusFiltersItems[]
    getAllCategories: any[]
    defaultFilter?: any[]
    handleFilters: (key: string, value: string, filter_type?: "single" | "multi", child_table?: string) => void
    handleClearFilters: () => void
    setRefreshState: (state: boolean) => void
}

const Filters: React.FC<FiltersProps> = ({
    filters,
    useStatusFilterData,
    getAllCategories,
    handleFilters,
    handleClearFilters,
    setRefreshState,
    defaultFilter = [],
}) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)

    // ? HANDLE DATE SELECTION - SINGLE DATE ONLY WITH PROPER HIGHLIGHTING
    const handleDateSelect = (selectedDate: Date | undefined) => {
        const currentSelectedDate = getSelectedDate(filters)

        // ? If clicking on the same date that's already selected, remove the filter
        if (selectedDate && currentSelectedDate && isSameDay(selectedDate, currentSelectedDate)) {
            handleFilters("date", "", "single")
            setDropdownOpen(false)
            return
        }

        // ? If no date selected, remove filter
        if (!selectedDate) {
            handleFilters("date", "", "single")
            setDropdownOpen(false)
            return
        }

        // ? Apply filter for the selected date only
        const formattedDate = getFormattedDate(selectedDate)
        handleFilters("date", formattedDate, "single")

        // ? Close dropdown after selection
        setTimeout(() => {
            setDropdownOpen(false)
        }, 150)
    }

    // ? HANDLE IMPORTANCE FILTER WITH DROPDOWN CLOSE
    const handleImportanceFilter = () => {
        handleFilters("is_important", "1", "single")
        setTimeout(() => {
            setDropdownOpen(false)
        }, 150)
    }

    // ? HANDLE REMINDER FILTER WITH DROPDOWN CLOSE
    const handleReminderFilter = () => {
        handleFilters("send_reminder", "1", "single")
        setTimeout(() => {
            setDropdownOpen(false)
        }, 150)
    }

    return (
        <div className="filters-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm sm:order-2">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="font-normal bg-transparent">
                        Filters
                        {/* // ? ALWAYS SHOW COUNTER BADGE - EMPTY SPACE WHEN NO FILTERS */}
                        <span
                            className={`ml-2 rounded-full px-2 py-0.5 text-xs min-w-[20px] text-center ${filters.length > 0 ? "bg-primary text-primary-foreground" : "bg-transparent text-transparent"
                                }`}
                        >
                            {filters.length > 0 ? filters.length : "0"}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {/* // ? STATUS FILTERS - MULTI-VALUE WITH RIGHT-SIDE CHECKBOX */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className={isStatusFilterActive(filters) ? "bg-accent" : ""}>
                                <div className="flex items-center justify-between w-full">
                                    <span>Status</span>
                                    <div className="flex items-center gap-1">
                                        {isStatusFilterActive(filters) && <Check className="h-4 w-4 text-primary" />}
                                    </div>
                                </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {useStatusFilterData.length > 0 &&
                                        useStatusFilterData.map((data, index) => (
                                            <DropdownMenuCheckboxItem
                                                key={index}
                                                checked={filters.some((filter) => filter[0] === "status" && filter[2]?.includes(data.name))}
                                                onCheckedChange={() => handleFilters("status", data.name, "multi")}
                                            >
                                                {data.name}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        {/* // ? CATEGORY FILTERS - MULTI-VALUE WITH RIGHT-SIDE CHECKBOX */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className={isCategoryFilterActive(filters) ? "bg-accent" : ""}>
                                <div className="flex items-center justify-between w-full">
                                    <span>Category</span>
                                    <div className="flex items-center gap-1">
                                        {isCategoryFilterActive(filters) && <Check className="h-4 w-4 text-primary" />}
                                    </div>
                                </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="categories-items max-h-[240px] w-[200px] overflow-x-hidden whitespace-nowrap text-ellipsis overflow-y-auto">
                                    {getAllCategories.length > 0 &&
                                        getAllCategories.map((data, index) => (
                                            <DropdownMenuCheckboxItem
                                                key={index}
                                                title={data.category}
                                                checked={filters.some(
                                                    (filter) => filter[0] === "QuickDo Categories" && filter[3]?.includes(data.category),
                                                )}
                                                onCheckedChange={() => handleFilters("category", data.category, "multi", "QuickDo Categories")}
                                            >
                                                {data.category}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        {/* // ? DUE DATE FILTER - SINGLE DATE SELECTION WITH RIGHT-SIDE CHECKBOX */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className={isDateFilterActive(filters) ? "bg-accent" : ""}>
                                <div className="flex items-center justify-between w-full">
                                    <span>Due Date</span>
                                    <div className="flex items-center gap-1">
                                        {isDateFilterActive(filters) && <Check className="h-4 w-4 text-primary" />}
                                    </div>
                                </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={getSelectedDate(filters)}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                        className="rounded-md border-0"
                                    />
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        {/* // ? IMPORTANCE FILTER - SINGLE-VALUE WITH RIGHT-SIDE CHECKBOX AND DROPDOWN CLOSE */}
                        <DropdownMenuItem
                            className={`flex items-center justify-between w-full ${isImportanceFilterActive(filters) ? "bg-accent" : ""}`}
                            onClick={handleImportanceFilter}
                        >
                            <span>Importance</span>
                            <div className="flex items-center gap-1">
                                {isImportanceFilterActive(filters) && <Check className="h-4 w-4 text-primary" />}
                            </div>
                        </DropdownMenuItem>

                        {/* // ? REMINDER FILTER - SINGLE-VALUE WITH RIGHT-SIDE CHECKBOX AND DROPDOWN CLOSE */}
                        <DropdownMenuItem
                            className={`flex items-center justify-between w-full ${isReminderFilterActive(filters) ? "bg-accent" : ""}`}
                            onClick={handleReminderFilter}
                        >
                            <span>Reminder</span>
                            <div className="flex items-center gap-1">
                                {isReminderFilterActive(filters) && <Check className="h-4 w-4 text-primary" />}
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* // ? CLEAR FILTERS */}
            <button
                className="clear-filters px-3 py-2 text-[20px] hover:bg-accent rounded-r-md transition-colors"
                onClick={() => {
                    handleClearFilters()
                    setRefreshState(true)
                }}
                title="Clear Filters"
            >
                <X
                    className={`h-5 w-5 transition-transform duration-300 ${defaultFilter
                        ? filters.length === defaultFilter.length
                            ? "rotate-45"
                            : "rotate-180"
                        : filters.length === 0
                            ? "rotate-45"
                            : "rotate-180"
                        }`}
                />
            </button>
        </div>
    )
}

export default Filters
