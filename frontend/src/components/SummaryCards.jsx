import React from 'react';

const SummaryCards = ({ totalUnits, totalAmount }) => {
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="card-header">
          <span className="card-label">Total units sold</span>
          <span className="card-info-icon">ⓘ</span>
        </div>
        <div className="card-value">{totalUnits}</div>
      </div>

      <div className="summary-card">
        <div className="card-header">
          <span className="card-label">Total Amount</span>
          <span className="card-info-icon">ⓘ</span>
        </div>
        <div className="card-value">
          ₹{totalAmount.toLocaleString('en-IN')} ({totalUnits} SRs)
        </div>
      </div>

      <div className="summary-card">
        <div className="card-header">
          <span className="card-label">Total Discount</span>
          <span className="card-info-icon">ⓘ</span>
        </div>
        <div className="card-value">₹{(15000).toLocaleString('en-IN')} (45 SRs)</div>
      </div>
    </div>
  );
};

export default SummaryCards;