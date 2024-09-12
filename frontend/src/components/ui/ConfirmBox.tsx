import { IoClose } from "react-icons/io5";
import { ComfirmBoxProps } from "../../types/Common";
import { useEffect, useRef } from "react";


const ConfirmBox = (props: ComfirmBoxProps) => {

    //? CONFIRM BOX CLICK OUTSIDE REF
    const showConfirmBoxRef = useRef<HTMLDivElement>(null);
    const handleShowConfirmBoxRef = (event: MouseEvent) => {
        if (
            showConfirmBoxRef.current &&
            !showConfirmBoxRef.current.contains(event.target as Node)
        ) {
            props.handleConfirmBoxDisplay(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleShowConfirmBoxRef);
        return () => {
            document.removeEventListener("mousedown", handleShowConfirmBoxRef);
        };
    }, []);


    return (
        <>
            {/* CONFIRM BOX */}
            <div className="confirm-box-container z-[999999] fixed top-0 left-0">
                <div className="confirm-box bg-[#0000004d]  w-[100dvw] h-[100dvh] flex justify-center items-center">
                    <div ref={showConfirmBoxRef} className="confirm-box-card top-to-bottom-animation p-5 bg-white min-w-[250px] shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] rounded-md flex flex-col items-center justify-center gap-3">
                        <div className="confirm w-full flex justify-between items-center">
                            <h4 className="font-semibold text-lg">Confirm</h4>
                            <button>
                                <IoClose
                                    className="text-[24px] cursor-pointer"
                                    onClick={() => {
                                        props.handleConfirmBoxDisplay(false);
                                    }}
                                />
                            </button>
                        </div>
                        <h3 className="confirm-message self-start ">{props.confirmMessage}</h3>
                        <div className="confirm-buttons self-start flex justify-start gap-2.5">
                            <button
                                className="yes bg-black text-white px-4 py-1 shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] rounded-md"
                                onClick={() => {
                                    props.handleSuccess(), props.handleConfirmBoxDisplay(false);
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className="no bg-gray-200 hover:bg-gray-300 px-4 py-1shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] rounded-md"
                                onClick={() => {
                                    props.handleConfirmBoxDisplay(false);
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* END CONFIRM BOX */}
        </>
    );
};

export default ConfirmBox;
