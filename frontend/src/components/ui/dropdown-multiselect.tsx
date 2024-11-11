import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { PiListBullets, PiListChecks } from "react-icons/pi";
import {
    useAllCategories,
    DropdownMultiSelectProps,
} from "../../types/Common";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



const DropdownMultiSelect = (props: DropdownMultiSelectProps) => {

    //? HOOKS
    const [categories, setCategories] = useState<useAllCategories[]>(props.categories);
    const [allCategories, setAllCategories] = useState<useAllCategories[]>(props.allCategories);


    //? UPDATE CATEGORIES AS CATEGORY UPDATES 
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);


    //? CATEGORIES MULTISELECT HANDLER
    const handleCategoryMultiSelect = (category: string) => {
        setCategories((prevCategories) => {
            if (prevCategories.some((item) => item.category === category)) {
                return prevCategories.filter((item) => item.category !== category);
            } else {
                return [...prevCategories, { category }];
            }
        });
    };

    //? EFFECT ON SELECTED CATEGORIES CHANGE
    useEffect(() => {
        props.handleCategories(categories);
    }, [categories]);


    //? EFFECT ON PROP'S SELECTED CATEGORIES CHANGE
    useEffect(() => {
        setCategories(props.categories);
    }, [props.categories]);

    return (
        <>
            {/* CATEGORIES MULTISELECT */}
            <div
                className="category-dropdown relative h-6"
            >
                <DropdownMenu>

                    <DropdownMenuTrigger className="text-2xl">
                        <PiListBullets
                            className={`${categories.length == 0 ? "show" : "hidden"}`}
                        />
                        <PiListChecks
                            className={`${categories.length == 0 ? "hidden" : "show"}`}
                        />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className='mr-[10px] z-[9999999] space-y-1 '>
                        {allCategories.map((data, index) => (
                            <button
                                key={data.category + index}
                                className={`category w-full cursor-pointer flex select-none justify-start items-center gap-1 px-2 py-0.5 hover:bg-gray-100 rounded-md ${categories.some(
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
                                        className={`${categories.some(
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
