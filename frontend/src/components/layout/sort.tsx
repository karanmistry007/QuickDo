import React from "react";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { BsSortDownAlt, BsSortUp } from "react-icons/bs";
import { useSortDataItems } from "@/types/Common";

interface SortProps {
    currentSort: string;
    currentSortDirection: string;
    // useSortData: { name: string; sort: string }[];
    setCurrentSort: (sort: string) => void;
    setCurrentSortDirection: (direction: string) => void;
    setRefreshState: (state: boolean) => void;
}

// ? DEFINE SORTING DATA
const useSortData: useSortDataItems[] = [
    { name: "Created", sort: "creation" },
    { name: "Modified", sort: "modified" },
    { name: "Importance", sort: "is_important" },
    { name: "Due Date", sort: "date" },
    { name: "Reminder", sort: "send_reminder" },
    { name: "Status", sort: "status" },
    { name: "Description", sort: "description" },
]

const Sort: React.FC<SortProps> = ({ currentSort, currentSortDirection, setCurrentSort, setCurrentSortDirection, setRefreshState }) => {
    return (
        <div className="sort-quickdo flex border-neutral-200 border rounded-md w-fit shadow-sm sm:order-1">
            <Select onValueChange={(e) => { setCurrentSort(e); setRefreshState(true); }}>
                <SelectTrigger className="w-fit border-0 border-r py-0 hover:bg-gray-100">
                    <SelectValue
                        defaultValue={useSortData.find(item => item.sort === currentSort)?.sort}
                        placeholder={useSortData.find(item => item.sort === currentSort)?.name}
                    />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] w-fit">
                    {useSortData.map((item, index) => (
                        <SelectItem key={index} value={item.sort}>{item.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <button
                className="sort-direction px-3 py-2 text-[20px]"
                onClick={() => {
                    setCurrentSortDirection(currentSortDirection === "asc" ? "desc" : "asc");
                    setRefreshState(true);
                }}
            >
                <BsSortDownAlt title="Ascending" className={`text-xl transition-transform duration-300 ${currentSortDirection === "desc" ? "rotate-0" : "rotate-180"}`} />
            </button>
        </div>
    );
};

export default Sort;
