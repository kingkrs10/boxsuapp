// src/components/ContributionChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import '../css/ContributionChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ContributionChart({ data }) {
  // Prepare chart data from the passed "data" prop
  const chartData = {
    labels: data.length > 0 ? data.map((entry) => entry.date) : ['No Data'],
    datasets: [
      {
        label: 'Contributions Over Time',
        data: data.length > 0 ? data.map((entry) => entry.amount) : [0],
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Adjust for flexible heights
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Contributions Over Time',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `$${context.raw}`; // Show data as currency
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default ContributionChart;
