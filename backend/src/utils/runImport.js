require('dotenv').config();
const connectDB = require('../config/database');
const { importCSVData } = require('./importData');

const runImport = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    console.log('Starting CSV import...');
    await importCSVData();
    
    console.log('Import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
};

runImport();
