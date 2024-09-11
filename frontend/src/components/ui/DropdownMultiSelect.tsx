import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { PiListBullets, PiListChecks } from "react-icons/pi";
import {
    useGetAllCategories,
    DropdownMultiSelectProps,
} from "../../types/Common";


const DropdownMultiSelect = (props: DropdownMultiSelectProps) => {

    //? HOOKS
    const [selectedCategories, setSelectedCategories] = useState<useGetAllCategories[]>(props.selectedCategories);
    const [showCategories, setShowCategories] = useState<boolean>(props.showCategories);
    const [allCategories, setAllCategories] = useState<useGetAllCategories[]>(props.allCategories);

    // ? SET THE DROPDOWN REF FOR AUTO OPENING THE DROPDOWN ON TOP OR BOTTOM
    const [openDirection, setOpenDirection] = useState('down');
    useEffect(() => {
        if (showCategories) {
            const dropdown = showCategoryDropdownRef.current;
            if (dropdown) {
                const rect = dropdown.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const maxHeight = window.innerWidth >= 1280 ? 300 : 250;
                const spaceBelow = windowHeight - rect.bottom;
                const spaceAbove = rect.top;

                if (spaceBelow < maxHeight && spaceAbove > spaceBelow) {
                    setOpenDirection('up');
                } else {
                    setOpenDirection('down');
                }
            }
        }
    }, [showCategories]);

    //? UPDATE CATEGORIES AS CATEGORY UPDATES 
    useEffect(() => {
        setAllCategories(props.allCategories);
    }, [props.allCategories]);

    //? CATERORY DROPDOWN CLICK OUTSIDE REF
    const showCategoryDropdownRef = useRef<HTMLDivElement>(null);
    const handleShowCategoryDropdownRef = (event: MouseEvent) => {
        if (
            showCategoryDropdownRef.current &&
            !showCategoryDropdownRef.current.contains(event.target as Node)
        ) {
            setShowCategories(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleShowCategoryDropdownRef);
        return () => {
            document.removeEventListener("mousedown", handleShowCategoryDropdownRef);
        };
    }, []);

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

    //? EFFECT ON SHOW CATEGORIES CHANGE
    useEffect(() => {
        setShowCategories(props.showCategories);
    }, [props.showCategories]);

    //? EFFECT ON PROP'S SELECTED CATEGORIES CHANGE
    useEffect(() => {
        setSelectedCategories(props.selectedCategories);
    }, [props.selectedCategories]);

    return (
        <>
            {/* CATEGORIES MULTISELECT */}
            <div
                ref={showCategoryDropdownRef}
                className="category-dropdown relative h-6"
            >

                {/* CATEGORIES ICONv */}
                <button
                    className="categories text-2xl"
                    onClick={() => {
                        setShowCategories(!showCategories);
                    }}
                    title="Categories"
                >
                    <PiListBullets
                        className={`${selectedCategories.length == 0 ? "show" : "hidden"}`}
                    />
                    <PiListChecks
                        className={`${selectedCategories.length == 0 ? "hidden" : "show"}`}
                    />
                </button>
                {/* END CATEGORIES ICON */}

                {/* CATEGORIES ITEMS DROPDOWN*/}
                <div
                    className={`${openDirection === 'down' ? 'top-full' : 'bottom-full'}
                        categories-items bg-white p-1 rounded-md flex-col gap-1 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.2)] max-h-[250px] xl:max-h-[300px] overflow-y-scroll absolute z-50 ${props.position
                            ? props.position == "left"
                                ? "right-0"
                                : "left-0"
                            : "right-0"
                        } 
                        ${showCategories ? "flex" : "hidden"}
                        `}
                >
                    {allCategories.map((data, index) => (
                        <button
                            key={data.category + index}
                            className={`category cursor-pointer flex select-none justify-start items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md ${selectedCategories.some(
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
                </div>
                {/* END CATEGORIES ITEMS DROPDOWN */}

            </div>
            {/* END CATEGORIES MULTISELECT */}
        </>
    );
};

export default DropdownMultiSelect;
