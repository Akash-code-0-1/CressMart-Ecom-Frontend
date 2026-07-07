"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";


interface PieChartData {
    name: string;
    value: number;
    color: string;
}

export default function SalesByCategoryChart({ pieData }: { pieData: PieChartData[] }) {
    return (
        <div className="w-full min-w-0">
            <ResponsiveContainer width="99%" height={220}>
                <PieChart>
                    <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

