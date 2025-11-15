// BaseRPlot.tsx
import React, { useEffect, useRef } from 'react';
import {
    Chart,
    BarController,
    BarElement,
    LineController,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    ScatterController,
    Tooltip,
    Legend,
} from 'chart.js';

Chart.register(
    BarController,
    BarElement,
    LineController,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    ScatterController,
    Tooltip,
    Legend
);

type Point = { x: number; y: number };
type GroupedData = { group: string; values: number[] };
type GroupedPoints = { group: string; points: Point[] };
type BarGroup = { group: string; values: { x: string; y: number }[] };

type BaseRPlotProps = {
    type:
    | 'histogram'
    | 'density'
    | 'hist+density'
    | 'line'
    | 'scatter'
    | 'density-grouped'
    | 'histogram-grouped'
    | 'scatter-grouped'
    | 'bar';
    data:
    | number[]
    | { x: number; y: number }[]
    | { group: string; values: number[] }[]
    | { group: string; points: { x: number; y: number }[] }[]
    | { group: string; values: { x: number; y: number }[] }[]
    | { x: string; y: number }[]
    | BarGroup[];

    bins?: number;
    bandwidth?: number;
    width?: number;
    height?: number;
    xLabel?: string;
    yLabel?: string;
    compact?: boolean;
};

