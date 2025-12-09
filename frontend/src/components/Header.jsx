import React, { useState } from 'react';

const Header = ({ searchTerm, onSearchChange, filters, filterOptions, onFilterChange, sortBy, sortOrder, onSortChange, onRemoveFilters }) => {
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [ageMin, setAgeMin] = useState(filters.ageMin || '');
  const [ageMax, setAgeMax] = useState(filters.ageMax || '');
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
  const [dateTo, setDateTo] = useState(filters.dateTo || '');

  const handleMultiSelectChange = (filterKey, value) => {
    const currentValues = filters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange(filterKey, newValues);
  };

  const applyAgeRange = () => {
    const min = parseInt(ageMin) || 0;
    const max = parseInt(ageMax) || 120;
    
    if (ageMin && ageMax && min > max) {
      alert('Minimum age cannot be greater than maximum age');
      return;
    }
    
    if (min < 0 || max < 0 || min > 120 || max > 120) {
      alert('Age must be between 0 and 120');
      return;
    }
    
    onFilterChange('ageMin', ageMin);
    onFilterChange('ageMax', ageMax);
    setShowAgeModal(false);
  };

  const applyDateRange = () => {
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      alert('From date cannot be after To date');
      return;
    }
    
    onFilterChange('dateFrom', dateFrom);
    onFilterChange('dateTo', dateTo);
    setShowDateModal(false);
  };

  const clearAgeRange = () => {
    setAgeMin('');
    setAgeMax('');
    onFilterChange('ageMin', '');
    onFilterChange('ageMax', '');
    setShowAgeModal(false);
  };

  const clearDateRange = () => {
    setDateFrom('');
    setDateTo('');
    onFilterChange('dateFrom', '');
    onFilterChange('dateTo', '');
    setShowDateModal(false);
  };

  return (
    <header className="main-header">
      <div className="header-title-row">
        <h1>Sales Management System</h1>
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Name, Phone no."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button 
          className="filters-toggle-btn"
          onClick={() => setFiltersCollapsed(!filtersCollapsed)}
          aria-label="Toggle filters"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={filtersCollapsed ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={`header-controls ${filtersCollapsed ? 'collapsed' : ''}`}>
        <div className="header-left">
          <div className="refresh-btn" onClick={onRemoveFilters}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </div>

          <button className="filter-select" onClick={() => setShowRegionModal(true)}>
            Customer Region
            <span className="dropdown-arrow">▾</span>
          </button>

          <button className="filter-select" onClick={() => setShowGenderModal(true)}>
            Gender
            <span className="dropdown-arrow">▾</span>
          </button>

          <button className="filter-select" onClick={() => setShowAgeModal(true)}>
            Age Range
            <span className="dropdown-arrow">▾</span>
          </button>

          <button className="filter-select" onClick={() => setShowCategoryModal(true)}>
            Product Category
            <span className="dropdown-arrow">▾</span>
          </button>

          <button className="filter-select" onClick={() => setShowTagsModal(true)}>
            Tags
            <span className="dropdown-arrow">▾</span>
          </button>

          <button className="filter-select" onClick={() => setShowPaymentModal(true)}>
            Payment Method
            <span className="dropdown-arrow">▾</span>
          </button>

          <button className="filter-select" onClick={() => setShowDateModal(true)}>
            Date
            <span className="dropdown-arrow">▾</span>
          </button>
        </div>

        <div className="header-right">
          <div className="dropdown">
            <select
              className="filter-select sort-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                onSortChange(field);
              }}
            >
              <option value="customerName-asc">Sort by: Customer Name (A-Z)</option>
              <option value="customerName-desc">Customer Name (Z-A)</option>
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="totalAmount-desc">Amount (High to Low)</option>
              <option value="totalAmount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Age Range Modal */}
      {showAgeModal && (
        <div className="modal-overlay" onClick={() => setShowAgeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Age Range</h3>
            <div className="modal-inputs">
              <input
                type="number"
                placeholder="Min Age"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                min="0"
                max="120"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max Age"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                min="0"
                max="120"
              />
            </div>
            <div className="modal-actions">
              <button onClick={clearAgeRange}>Clear</button>
              <button onClick={applyAgeRange} className="primary">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Modal */}
      {showDateModal && (
        <div className="modal-overlay" onClick={() => setShowDateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Date Range</h3>
            <div className="modal-inputs">
              <div>
                <label>From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label>To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={clearDateRange}>Clear</button>
              <button onClick={applyDateRange} className="primary">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Tags Modal */}
      {showTagsModal && (
        <div className="modal-overlay" onClick={() => setShowTagsModal(false)}>
          <div className="modal-content checkbox-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Tags</h3>
            <div className="checkbox-list">
              {filterOptions?.tags?.map(tag => (
                <label key={tag} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.tags?.includes(tag) || false}
                    onChange={() => handleMultiSelectChange('tags', tag)}
                  />
                  <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                onFilterChange('tags', []);
                setShowTagsModal(false);
              }}>Clear</button>
              <button onClick={() => setShowTagsModal(false)} className="primary">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Region Modal */}
      {showRegionModal && (
        <div className="modal-overlay" onClick={() => setShowRegionModal(false)}>
          <div className="modal-content checkbox-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Customer Region</h3>
            <div className="checkbox-list">
              {filterOptions?.customerRegion?.map(region => (
                <label key={region} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.customerRegion?.includes(region) || false}
                    onChange={() => handleMultiSelectChange('customerRegion', region)}
                  />
                  <span>{region.charAt(0).toUpperCase() + region.slice(1)}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                onFilterChange('customerRegion', []);
                setShowRegionModal(false);
              }}>Clear</button>
              <button onClick={() => setShowRegionModal(false)} className="primary">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Gender Modal */}
      {showGenderModal && (
        <div className="modal-overlay" onClick={() => setShowGenderModal(false)}>
          <div className="modal-content checkbox-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Gender</h3>
            <div className="checkbox-list">
              {filterOptions?.gender?.map(gender => (
                <label key={gender} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.gender?.includes(gender) || false}
                    onChange={() => handleMultiSelectChange('gender', gender)}
                  />
                  <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                onFilterChange('gender', []);
                setShowGenderModal(false);
              }}>Clear</button>
              <button onClick={() => setShowGenderModal(false)} className="primary">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content checkbox-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Product Category</h3>
            <div className="checkbox-list">
              {filterOptions?.productCategory?.map(category => (
                <label key={category} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.productCategory?.includes(category) || false}
                    onChange={() => handleMultiSelectChange('productCategory', category)}
                  />
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                onFilterChange('productCategory', []);
                setShowCategoryModal(false);
              }}>Clear</button>
              <button onClick={() => setShowCategoryModal(false)} className="primary">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content checkbox-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Payment Method</h3>
            <div className="checkbox-list">
              {filterOptions?.paymentMethod?.map(method => (
                <label key={method} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.paymentMethod?.includes(method) || false}
                    onChange={() => handleMultiSelectChange('paymentMethod', method)}
                  />
                  <span>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                onFilterChange('paymentMethod', []);
                setShowPaymentModal(false);
              }}>Clear</button>
              <button onClick={() => setShowPaymentModal(false)} className="primary">Done</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;