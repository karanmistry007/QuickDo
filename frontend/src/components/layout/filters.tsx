import React from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { IoClose } from "react-icons/io5";
import { Button } from "../ui/button";

interface FiltersProps {
    filters: any[];
    useStatusFilterData: any[];
    getAllCategories: any[];
    handleFilters: (type: string, value: string, label?: string) => void;
    handleClearFilters: () => void;
    setRefreshState: (state: boolean) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, useStatusFilterData, getAllCategories, handleFilters, handleClearFilters, setRefreshState }) => {

    return (
        <div className="filters-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm sm:order-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="font-normal">Filters</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        {/* STATUS FILTERS */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {useStatusFilterData.length > 0 && useStatusFilterData.map((data, index) => (
                                        <DropdownMenuCheckboxItem
                                            key={index}
                                            checked={filters.some(filter => filter[0] === "status" && filter[2]?.includes(data.name))}
                                            onCheckedChange={() => handleFilters("status", data.name)}
                                        >
                                            {data.name}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        {/* CATEGORY FILTERS */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="categories-items max-h-[240px] overflow-y-auto">
                                    {getAllCategories.length > 0 && getAllCategories.map((data, index) => (
                                        <DropdownMenuCheckboxItem
                                            key={index}
                                            checked={filters.some(filter => filter[0] === "QuickDo Categories" && filter[3]?.includes(data.category))}
                                            onCheckedChange={() => handleFilters("category", data.category, "QuickDo Categories")}
                                        >
                                            {data.category}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        {/* DUE DATE FILTER */}
                        <DropdownMenuItem>
                            Due Date
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        {/* IMPORTANCE FILTER */}
                        <DropdownMenuCheckboxItem
                            checked={filters.some(filter => filter[0] === "is_important" && filter[2]?.includes("1"))}
                            onCheckedChange={() => handleFilters("is_important", "1")}
                        >
                            Importance
                        </DropdownMenuCheckboxItem>

                        {/* REMINDER FILTER */}
                        <DropdownMenuCheckboxItem
                            checked={filters.some(filter => filter[0] === "send_reminder" && filter[2]?.includes("1"))}
                            onCheckedChange={() => handleFilters("send_reminder", "1")}
                        >
                            Reminder
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* CLEAR FILTERS */}
            <button
                className="clear-filters px-3 py-2 text-[20px]"
                onClick={() => {
                    handleClearFilters();
                    setRefreshState(true);
                }}
            >
                <IoClose title="Clear Filters" className={`text-xl transition-transform duration-300 ${filters.length === 0 ? "rotate-45" : "rotate-180"}`} />
            </button>
        </div>
    );
};

export default Filters;
