# System Architecture

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Deployment**: Vercel Serverless Functions

### Layer Structure

#### 1. Routes Layer (`src/routes/`)
- Defines API endpoints and HTTP methods
- Maps requests to appropriate controllers
- Handles route-level middleware

**Key Routes:**
- `GET /api/sales` - Retrieve sales data with filters, search, sort, pagination
- `GET /api/sales/summary` - Get aggregated statistics
- `GET /api/filters` - Get available filter options

#### 2. Controllers Layer (`src/controllers/`)
- Handles HTTP request/response cycle
- Validates incoming requests
- Delegates business logic to services
- Formats responses

**salesController.js:**
- `getSales()` - Processes query parameters and returns paginated results
- `getSummaryStats()` - Returns aggregated sales metrics
- `getFilterOptions()` - Returns distinct values for filters

#### 3. Services Layer (`src/services/`)
- Contains core business logic
- Performs database operations
- Implements filtering, sorting, and pagination logic
- Handles data aggregation

**salesService.js:**
- Query building with MongoDB aggregation pipeline
- Dynamic filter construction
- Sort and pagination logic
- Summary calculations (total sales, units, discount)

#### 4. Models Layer (`src/models/`)
- Defines MongoDB schemas using Mongoose
- Enforces data structure and validation
- Provides data access methods

**Sale.js:**
- Schema with 26 fields including customer, product, sales, and operational data
- Indexes on frequently queried fields (customerName, date, customerRegion)
- Data type validation and default values

#### 5. Utils Layer (`src/utils/`)
- Helper functions and utilities
- Data import scripts
- Reusable logic

**importData.js:**
- CSV parsing and data import
- Data transformation and validation
- Bulk insert operations with error handling

### Data Flow (Backend)

```
Client Request
    ↓
Express Middleware (CORS, JSON Parser)
    ↓
Route Handler (routes/sales.js)
    ↓
Controller (controllers/salesController.js)
    ↓
Service Layer (services/salesService.js)
    ↓
MongoDB (via Mongoose Models)
    ↓
Service Layer (data transformation)
    ↓
Controller (response formatting)
    ↓
Client Response
```

### Database Schema Design

**Sale Model:**
```javascript
{
  transactionId: String,
  date: Date (indexed),
  customerId: String,
  customerName: String (indexed),
  phoneNumber: String,
  gender: String,
  age: Number,
  customerRegion: String (indexed),
  customerType: String,
  productId: String,
  productName: String,
  brand: String,
  productCategory: String (indexed),
  tags: [String] (indexed),
  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,
  paymentMethod: String (indexed),
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salespersonId: String,
  employeeName: String
}
```

### API Design

**Endpoint: GET /api/sales**

Query Parameters:
- `page` (number) - Current page number
- `limit` (number) - Items per page
- `search` (string) - Search term for name/phone
- `sortBy` (string) - Field to sort by
- `sortOrder` (asc/desc) - Sort direction
- `customerRegion` (array) - Filter by regions
- `gender` (array) - Filter by gender
- `productCategory` (array) - Filter by categories
- `tags` (array) - Filter by tags
- `paymentMethod` (array) - Filter by payment methods
- `ageMin` (number) - Minimum age
- `ageMax` (number) - Maximum age
- `dateFrom` (string) - Start date
- `dateTo` (string) - End date

