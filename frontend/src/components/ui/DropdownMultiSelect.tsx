import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { PiListBullets, PiListChecks } from "react-icons/pi";
import {
    useGetAllCategories,
    DropdownMultiSelectProps,
} from "../../types/Common";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



const DropdownMultiSelect = (props: DropdownMultiSelectProps) => {

    //? HOOKS
    const [selectedCategories, setSelectedCategories] = useState<useGetAllCategories[]>(props.selectedCategories);
    const [allCategories, setAllCategories] = useState<useGetAllCategories[]>(props.allCategories);


    //? UPDATE CATEGORIES AS CATEGORY UPDATES 
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);


    //? CATEGORIES MULTISELECT HANDLER
    const handleCategoryMultiSelect = (category: string) => {
        setSelectedCategories((prevCategories) => {
            if (prevCategories.some((item) => item.category === category)) {
                return prevCategories.filter((item) => item.category !== category);
            } else {
                return [...prevCategories, { category }];
            }
        });
    };

    //? EFFECT ON SELECTED CATEGORIES CHANGE
    useEffect(() => {
        props.handleSelectedCategories(selectedCategories);
    }, [selectedCategories]);


    //? EFFECT ON PROP'S SELECTED CATEGORIES CHANGE
    useEffect(() => {
        setSelectedCategories(props.selectedCategories);
    }, [props.selectedCategories]);

    return (
        <>
            {/* CATEGORIES MULTISELECT */}
            <div
                className="category-dropdown relative h-6"
            >
                <DropdownMenu>

                    <DropdownMenuTrigger className="text-2xl">
                        <PiListBullets
                            className={`${selectedCategories.length == 0 ? "show" : "hidden"}`}
                        />
                        <PiListChecks
                            className={`${selectedCategories.length == 0 ? "hidden" : "show"}`}
                        />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className='mr-[10px] z-[9999999] space-y-1 '>
                        {allCategories.map((data, index) => (
                            <button
                                key={data.category + index}
                                className={`category w-full cursor-pointer flex select-none justify-start items-center gap-1 px-2 py-0.5 hover:bg-gray-100 rounded-md ${selectedCategories.some(
                                    (item) => item["category"] === data.category
                                )
                                    ? "bg-slate-100"
                                    : ""
                                    }`}
                                onClick={() => handleCategoryMultiSelect(data.category)}
                            >
                                <div
                                    className={`bg-transparent rounded-full p-0.5 w-fit text-[10px] border border-gray-600 cursor-pointer`}
                                >
                                    <FaCheck
                                        className={`${selectedCategories.some(
                                            (item) => item["category"] === data.category
                                        )
                                            ? "opacity-1"
                                            : "opacity-0"
                                            }`}
                                    />
                                </div>
                                <div className="category-text">{data.category}</div>
                            </button>
                        ))}

                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            {/* END CATEGORIES MULTISELECT */}
        </>
    );
};

export default DropdownMultiSelect;