export const BaseRPlot: React.FC<BaseRPlotProps> = ({
    type,
    data,
    bins = 10,
    bandwidth,
    width = 300,
    height = 300,
    xLabel,
    yLabel,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    function gaussianKernel(u: number) {
        return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
    }

    function estimateDensity(data: number[], bw: number, steps = 100): Point[] {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        const xVals = Array.from({ length: steps }, (_, i) => min + (range * i) / (steps - 1));
        const scale = 1 / (data.length * bw);
        return xVals.map(x => {
            const sum = data.reduce((acc, xi) => acc + gaussianKernel((x - xi) / bw), 0);
            return { x, y: scale * sum };
        });
    }

    function stdDev(arr: number[]): number {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / (arr.length - 1));
    }

    function iqr(arr: number[]): number {
        const sorted = [...arr].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        return q3 - q1;
    }

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        if (chartRef.current) chartRef.current.destroy();

        let chartData: any = {};
        let chartType: any = 'bar';
        let labels: string[] = [];
        const colors = ['#1f77b4', '#d62728', '#2ca02c', '#ff7f0e', '#9467bd', '#8c564b'];

        if (type === 'histogram') {
            const raw = data as number[];
            const min = Math.min(...raw);
            const max = Math.max(...raw);
            const binWidth = (max - min) / bins;
            const edges = Array.from({ length: bins + 1 }, (_, i) => min + i * binWidth);
            const counts = new Array(bins).fill(0);
            raw.forEach(val => {
                const idx = Math.min(Math.floor((val - min) / binWidth), bins - 1);
                counts[idx]++;
            });
            labels = edges.slice(0, -1).map((_, i) => `${edges[i].toFixed(1)}–${edges[i + 1].toFixed(1)}`);
            chartData = {
                labels,
                datasets: [{
                    label: 'Histogram',
                    data: counts,
                    backgroundColor: '#ccc',
                    borderColor: '#000',
                    borderWidth: 1,
                }]
            };
        }

        else if (type === 'density') {
            const raw = data as number[];
            const bw = bandwidth ?? 1.06 * Math.min(stdDev(raw), iqr(raw) / 1.34) * Math.pow(raw.length, -1 / 5);
            chartData = {
                datasets: [{
                    label: 'Density',
                    data: estimateDensity(raw, bw),
                    borderColor: '#000',
                    backgroundColor: '#000',
                    fill: false,
                    pointRadius: 0,
                    tension: 0.2,
                }]
            };
            chartType = 'line';
        }

        else if (type === 'hist+density') {
            const raw = data as number[];
            const min = Math.min(...raw);
            const max = Math.max(...raw);
            const binWidth = (max - min) / bins;
            const edges = Array.from({ length: bins + 1 }, (_, i) => min + i * binWidth);
            const counts = new Array(bins).fill(0);
            raw.forEach(val => {
                const idx = Math.min(Math.floor((val - min) / binWidth), bins - 1);
                counts[idx]++;
            });
            const totalArea = counts.reduce((sum, c) => sum + c * binWidth, 0);
            const normCounts = counts.map(c => c / totalArea);
            labels = edges.slice(0, -1).map((_, i) => `${edges[i].toFixed(1)}–${edges[i + 1].toFixed(1)}`);
            const bw = bandwidth ?? 1.06 * Math.min(stdDev(raw), iqr(raw) / 1.34) * Math.pow(raw.length, -1 / 5);
            const density = estimateDensity(raw, bw);
            chartData = {
                labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Histogram',
                        data: normCounts,
                        backgroundColor: '#ccc',
                        borderColor: '#000',
                        borderWidth: 1,
                    },
                    {
                        type: 'line',
                        label: 'Density',
                        data: density,
                        borderColor: '#000',
                        backgroundColor: '#000',
                        pointRadius: 0,
                        tension: 0.2,
                        yAxisID: 'y',
                    }
                ]
            };
        }

        else if (type === 'line') {
            chartData = {
                datasets: [{
                    label: 'Line',
                    data: data as Point[],
                    borderColor: '#000',
                    backgroundColor: '#000',
                    fill: false,
                    pointRadius: 2,
                    tension: 0,
                }]
            };
            chartType = 'line';
        }

        else if (type === 'scatter') {
            chartData = {
                datasets: [{
                    label: 'Scatter',
                    data: data as Point[],
                    backgroundColor: '#000',
                    pointRadius: 3,
                    showLine: false,
                }]
            };
            chartType = 'scatter';
        }

        else if (type === 'density-grouped') {
            const groups = data as GroupedData[];
            const all = groups.flatMap(g => g.values);
            const bw = bandwidth ?? 1.06 * Math.min(stdDev(all), iqr(all) / 1.34) * Math.pow(all.length, -1 / 5);
            chartData = {
                datasets: groups.map((g, i) => ({
                    label: g.group,
                    data: estimateDensity(g.values, bw),
                    borderColor: colors[i % colors.length],
                    backgroundColor: colors[i % colors.length],
                    pointRadius: 0,
                    tension: 0.2,
                    fill: false,
                }))
            };
            chartType = 'line';
        }

        else if (type === 'histogram-grouped') {
            const groups = data as GroupedData[];
            const all = groups.flatMap(g => g.values);
            const min = Math.min(...all);
            const max = Math.max(...all);
            const binWidth = (max - min) / bins;
            const edges = Array.from({ length: bins + 1 }, (_, i) => min + i * binWidth);
            labels = edges.slice(0, -1).map((_, i) => `${edges[i].toFixed(1)}–${edges[i + 1].toFixed(1)}`);

            chartData = {
                labels,
                datasets: groups.map((g, gi) => {
                    const counts = new Array(bins).fill(0);
                    g.values.forEach(v => {
                        const idx = Math.min(Math.floor((v - min) / binWidth), bins - 1);
                        counts[idx]++;
                    });
                    return {
                        label: g.group,
                        data: counts,
                        backgroundColor: colors[gi % colors.length],
                        borderColor: '#000',
                        borderWidth: 1,
                    };
                })
            };
            chartType = 'bar';
        }

        else if (type === 'scatter-grouped') {
            const groups = data as GroupedPoints[];
            chartData = {
                datasets: groups.map((g, i) => ({
                    label: g.group,
                    data: g.points,
                    backgroundColor: colors[i % colors.length],
                    pointRadius: 3,
                    showLine: false,
                }))
            };
            chartType = 'scatter';
        }

        else if (type === 'bar') {
            const groups = data as BarGroup[];
            const xLabels = Array.from(
                new Set(groups.flatMap((g) => g.values.map((v) => v.x)))
            );

            chartData = {
                labels: xLabels,
                datasets: groups.map((g, i) => ({
                    label: g.group,
                    data: xLabels.map((x) => {
                        const found = g.values.find((v) => v.x === x);
                        return found ? found.y : 0;
                    }),
                    backgroundColor: colors[i % colors.length],
                    borderColor: '#000',
                    borderWidth: 1,
                })),
            };
            chartType = 'bar';
        }


        chartRef.current = new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: {
                animation: false,
                responsive: false,
                maintainAspectRatio: false,
                interaction: { mode: undefined },
                plugins: {
                    legend: { display: true },
                    tooltip: { enabled: false },
                },
                scales: {
                    x: {
                        type: ['histogram', 'hist+density', 'histogram-grouped', 'bar'].includes(type) ? 'category' : 'linear',
                        title: {
                            display: xLabel ? true : false,
                            text: xLabel || 'X',
                        },
                        ticks: { color: '#000' },
                        grid: { display: false },
                    },
                    y: {
                        title: {
                            display: yLabel ? true : false,
                            text: yLabel || 'Y',
                        },
                        ticks: { color: '#000' },
                        grid: { display: false },
                    },
                },
            },
        });
    }, [type, data, bins, bandwidth]);

    return <canvas ref={canvasRef} width={width} height={height} className='p-5' />;
};
