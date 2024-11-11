import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { CreateCategoryProps } from "../../types/Common";


const CreateCategory = (props: CreateCategoryProps) => {

    //? HOOKS
    const [category, setCategory] = useState<string>("");
    const [saveNewCategory, setSaveNewCategory] = useState<boolean>(false);

    //? SAVE CATEGORY HANDLER
    const handleSaveCategory = () => {

        //? IF THE CATEGORY EXISTS
        if (category) {

            //? SET THE TICK MARK
            setSaveNewCategory(true);

            //? SAVE CATEGORY DATA
            props.handleSaveCategory({
                name: "",
                category: category,
            });

            //? RESET ALL OF THE STATES
            setSaveNewCategory(false);
            setCategory("");
        };
    }

    return (
        <>
            {/* CREATE CATEGORY */}
            <div className="create-category-container p-4 sm:p-5 w-full">
                <div className="create-category bg-white py-2 px-4 sm:p-5 flex flex-col shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-md">

                    {/* ROW */}
                    <div className="row flex gap-1 sm:gap-5 justify-between items-center">

                        {/* SAVE TICK BOX */}
                        <div
                            className={`save-category-button bg-transparent rounded-full p-0.5 w-fit text-xs sm:text-sm border border-gray-600 cursor-pointer`}
                            onClick={() => {
                                handleSaveCategory();
                            }}
                            title="Create"
                        >
                            <FaCheck
                                className={`${saveNewCategory ? "opacity-1" : "opacity-0"}`}
                            />
                        </div>
                        {/* END SAVE TICK BOX */}

                        {/* CATEGORY INPUT BOX */}
                        <input
                            type="text"
                            className="outline-0 placeholder:text-gray-700 py-1.5 px-2 w-full"
                            placeholder="Add a Category..."
                            name="Category"
                            id="Category"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                e.key === "Enter" ? handleSaveCategory() : "";
                            }}
                        />
                        {/* END CATEGORY INPUT BOX */}

                    </div>
                    {/* END ROW */}

                </div>
            </div>
            {/* END CREATE CATEGORY */}
        </>
    );
};

export default CreateCategory;
