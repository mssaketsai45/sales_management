const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Sale = require('../models/Sale');

const importCSVData = async () => {
  try {
    console.log('Starting CSV import check...');
    
    // Check if data already exists
    const count = await Sale.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} records. Skipping import.`);
      return;
    }

    console.log('Database is empty. Starting CSV import...');
    const csvFilePath = path.join(__dirname, '../../data/sales_data.csv');
    console.log(`CSV file path: ${csvFilePath}`);
    
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found at: ${csvFilePath}`);
    }
    
    const sales = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          sales.push({
            transactionId: row['Transaction ID'] || row.transactionId,
            date: new Date(row['Date'] || row.date),
            customerId: row['Customer ID'] || row.customerId,
            customerName: row['Customer Name'] || row.customerName,
            phoneNumber: row['Phone Number'] || row.phoneNumber,
            gender: row['Gender'] || row.gender,
            age: parseInt(row['Age'] || row.age),
            productCategory: row['Product Category'] || row.productCategory,
            quantity: parseInt(row['Quantity'] || row.quantity),
            totalAmount: parseFloat(row['Total Amount'] || row.totalAmount),
            discountPercentage: parseFloat(row['Discount Percentage'] || row.discountPercentage || 0),
            customerRegion: row['Customer Region'] || row.customerRegion,
            productId: row['Product ID'] || row.productId,
            employeeName: row['Employee Name'] || row.employeeName,
            tags: row['Tags'] || row.tags || '',
            paymentMethod: row['Payment Method'] || row.paymentMethod || ''
          });
        })
        .on('end', async () => {
          try {
            console.log(`Importing ${sales.length} records in batches...`);
            
            // Import in batches of 10000 to avoid memory issues
            const batchSize = 10000;
            for (let i = 0; i < sales.length; i += batchSize) {
              const batch = sales.slice(i, i + batchSize);
              await Sale.insertMany(batch, { ordered: false });
              console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sales.length / batchSize)}`);
            }
            
            console.log(`✅ Successfully imported ${sales.length} records to MongoDB`);
            resolve();
          } catch (error) {
            console.error('Error inserting data:', error.message);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error importing CSV data:', error);
    throw error;
  }
};

module.exports = { importCSVData };
