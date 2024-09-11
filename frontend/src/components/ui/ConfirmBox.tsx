import { IoClose } from "react-icons/io5";
import { ComfirmBoxProps } from "../../types/Common";


const ConfirmBox = (props: ComfirmBoxProps) => {
    return (
        <>
            {/* CONFIRM BOX */}
            <div className="confirm-box-container z-[999999] fixed top-0 left-0">
                <div className="confirm-box bg-[#0000004d]  w-[100dvw] h-[100dvh] flex justify-center items-center">
                    <div className="confirm-box-card p-5 bg-white shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] rounded-md flex flex-col items-center justify-center gap-3">
                        <div className="confirm w-full flex justify-between items-center">
                            <h4 className="font-medium">Confirm</h4>
                            <button>
                                <IoClose
                                    className="text-[22px] cursor-pointer"
                                    onClick={() => {
                                        props.handleConfirmBoxDisplay(false);
                                    }}
                                />
                            </button>
                        </div>
                        <h3 className="confirm-message">{props.confirmMessage}</h3>
                        <div className="confirm-buttons self-start flex justify-start gap-2.5">
                            <button
                                className="yes bg-black text-white px-2 py-0.5 shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] rounded-md"
                                onClick={() => {
                                    props.handleSuccess(), props.handleConfirmBoxDisplay(false);
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className="no bg-gray-200 hover:bg-gray-300 px-2 py-0.5 shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] rounded-md"
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
