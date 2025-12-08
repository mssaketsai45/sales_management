import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let salesData = [];
let isLoaded = false;

export const loadSalesData = () => {
  return new Promise((resolve, reject) => {
    if (isLoaded) {
      resolve(salesData);
      return;
    }

    const results = [];
    const csvPath = path.join(__dirname, '../../data/sales_data.csv');

    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found at:', csvPath);
      reject(new Error('CSV file not found. Please add sales_data.csv to backend/data/'));
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // Parse and normalize data
        const record = {
          // Customer Fields
          customerId: data['Customer ID'] || data.customerId,
          customerName: data['Customer Name'] || data.customerName,
          phoneNumber: data['Phone Number'] || data.phoneNumber,
          gender: data['Gender'] || data.gender,
          age: parseInt(data['Age'] || data.age) || 0,
          customerRegion: data['Customer Region'] || data.customerRegion,
          customerType: data['Customer Type'] || data.customerType,
          
          // Product Fields
          productId: data['Product ID'] || data.productId,
          productName: data['Product Name'] || data.productName,
          brand: data['Brand'] || data.brand,
          productCategory: data['Product Category'] || data.productCategory,
          tags: data['Tags'] || data.tags,
          
          // Sales Fields
          quantity: parseInt(data['Quantity'] || data.quantity) || 0,
          pricePerUnit: parseFloat(data['Price per Unit'] || data.pricePerUnit) || 0,
          discountPercentage: parseFloat(data['Discount Percentage'] || data.discountPercentage) || 0,
          totalAmount: parseFloat(data['Total Amount'] || data.totalAmount) || 0,
          finalAmount: parseFloat(data['Final Amount'] || data.finalAmount) || 0,
          
          // Operational Fields
          date: data['Date'] || data.date,
          paymentMethod: data['Payment Method'] || data.paymentMethod,
          orderStatus: data['Order Status'] || data.orderStatus,
          deliveryType: data['Delivery Type'] || data.deliveryType,
          storeId: data['Store ID'] || data.storeId,
          storeLocation: data['Store Location'] || data.storeLocation,
          salespersonId: data['Salesperson ID'] || data.salespersonId,
          employeeName: data['Employee Name'] || data.employeeName
        };
        results.push(record);
      })
      .on('end', () => {
        salesData = results;
        isLoaded = true;
        console.log(`Loaded ${salesData.length} sales records`);
        resolve(salesData);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export const getSalesData = () => {
  return salesData;
};
