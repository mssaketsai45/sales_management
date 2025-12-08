const Sale = require('../models/Sale');

class SalesService {
  
  // Get sales with filters, search, sort, and pagination
  static async getSales(params) {
    try {
      const {
        searchTerm = '',
        customerRegion = [],
        gender = [],
        ageMin,
        ageMax,
        productCategory = [],
        tags = [],
        paymentMethod = [],
        dateFrom,
        dateTo,
        sortBy = 'date',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      // Build query
      const query = {};

      // Search filter (customer name or phone number)
      if (searchTerm && searchTerm.trim()) {
        query.$or = [
          { customerName: { $regex: searchTerm, $options: 'i' } },
          { phoneNumber: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      // Customer Region filter
      if (customerRegion.length > 0) {
        query.customerRegion = { $in: customerRegion };
      }

      // Gender filter
      if (gender.length > 0) {
        query.gender = { $in: gender };
      }

      // Age range filter
      if (ageMin || ageMax) {
        query.age = {};
        if (ageMin) query.age.$gte = parseInt(ageMin);
        if (ageMax) query.age.$lte = parseInt(ageMax);
      }

      // Product Category filter
      if (productCategory.length > 0) {
        query.productCategory = { $in: productCategory };
      }

      // Tags filter - match if any selected tag appears in the comma-separated tags field
      if (tags.length > 0) {
        query.$or = tags.map(tag => ({
          tags: { $regex: new RegExp(`(^|,\\s*)${tag}(\\s*,|$)`, 'i') }
        }));
      }

      // Payment Method filter
      if (paymentMethod.length > 0) {
        query.paymentMethod = { $in: paymentMethod };
      }

      // Date range filter
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
      }

      // Sorting
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const limitNum = parseInt(limit);

      // Execute query
      const [sales, totalRecords] = await Promise.all([
        Sale.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Sale.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalRecords / limitNum);

      return {
        sales,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords,
          recordsPerPage: limitNum,
          hasNextPage: parseInt(page) < totalPages,
          hasPreviousPage: parseInt(page) > 1
        }
      };
    } catch (error) {
      console.error('Error in getSales:', error);
      throw error;
    }
  }

  // Get filter options (unique values for dropdowns)
  static async getFilterOptions() {
    try {
      const [customerRegions, genders, productCategories, paymentMethods, tagsList] = await Promise.all([
        Sale.distinct('customerRegion'),
        Sale.distinct('gender'),
        Sale.distinct('productCategory'),
        Sale.distinct('paymentMethod'),
        Sale.distinct('tags')
      ]);

      // Extract unique individual tags from comma-separated values
      const uniqueTags = new Set();
      tagsList.forEach(tagString => {
        if (tagString) {
          // Split by comma and trim whitespace
          const tags = tagString.split(',').map(tag => tag.trim()).filter(Boolean);
          tags.forEach(tag => uniqueTags.add(tag));
        }
      });

      return {
        customerRegion: customerRegions.filter(Boolean).sort(),
        gender: genders.filter(Boolean).sort(),
        productCategory: productCategories.filter(Boolean).sort(),
        tags: Array.from(uniqueTags).sort(),
        paymentMethod: paymentMethods.filter(Boolean).sort()
      };
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      throw error;
    }
  }

  // Get summary statistics
  static async getSummaryStats() {
    try {
      const stats = await Sale.aggregate([
        {
          $group: {
            _id: null,
            totalUnits: { $sum: '$quantity' },
            totalAmount: { $sum: '$totalAmount' },
            totalRecords: { $sum: 1 }
          }
        }
      ]);

      if (stats.length === 0) {
        return { totalUnits: 0, totalAmount: 0, totalRecords: 0 };
      }

      return stats[0];
    } catch (error) {
      console.error('Error in getSummaryStats:', error);
      throw error;
    }
  }
}

module.exports = SalesService;
