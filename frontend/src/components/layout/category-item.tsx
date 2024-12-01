import { useEffect, useState } from "react";
import {
    useAllCategories,
    ListCategoryProps,
} from "../../types/Common";
import ConfirmBox from "@/components/ui/confirm";


const CategoryItem = (props: ListCategoryProps) => {

    //? HOOKS
    const [category, setCategory] = useState<string>(props.CategoryData.category);
    const [categoryData, setCategoryData] = useState<useAllCategories>(props.CategoryData);

    //? UPDATE CATEGORIES DATA AS PROP DATA CHANGES
    useEffect(() => {
        setCategory(props.CategoryData.category);
        setCategoryData(props.CategoryData);
    }, [props.CategoryData]);

    //? UPDATE CATEGORY
    const handleSaveCategory = () => {
        if (category !== categoryData?.name) {
            props.handleSaveCategory({
                name: categoryData?.name,
                category: category,
                owner: categoryData?.owner,
                creation: categoryData?.creation,
                modified: categoryData?.modified,
                modified_by: categoryData?.modified_by,
                doctype: "QuickDo Category",
            });
        }
    };

    //? DELETE CATEGORY HANDLER
    const handleDeleteCategory = () => {
        props.handleDeleteCategory(props.CategoryData.name || "");
    };

    return (
        <>
            {/* LIST ITEMS */}
            <div className="list-items rounded-md border-gray-200 border shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] my-2 py-2 px-4 sm:py-3 flex justify-between lg:grid sm:gap-y-2 sm:gap-x-5  lg:grid-cols-8 xl:grid-cols-10 xxl:grid-cols-12 items-center">

                {/* EDIT AND CLOSE CATEGORY */}
                <div className="item flex justify-start items-center gap-1 sm:gap-5 w-full lg:w-auto lg:col-span-7 xl:col-span-9 xxl:col-span-11">
                    <div className="input w-full">
                        <input
                            type="text"
                            className="outline-0 placeholder:text-gray-700 py-1.5 px-2 w-full"
                            name="Category"
                            id="Category"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                handleSaveCategory();
                            }}
                        />
                    </div>
                </div>
                {/* EDIT AND CLOSE CATEGORY */}

                {/* IMPORTANCE */}
                <div className="item lg:col-span-1 justify-self-center">
                    <ConfirmBox
                        confirmTitle={"Delete QuickDo Category"}
                        confirmMessage={"Are you sure you want to delete QuickDo Category?"}
                        handleSuccess={handleDeleteCategory}
                    />
                </div>
                {/* END IMPORTANCE */}

            </div>
            {/* END LIST ITEMS */}
        </>
    );
};

export default CategoryItem;
