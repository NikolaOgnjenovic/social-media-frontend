import React, {useEffect, useRef, useState} from "react";
import Chart from "chart.js/auto";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

interface MostActiveUsersChartProps {
    data: { username: string; popularity: number }[];
}

const UserPopularityChart: React.FC<MostActiveUsersChartProps> = ({data}) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chartInstance, setChartInstance] = useState<Chart | null>(null);

    useEffect(() => {
        data.sort((userData) => userData.popularity);
        data = data.slice(data.length - 5, data.length);
    }, [data]);


    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");

            if (ctx) {
                if (chartInstance) {
                    chartInstance.destroy();
                }

                setChartInstance(
                    new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: data.map((row) => row.username),
                            datasets: [
                                {
                                    label: localizedStrings.chart.popularity,
                                    data: data.map((row) => row.popularity),
                                    backgroundColor: "rgba(54, 162, 235, 0.6)", // Bar color
                                    borderColor: "rgba(54, 162, 235, 1)", // Border color
                                    borderWidth: 1,
                                },
                            ],
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: localizedStrings.chart.popularity,
                                    },
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: localizedStrings.chart.username,
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                        },
                    })
                );
            }
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef}/>;
};

export default UserPopularityChart;
