const SalesService = require('../services/salesService');

const getSales = async (req, res) => {
  try {
    const params = {
      searchTerm: req.query.search,
      customerRegion: req.query.customerRegion ? 
        (Array.isArray(req.query.customerRegion) ? req.query.customerRegion : [req.query.customerRegion]) : [],
      gender: req.query.gender ? 
        (Array.isArray(req.query.gender) ? req.query.gender : [req.query.gender]) : [],
      ageMin: req.query.ageMin ? parseInt(req.query.ageMin) : undefined,
      ageMax: req.query.ageMax ? parseInt(req.query.ageMax) : undefined,
      productCategory: req.query.productCategory ? 
        (Array.isArray(req.query.productCategory) ? req.query.productCategory : [req.query.productCategory]) : [],
      tags: req.query.tags ? 
        (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : [],
      paymentMethod: req.query.paymentMethod ? 
        (Array.isArray(req.query.paymentMethod) ? req.query.paymentMethod : [req.query.paymentMethod]) : [],
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      sortBy: req.query.sortBy || 'date',
      sortOrder: req.query.sortOrder || 'desc',
      page: req.query.page || 1,
      limit: req.query.pageSize || 10
    };

    const result = await SalesService.getSales(params);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error in getSales:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales data',
      error: error.message
    });
  }
};

const getFilterOptions = async (req, res) => {
  try {
    const options = await SalesService.getFilterOptions();
    
    res.json({
      success: true,
      filterOptions: options
    });
  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};

module.exports = {
  getSales,
  getFilterOptions
};
