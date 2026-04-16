"use client";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  };

  const data = {
    labels: ['Wheat', 'Rice', 'Sugarcane', 'Mustard', 'Soybean'],
    datasets: [
      {
        label: 'Fluctuation Index (%)',
        data: [15, 8, 3, 22, 10],
        backgroundColor: 'rgba(147, 51, 234, 0.6)', 
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
