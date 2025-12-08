import React from 'react';

const SalesTable = ({ sales }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹ ${amount?.toLocaleString('en-IN') || 0}`;
  };

  return (
    <div className="sales-table-wrapper">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Customer region</th>
            <th>Product ID</th>
            <th>Employee name</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={`${sale.customerId}-${sale.productId}-${index}`}>
              <td>{index + 1234567}</td>
              <td>{formatDate(sale.date)}</td>
              <td>{sale.customerId}</td>
              <td>{sale.customerName}</td>
              <td>
                <div className="phone-number">
                  <span>+91 {sale.phoneNumber}</span>
                  {sale.phoneNumber && (
                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(`+91${sale.phoneNumber}`)} title="Copy phone number">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </td>
              <td>{sale.gender}</td>
              <td>{sale.age}</td>
              <td>{sale.productCategory}</td>
              <td>{String(sale.quantity).padStart(2, '0')}</td>
              <td>{formatCurrency(sale.totalAmount)}</td>
              <td>{sale.customerRegion}</td>
              <td>{sale.productId}</td>
              <td>{sale.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
