"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const chartData = [
    { category: "Development", quickdo: 305 },
    { category: "Deployment", quickdo: 186 },
    { category: "Social", quickdo: 237 },
    { category: "Health", quickdo: 73 },
    { category: "Shopping", quickdo: 209 },
    { category: "GitHub", quickdo: 214 },
]

const chartConfig = {
    quickdo: {
        label: "QuickDo",
        color: "#3c50e0",
    },
} satisfies ChartConfig

export const CategoryBarChart = () => {
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle>QuickDo Categories</CardTitle>
                <CardDescription>Category wise QuickDos</CardDescription>

                {/* OPTIONS SECTION */}
                <div className="options-section absolute top-0 right-0 p-5 hidden">

                    {/* TIMESPAN PICKER */}
                    <div className="timespan-picker">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue defaultValue="last year" placeholder="Last Year" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                <SelectItem value="last week">Last Week</SelectItem>
                                <SelectItem value="last month">Last Month</SelectItem>
                                <SelectItem value="last quarter">Last Quarter</SelectItem>
                                <SelectItem value="last 6 months">Last 6 months</SelectItem>
                                <SelectItem value="last year">Last Year</SelectItem>
                                <SelectItem value="yesterday">Yesterday</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                                <SelectItem value="this week">This Week</SelectItem>
                                <SelectItem value="this month">This Month</SelectItem>
                                <SelectItem value="this quarter">This Quarter</SelectItem>
                                <SelectItem value="this year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* END TIMESPAN PICKER */}



                </div>
                {/* END OPTIONS SECTION */}

            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="quickdo" fill="var(--color-quickdo)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