Response Format:
```json
{
  "sales": [...],
  "totalPages": 100,
  "currentPage": 1,
  "totalRecords": 1000000,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

---

## Frontend Architecture

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router (if multi-page)
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Custom CSS
- **Deployment**: Vercel

### Component Structure

#### 1. App Component (`src/App.jsx`)
- Root component managing global state
- Handles API calls to backend
- Manages search, filter, sort, and pagination state
- Coordinates data flow between components

**State Management:**
- `sales` - Current page of sales data
- `filters` - Active filter selections
- `searchTerm` - Current search query
- `sortBy` / `sortOrder` - Sorting configuration
- `currentPage` / `totalPages` - Pagination state
- `loading` / `error` - UI states

#### 2. Header Component (`src/components/Header.jsx`)
- Search bar with debounced input
- Filter buttons and modals
- Sort dropdown
- Filter state display

**Sub-features:**
- Multi-select filter modals (Region, Gender, Category, Tags, Payment)
- Range filter modals (Age, Date)
- Filter collapse/expand functionality
- Reset filters button

#### 3. SummaryCards Component (`src/components/SummaryCards.jsx`)
- Displays aggregated metrics
- Cards for Total Units, Total Amount, Total Discount
- Real-time updates based on active filters

#### 4. SalesTable Component (`src/components/SalesTable.jsx`)
- Responsive table displaying sales records
- Horizontal scroll for mobile devices
- Column formatting (currency, dates, status badges)
- Optimized rendering for large datasets

#### 5. Pagination Component (`src/components/Pagination.jsx`)
- Page number display and navigation
- Previous/Next buttons
- Smart page number truncation
- Maintains filter and sort state

### Services Layer (`src/services/`)

**salesService.js:**
- `getSales()` - Fetches paginated sales data
- `getSummaryStats()` - Fetches aggregated statistics
- `getFilterOptions()` - Fetches available filter values
- Centralizes API calls with Axios
- Handles query parameter construction

### Data Flow (Frontend)

```
User Interaction (Search/Filter/Sort/Page)
    ↓
Event Handler in Component
    ↓
State Update (App.jsx)
    ↓
useEffect Triggered
    ↓
API Call (salesService.js)
    ↓
Axios HTTP Request
    ↓
Backend API
    ↓
Response Received
    ↓
State Update with Data
    ↓
Component Re-render
    ↓
UI Update
```

### State Management Strategy

**Centralized State (App.jsx):**
- Single source of truth for all filters
- Unified state object reduces prop drilling
- useEffect dependencies trigger API calls
- Debounced search prevents excessive requests

**Component-Level State:**
- Modal visibility toggles
- Temporary form inputs (age range, date range)
- UI-specific states (collapse/expand)

### Search Implementation Details

1. **Frontend**: 500ms debounce on search input
2. **State Update**: Search term stored in App state
3. **API Call**: Triggered via useEffect when searchTerm changes
4. **Backend**: Case-insensitive regex search on customerName and phoneNumber
5. **Pagination**: Resets to page 1 on new search

### Filter Implementation Details

**Multi-Select Filters:**
- Array-based state (e.g., `customerRegion: ['North', 'South']`)
- Checkbox UI in modal dialogs
- Backend receives arrays and applies `$in` operator

**Range Filters:**
- Min/Max inputs for age
- Date picker inputs for date range
- Validation before applying
- Backend applies `$gte` and `$lte` operators

### Performance Optimizations

**Frontend:**
- Debounced search input (500ms)
- Memoized filter options
- Conditional API calls (only when state changes)
- Lazy loading of modals

**Backend:**
- Database indexes on frequently queried fields
- MongoDB aggregation pipeline for efficiency
- Pagination to limit data transfer
- Cursor-based queries for large datasets

---

## Module Responsibilities

### Backend Modules

| Module | Responsibility |
|--------|----------------|
| `routes/sales.js` | Define API endpoints, route to controllers |
| `controllers/salesController.js` | Handle HTTP requests, validate input, format responses |
| `services/salesService.js` | Business logic, database queries, data transformation |
| `models/Sale.js` | Schema definition, validation, database interface |
| `utils/importData.js` | CSV import, data seeding, initial setup |
| `index.js` | Server initialization, middleware setup, error handling |

### Frontend Modules

| Module | Responsibility |
|--------|----------------|
| `App.jsx` | Root component, state management, API orchestration |
| `Header.jsx` | Search, filters, sorting UI |
| `SummaryCards.jsx` | Display aggregated statistics |
| `SalesTable.jsx` | Render sales data in table format |
| `Pagination.jsx` | Page navigation controls |
| `salesService.js` | API communication, request construction |
| `styles/index.css` | Global styles, component styling |

---

## Folder Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js      # Request handlers
│   │   ├── services/
│   │   │   └── salesService.js         # Business logic
│   │   ├── routes/
│   │   │   └── sales.js                # API routes
│   │   ├── models/
│   │   │   └── Sale.js                 # MongoDB schema
│   │   ├── utils/
│   │   │   └── importData.js           # Data import utility
│   │   └── index.js                    # Server entry point
│   ├── data/
│   │   └── sales_data.csv              # Source dataset
│   ├── .env                            # Environment variables
│   ├── package.json
│   ├── vercel.json                     # Vercel deployment config
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx              # Search, filter, sort UI
│   │   │   ├── SummaryCards.jsx        # Summary statistics
│   │   │   ├── SalesTable.jsx          # Data table
│   │   │   └── Pagination.jsx          # Page navigation
│   │   ├── services/
│   │   │   └── salesService.js         # API client
│   │   ├── styles/
│   │   │   └── index.css               # Global styles
│   │   ├── App.jsx                     # Root component
│   │   └── main.jsx                    # React entry point
│   ├── public/                         # Static assets
│   ├── .env.production                 # Production environment
│   ├── .env.local                      # Local environment
│   ├── package.json
│   ├── vercel.json                     # Vercel SPA config
│   ├── vite.config.js                  # Vite configuration
│   └── README.md
│
├── docs/
│   └── architecture.md                 # This file
│
├── DEPLOYMENT.md                       # Deployment guide
└── README.md                           # Project overview
```

