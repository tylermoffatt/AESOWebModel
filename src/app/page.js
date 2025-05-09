"use client"; // Ensure this component is client-rendered

import React, { useState, useEffect } from 'react';
import DateRangeForm from '@/components/DateRangeForm'; // Assuming you have this form component
import AesoComponent from '@/components/AesoComponent'; // Updated import for the renamed component

const Page = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleFormSubmit = async (startDate, endDate) => {
    try {
      // Make the API call with the selected dates
      const response = await fetch(`/api/aeso?startDate=${startDate}&endDate=${endDate}`);
      const result = await response.json();
      if (response.ok) {
        setData(result); // Update state with the response data
      } else {
        setError(result.error); // Handle error
      }
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  return (
    <div className="container">
      {/* Fixed header for date selection */}
        
      
        <DateRangeForm onSubmit={handleFormSubmit} /> {/* Form to select start and end date */}
      

      {/* Display error if any */}
      {error && <div className="error">{error}</div>}

      {/* Render chart when data is available */}
      {data && (
        <div className="chart-container">
          <AesoComponent data={data} /> {/* Pass the data to the AesoComponent for rendering the chart */}
        </div>
      )}
    </div>
  );
};

export default Page;