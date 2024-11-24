import { ConfirmBoxProps } from "../../types/Common";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BsTrash } from "react-icons/bs";



const ConfirmBox = (props: ConfirmBoxProps) => {

    return (
        <>
            {/* CONFIRM BOX */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="text-xl rounded-full p-2">
                        <BsTrash />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md z-[9999]">
                    <DialogHeader>
                        <DialogTitle>
                            {props.confirmTitle}
                        </DialogTitle>
                        <DialogDescription>
                            {props.confirmMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose
                            asChild
                            className="order-1 sm:order-none"
                            onClick={() => {
                                props.handleSuccess()
                            }}
                        >
                            <Button type="button" variant="default">
                                Yes
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                No
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* END CONFIRM BOX */}
        </>
    );
};

export default ConfirmBox;
