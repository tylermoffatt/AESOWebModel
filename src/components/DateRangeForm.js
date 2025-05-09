// components/DateRangeForm.js

import React, { useState } from 'react';

const DateRangeForm = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      onSubmit(startDate, endDate); // Call the parent onSubmit function with the dates
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-card">
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <button className="button"type="submit">Get Data</button>
    </form>
  );
};

export default DateRangeForm;