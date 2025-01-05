"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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

const data = [
    { status: "Open", quickdo: 215, fill: "#3c50e0" },
    { status: "Completed", quickdo: 200, fill: "#29CD42" },
    { status: "Cancelled", quickdo: 287, fill: "#CB2929" },
]

const chartConfig = {
    quickdo: {
        label: "quickdo",
    },
} satisfies ChartConfig

export const StatusDonutChart = ({ data }: any) => {
    console.log(data)
    const totalQuickdos = data.reduce((acc: any, curr: any) => acc + curr.quickdo, 0)

    return (
        <Card className="">
            <CardHeader className="relative">
                <CardTitle>QuickDo Status Wise</CardTitle>
                <CardDescription>Status wise QuickDos</CardDescription>

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
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey="quickdo"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalQuickdos.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    QuickDos
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
