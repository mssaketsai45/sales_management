# Retail Sales Management System

A full-stack web application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

## Overview

This system provides a comprehensive solution for retail sales data management, featuring a clean and intuitive user interface with powerful data manipulation capabilities. Built with modern web technologies, it supports real-time searching, multi-criteria filtering, flexible sorting, and efficient pagination across large datasets.

## Tech Stack

### Backend
- Node.js with Express.js
- CSV Parser for data processing
- CORS-enabled RESTful API

### Frontend
- React 18 with Vite
- Axios for HTTP requests
- Custom CSS styling
- React Hooks for state management

## Features

### Search Implementation
The search functionality provides case-insensitive full-text search across customer names and phone numbers. Implemented with a 500ms debounce on the frontend to optimize API calls, the search maintains all active filters and sorting preferences while resetting pagination to the first page for new results.

### Filter Implementation
Multi-select filtering supports simultaneous selection across multiple categories including customer region, gender, product category, tags, and payment methods. Range-based filters enable age and date filtering with minimum/maximum boundaries. All filters work independently and in combination, with backend processing ensuring accurate results that maintain search and sort states.

### Sorting Implementation
Three sorting options are available: Date (newest first), Quantity (highest first), and Customer Name (A-Z). Sorting can be toggled between ascending and descending order, and all active filters and search terms are preserved when sort order changes. Pagination resets to the first page when sorting is modified.

### Pagination Implementation
Server-side pagination delivers 10 items per page with intelligent page number display (up to 6 visible page numbers). The system provides full pagination metadata including current page, total pages, and navigation availability. All filters, search terms, and sorting preferences persist across page navigation, ensuring a seamless browsing experience.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Sales data CSV file

### Installation

1. **Clone or download the repository**

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Add Sales Data:**
   - Download the sales CSV file
   - Place it in `backend/data/sales_data.csv`

4. **Start Backend Server:**
   ```bash
   npm start
   ```
   Backend runs on `http://localhost:5000`

5. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start Frontend Development Server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

7. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── routes/         # API routes
│   │   └── index.js        # Entry point
│   ├── data/               # CSV data storage
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API integration
│   │   ├── utils/          # Helper functions
│   │   ├── hooks/          # Custom hooks
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx         # Main component
│   │   └── main.jsx        # Entry point
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── architecture.md
│
└── README.md
```

## API Documentation

### Endpoints

**GET** `/api/sales` - Retrieve sales data
- Query params: search, filters, sorting, pagination
- Returns: Sales records with pagination metadata

**GET** `/api/sales/filter-options` - Get filter options
- Returns: Available values for all filter categories

## Deployment

### Backend
Deploy to platforms like Heroku, Render, or Railway with environment variables configured.

### Frontend
Build for production:
```bash
cd frontend
npm run build
```
Deploy the `dist` folder to Vercel, Netlify, or similar platforms.

## Contributing

This project was built as an assignment for TruEstate. For questions or improvements, please contact the development team.

## License

MIT License - Feel free to use this project for learning and development purposes.
