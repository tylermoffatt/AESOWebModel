import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Import Chart.js React wrapper
import Chart from 'chart.js/auto'; // Automatically register the necessary components

const AesoComponent = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Function to calculate 30-day rolling average
    const calculateRollingAverage = (data, hoursPerDay = 24, days = 30) => {
      const rollingAverages = [];
      const totalHours = hoursPerDay * days;

      for (let i = 0; i < data.length; i++) {
        const startIdx = Math.max(0, i - totalHours + 1); // Calculate start index
        const windowData = data.slice(startIdx, i + 1); // Get 30-day window
        const sum = windowData.reduce((acc, item) => acc + parseFloat(item.pool_price), 0); // Sum prices
        rollingAverages.push(sum / windowData.length); // Calculate average
      }

      return rollingAverages;
    };

    // Function to format the data for Chart.js
    const processDataForChart = () => {
      // Prepare arrays for x-axis (dates) and y-axis (pool prices)
      const labels = [];
      const poolPrices = [];

      data.forEach((item) => {
        const beginDateTime = item.begin_datetime_mpt; // "2024-11-01 00:00"
        const poolPrice = parseFloat(item.pool_price); // "29.95" as a float

        // Format the date into 'yyyy-mm-dd HE00' format
        const date = new Date(beginDateTime); // Convert string to Date object
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
        const hour = String(date.getHours()).padStart(2, '0'); // Ensure 2-digit hour

        const formattedLabel = `${year}-${month}-${day} HE${String(
          parseInt(hour) + 1
        ).padStart(2, '0')}`;

        // Push formatted label and pool price to the arrays
        labels.push(formattedLabel);
        poolPrices.push(poolPrice);
      });

      // Calculate rolling averages
      const rollingAverages = calculateRollingAverage(data);

      // Return the chart data structure
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'AESO Pool Price',
            data: poolPrices,
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area under the line
            fill: true,
            tension: 0.1,
          },
          {
            label: '30-Day Rolling Average',
            data: rollingAverages,
            borderColor: 'rgba(70, 130, 180, 0.7)', // Line color
            backgroundColor: 'rgba(70, 130, 180, 0.1)', // semi-transparent for hover
            fill: false,
            tension: 0.1,
          },
        ],
      });
    };

    if (data && data.length > 0) {
      processDataForChart();
    }
  }, [data]); // Re-run this effect if `data` changes

  // If chartData is still null, return a loading state
  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              type: 'category', // Treat x-axis as categorical
              title: {
                display: true,
                text: 'Date (HE)',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price (in CAD$/MW)',
              },
              min: 0, // Set the minimum value of the y-axis to 0
            },
          },
        }}
      />
    </div>
  );
};

export default AesoComponent;
