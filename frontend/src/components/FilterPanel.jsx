import React, { useState } from 'react';

const FilterPanel = ({ filters, filterOptions, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleMultiSelectChange = (filterKey, value) => {
    const currentValues = filters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChange({ ...filters, [filterKey]: newValues });
  };

  const handleInputChange = (filterKey, value) => {
    onChange({ ...filters, [filterKey]: value });
  };

  const handleClearFilters = () => {
    onChange({
      customerRegion: [],
      gender: [],
      ageMin: '',
      ageMax: '',
      productCategory: [],
      tags: [],
      paymentMethod: [],
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.customerRegion.length > 0 ||
      filters.gender.length > 0 ||
      filters.ageMin ||
      filters.ageMax ||
      filters.productCategory.length > 0 ||
      filters.tags.length > 0 ||
      filters.paymentMethod.length > 0 ||
      filters.dateFrom ||
      filters.dateTo;
  };

  if (!filterOptions) return <div className="filter-panel">Loading filters...</div>;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <div className="filter-actions">
          {hasActiveFilters() && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Clear All
            </button>
          )}
          <button 
            className="toggle-filters-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Customer Region */}
          <div className="filter-group">
            <label className="filter-label">Customer Region</label>
            <div className="checkbox-group">
              {filterOptions.customerRegion.map(region => (
                <label key={region} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.customerRegion.includes(region)}
                    onChange={() => handleMultiSelectChange('customerRegion', region)}
                  />
                  <span>{region}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="filter-group">
            <label className="filter-label">Gender</label>
            <div className="checkbox-group">
              {filterOptions.gender.map(gender => (
                <label key={gender} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.gender.includes(gender)}
                    onChange={() => handleMultiSelectChange('gender', gender)}
                  />
                  <span>{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div className="filter-group">
            <label className="filter-label">Age Range</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.ageMin}
                onChange={(e) => handleInputChange('ageMin', e.target.value)}
                min="0"
                max="120"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.ageMax}
                onChange={(e) => handleInputChange('ageMax', e.target.value)}
                min="0"
                max="120"
              />
            </div>
          </div>

          {/* Product Category */}
          <div className="filter-group">
            <label className="filter-label">Product Category</label>
            <div className="checkbox-group scrollable">
              {filterOptions.productCategory.map(category => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.productCategory.includes(category)}
                    onChange={() => handleMultiSelectChange('productCategory', category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="filter-group">
            <label className="filter-label">Tags</label>
            <div className="checkbox-group scrollable">
              {filterOptions.tags.map(tag => (
                <label key={tag} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleMultiSelectChange('tags', tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="filter-group">
            <label className="filter-label">Payment Method</label>
            <div className="checkbox-group">
              {filterOptions.paymentMethod.map(method => (
                <label key={method} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.paymentMethod.includes(method)}
                    onChange={() => handleMultiSelectChange('paymentMethod', method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <div className="date-inputs">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleInputChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