---

## Deployment Architecture

### Production Setup

**Backend:**
- Platform: Vercel Serverless Functions
- URL: https://sales-management-backend-is8fw41tr.vercel.app
- Environment: MONGODB_URI, CORS_ORIGIN, NODE_ENV

**Frontend:**
- Platform: Vercel Static Hosting
- URL: https://sales-management-frontend-b1ga8itfh.vercel.app
- Environment: VITE_API_URL

**Database:**
- Platform: MongoDB Atlas (M0 Free Tier)
- Cluster: cluster0.6m0fstd.mongodb.net
- Database: sales_management
- Records: 1,000,000 sales documents

### Communication Flow

```
User Browser
    ↓ HTTPS
Vercel Frontend (React SPA)
    ↓ Axios/HTTPS
Vercel Backend (Express API)
    ↓ MongoDB Driver
MongoDB Atlas (Cloud Database)
```

---

## Security Considerations

1. **CORS Configuration**: Restricted origins in production
2. **Environment Variables**: Sensitive data in .env files (not committed)
3. **Input Validation**: Server-side validation of all query parameters
4. **MongoDB Injection Prevention**: Mongoose sanitization
5. **Rate Limiting**: Can be added via middleware (future enhancement)

---

## Scalability Considerations

1. **Database Indexing**: Key fields indexed for query performance
2. **Pagination**: Prevents memory overflow with large datasets
3. **Aggregation Pipeline**: Efficient server-side data processing
4. **Stateless Backend**: Supports horizontal scaling
5. **CDN Deployment**: Static frontend assets cached globally via Vercel

---

## Error Handling

**Backend:**
- Try-catch blocks in all async operations
- Centralized error handler middleware
- Structured error responses with status codes
- Logging for debugging

**Frontend:**
- Error state management
- User-friendly error messages
- Fallback UI for failed requests
- Loading states during API calls

---

## Future Enhancements

1. **Caching**: Redis for frequently accessed data
2. **Real-time Updates**: WebSocket integration
3. **Export Functionality**: CSV/Excel export
4. **Advanced Analytics**: Charts and visualizations
5. **User Authentication**: Role-based access control
6. **Audit Logs**: Track data changes
