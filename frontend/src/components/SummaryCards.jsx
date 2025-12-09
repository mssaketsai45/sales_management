import React from 'react';

const SummaryCards = ({ totalUnits, totalAmount, totalDiscount }) => {
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="card-header">
          <span className="card-label">Total units sold</span>
          <span className="card-info-icon">ⓘ</span>
        </div>
        <div className="card-value">{totalUnits.toLocaleString('en-IN')}</div>
      </div>

      <div className="summary-card">
        <div className="card-header">
          <span className="card-label">Total Amount</span>
          <span className="card-info-icon">ⓘ</span>
        </div>
        <div className="card-value">
          ₹{totalAmount.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="summary-card">
        <div className="card-header">
          <span className="card-label">Total Discount</span>
          <span className="card-info-icon">ⓘ</span>
        </div>
        <div className="card-value">
          ₹{Math.round(totalDiscount || 0).toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;