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

const chartData = [
    { browser: "open", quickdos: 275, fill: "var(--color-open)" },
    { browser: "completed", quickdos: 200, fill: "var(--color-completed)" },
    { browser: "cancelled", quickdos: 287, fill: "var(--color-cancelled)" },
]

const chartConfig = {
    quickdos: {
        label: "quickdos",
    },
    open: {
        label: "Open",
        color: "#3c50e0",
    },
    completed: {
        label: "Completed",
        color: "#29CD42",
    },
    cancelled: {
        label: "Cancelled",
        color: "#CB2929",
    },
} satisfies ChartConfig

export const StatusDonutChart = () => {
    const totalquickdos = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.quickdos, 0)
    }, [])

    return (
        <Card className="">
            <CardHeader className="relative">
                <CardTitle>QuickDo Status Wise</CardTitle>
                <CardDescription>Status wise QuickDos</CardDescription>

                {/* OPTIONS SECTION */}
                <div className="options-section absolute top-0 right-0 p-5">

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
                            data={chartData}
                            dataKey="quickdos"
                            nameKey="browser"
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
                                                    {totalquickdos.toLocaleString()}
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
