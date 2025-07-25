"use client"

import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"


// const chartData = [
//     { important: 520, total: 800, fill: "#3c50e0" },
// ]

const chartConfig = {
    important: {
        label: "QuickDo",
    },
} satisfies ChartConfig

export const ImportancePercentageChart = ({ data }: any) => {

    // ? HOOKS
    // ? SET DEFAULT DATA 
    const [chartData, setChartData] = useState(data && data.length > 0 ? data : [{ important: 0, total: 0, fill: "#3c50e0" }]);
    useEffect(() => {
        if (data.length > 0) {
            setChartData(data)
        }
    }, [data])


    return (
        <Card className="">
            <CardHeader className="relative">
                <CardTitle>Important QuickDo</CardTitle>
                <CardDescription>Importance wise QuickDos</CardDescription>

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
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={300}
                        innerRadius={80}
                        outerRadius={140}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="important" background />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {chartData[0].important.toLocaleString()}
                                                    /
                                                    {chartData[0].total.toLocaleString()}
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
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
