import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { NumberCardProps } from "@/types/Common"

const NumberCard = (props: NumberCardProps) => {
    return (
        <>
            <Card>
                <CardHeader className="pb-1">
                    <CardTitle>
                        <div className="icon-container text-[#3c50e0] text-3xl bg-gray-200 p-2.5 w-fit rounded-full cursor-pointer">
                            <props.icon />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-1">
                    <div className="number text-2xl font-medium">
                        {props.number}
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="font-medium">
                        {props.title}
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}

export default NumberCard