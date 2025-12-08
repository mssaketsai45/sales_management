import React from 'react';

const SortDropdown = ({ sortBy, sortOrder, onChange }) => {
  const sortOptions = [
    { value: 'date', label: 'Date', defaultOrder: 'desc' },
    { value: 'quantity', label: 'Quantity', defaultOrder: 'desc' },
    { value: 'customerName', label: 'Customer Name (A-Z)', defaultOrder: 'asc' }
  ];

  const handleSortChange = (e) => {
    const selectedOption = sortOptions.find(opt => opt.value === e.target.value);
    onChange(e.target.value, selectedOption.defaultOrder);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onChange(sortBy, newOrder);
  };

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select" className="sort-label">Sort by:</label>
      <select 
        id="sort-select"
        className="sort-select"
        value={sortBy}
        onChange={handleSortChange}
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button 
        className="sort-order-btn"
        onClick={toggleSortOrder}
        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        title={sortOrder === 'asc' ? 'Click for descending' : 'Click for ascending'}
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default SortDropdown;
