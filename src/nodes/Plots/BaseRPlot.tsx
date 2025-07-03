import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  PointElement,
  LineController,
  LineElement,
  ScatterController,
  Tooltip,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  PointElement,
  LineController,
  LineElement,
  ScatterController,
  Tooltip
);

type BaseRPlotProps = {
  type: 'histogram' | 'scatter';
  data: number[] | { x: number; y: number }[];
  bins?: number; // for histograms
  width?: number;
  height?: number;
};

export const BaseRPlot: React.FC<BaseRPlotProps> = ({
  type,
  data,
  bins = 10,
  width = 250,
  height = 250,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    let chartData;
    let chartType: 'bar' | 'scatter' = 'bar';
    let labels: string[] = [];

    if (type === 'histogram') {
      const rawData = data as number[];
      const min = Math.min(...rawData);
      const max = Math.max(...rawData);
      const binWidth = (max - min) / bins;
      const binEdges = Array.from({ length: bins + 1 }, (_, i) => min + i * binWidth);
      const binCounts = new Array(bins).fill(0);

      rawData.forEach(val => {
        const index = Math.min(Math.floor((val - min) / binWidth), bins - 1);
        binCounts[index]++;
      });

      labels = binEdges.slice(0, -1).map((_, i) =>
        `${binEdges[i].toFixed(0)}`
      );
 
      console.log('Histogram Data:', { binEdges, binCounts, labels });
      chartData = {
        labels,
        datasets: [
          {
            label: 'Histogram',
            data: binCounts,
            backgroundColor: '#ccc',
            borderColor: '#000',
            borderWidth: 1,
          },
        ],
      };
      chartType = 'bar';
    } else if (type === 'scatter') {
      chartData = {
        datasets: [
          {
            label: 'Scatter Plot',
            data: data as { x: number; y: number }[],
            backgroundColor: '#000',
            pointRadius: 3,
          },
        ],
      };
      chartType = 'scatter';
    }

    chartRef.current = new Chart(ctx, {
      type: chartType,
      data: chartData!,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        interaction: { mode: undefined }, // no hover interactivity
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: {
            title: { display: false, text: 'X' },
            grid: { display: false },
            ticks: { color: '#000' },
          },
          y: {
            title: { display: false, text: 'Y' },
            grid: { display: false },
            ticks: { color: '#000' },
          },
        },
      },
    });
  }, [type, data, bins]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
