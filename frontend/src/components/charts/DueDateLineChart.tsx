"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
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
    { month: "January", quickdo: 214 },
    { month: "February", quickdo: 237 },
    { month: "March", quickdo: 305 },
    { month: "April", quickdo: 209 },
    { month: "May", quickdo: 73 },
    { month: "june", quickdo: 186 },
]

const chartConfig = {
    quickdo: {
        label: "QuickDo",
        color: "#3c50e0",
    },
} satisfies ChartConfig

export const DueDateLineChart = () => {
    return (
        <>
            <Card>
                <CardHeader className="relative">
                    <CardTitle>QuickDo Due Date</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>

                    {/* OPTIONS SECTION */}
                    <div className="options-section absolute top-0 right-0 p-5  hidden">

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
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 10,
                                right: 10,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Line
                                dataKey="quickdo"
                                type="natural"
                                stroke="var(--color-quickdo)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-quickdo)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    )
}
