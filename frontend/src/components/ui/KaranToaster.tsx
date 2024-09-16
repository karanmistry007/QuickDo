import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

type Props = {
    message: string;
    onClose: (data: boolean) => void;
    duration?: number;
    color: string;
};

const Toaster = (props: Props) => {

    //? HOOKS
    const [isVisible, setIsVisible] = useState<boolean>(true);

    //? AUTOMATICALLY HIDE TOASTER AFTER SOME TIME
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            props.onClose(false);
        }, props.duration);

        return () => clearTimeout(timer);
    }, [props.duration, props.onClose]);

    if (!isVisible) return null;

    return (
        <>
            {/* TOASTER */}
            <div className={`toaster flex justify-between items-center gap-2 fixed left-[50%] translate-x-[-50%] bottom-5 right-auto sm:bottom-5 sm:top-auto sm:left-auto sm:translate-x-[none] sm:right-5 z-[99999] p-3 font-medium rounded-md w-[90%] sm:w-fit sm:min-w-[250px] sm:max-w-[400px] ${props.color}`}>
                <div className="toaster-message">
                    {props.message}
                </div>
                <div className="close-toaster w-fit">
                    <button className="close h-4 w-4" onClick={() => {
                        setIsVisible(false);
                        props.onClose(false);
                    }}>
                        <IoClose className="text-xl" />
                    </button>
                </div>
            </div>
            {/* END TOASTER */}
        </>
    )
}

export default Toaster;
