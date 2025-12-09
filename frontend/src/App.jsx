import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import SalesTable from './components/SalesTable';
import Pagination from './components/Pagination';
import { fetchSales, fetchFilterOptions } from './services/api';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
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
  const [filterOptions, setFilterOptions] = useState(null);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('customerName');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const pageSize = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch sales data when dependencies change
  useEffect(() => {
    const loadSales = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          search: debouncedSearchTerm,
          ...filters,
          sortBy,
          sortOrder,
          page: currentPage,
          pageSize
        };
        
        const response = await fetchSales(params);
        setSales(response.sales || response.data || []);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message || 'Failed to load sales data');
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, [debouncedSearchTerm, filters, sortBy, sortOrder, currentPage]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'customerName' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRemoveFilters = () => {
    setSearchTerm('');
    setFilters({
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
    setCurrentPage(1);
  };

  // Calculate summary statistics
  const totalUnits = (sales || []).reduce((sum, sale) => sum + (sale.quantity || 0), 0);
  const totalAmount = (sales || []).reduce((sum, sale) => sum + (sale.totalAmount || sale.finalAmount || 0), 0);
  const totalDiscount = (sales || []).reduce((sum, sale) => {
    const amount = sale.totalAmount || sale.finalAmount || 0;
    const discount = sale.discountPercentage || 0;
    return sum + (amount * discount / 100);
  }, 0);

  return (
    <div className="app">
      <Sidebar />
      
      <div className="main-content">
        <Header
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onRemoveFilters={handleRemoveFilters}
        />

        <div className="content-area">
          <SummaryCards
            totalUnits={totalUnits}
            totalAmount={totalAmount}
            totalDiscount={totalDiscount}
          />

          <div className="table-container">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            
            {!loading && !error && sales.length === 0 && (
              <div className="no-results">
                No sales records found. Try adjusting your search or filters.
              </div>
            )}
            
            {!loading && !error && sales.length > 0 && (
              <>
                <SalesTable sales={sales} />
                
                {pagination && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
