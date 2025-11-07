# RePurpose Full-Stack Application - Code Analysis

## 📋 Project Overview

**RePurpose** is a donation/marketplace platform that connects individuals who want to donate items with NGOs and other users who need them. The application supports three user types:
- **Individual**: Can donate items and make requests
- **NGO**: Can request items for their organization
- **Admin**: Manages categories, users, and requests

---

## 🏗️ Architecture

### Backend Stack
- **Runtime**: Node.js (Express.js v5.1.0)
- **Database**: MySQL (mysql2 driver)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Development**: nodemon for live reload

### Frontend Stack
- **Framework**: React 19.1.1 with Vite
- **Routing**: React Router DOM v7.9.4
- **State Management**: React Context API
- **Styling**: CSS Modules

---

## 📁 Project Structure

```
fullstack-project/
├── Repurpose/                    # Backend
│   ├── backend/
│   │   ├── config/db.js         # MySQL connection
│   │   ├── controllers/         # Request controller
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT authentication middleware
│   │   │   ├── errorHandler.js  # Centralized error handling
│   │   │   └── validate.js      # Joi validation middleware
│   │   ├── routes/              # API route handlers
│   │   ├── validators/          # Joi schemas
│   │   └── server.js            # Express app entry point
│   ├── schema.sql               # Database schema
│   └── API_DOCS.md              # API documentation
│
└── Minorproject/
    └── frontend/                # Frontend React app
        └── src/
            ├── api/             # API service functions
            ├── components/      # Reusable components
            ├── context/         # React Context (AuthContext)
            ├── hooks/           # Custom hooks (useAuth)
            ├── pages/           # Page components
            └── styles/          # Global styles
```

---

## 🔍 Detailed Component Analysis

### Backend Components

#### 1. **Database Configuration** (`backend/config/db.js`)
- ✅ Uses environment variables for connection
- ✅ Proper connection handling
- ⚠️ **Issue**: Uses callback-based API instead of promises/async-await
- ⚠️ **Issue**: No connection pooling configuration

#### 2. **Authentication Middleware** (`backend/middleware/auth.js`)
- ✅ Proper JWT verification
- ✅ Role-based access control
- ✅ Good error handling
- ✅ Bearer token extraction

#### 3. **Validation Middleware** (`backend/middleware/validate.js`)
- ✅ Uses Joi for validation
- ✅ Returns detailed error messages
- ✅ Strips unknown fields

#### 4. **Error Handler** (`backend/middleware/errorHandler.js`)
- ✅ Centralized error handling
- ⚠️ **Issue**: Basic error messages (could include more details in development)

#### 5. **Routes**

**Users Route** (`routes/users.js`):
- ✅ Password hashing with bcrypt
- ✅ JWT token generation on login
- ✅ Email uniqueness check
- ✅ Proper validation
- ⚠️ **Issue**: Frontend calls `/api/auth/login` but backend has `/api/users/login`
- ⚠️ **Issue**: Registration expects `user_type` but validator uses `role`

**Items Route** (`routes/items.js`):
- ✅ CRUD operations
- ✅ Owner-only update/delete
- ✅ Public listing endpoints
- ✅ Proper authorization checks

**Categories Route** (`routes/categories.js`):
- ✅ Admin-only creation/deletion
- ✅ Public listing

**Requests Route** (`routes/requests.js`):
- ✅ Proper joins for related data
- ✅ Admin status updates
- ⚠️ **Issue**: Uses `quantity_needed` field but schema doesn't have it

#### 6. **Server Entry Point** (`backend/server.js`)
- ✅ CORS enabled
- ✅ JSON middleware
- ✅ Route mounting
- ❌ **Critical Bug**: Duplicate `GET "/"` route definition (lines 18-24)

---

### Frontend Components

#### 1. **API Services**

**apiClient.js**:
- ✅ Centralized API base URL
- ✅ Auth header helper function
- ✅ Reusable HTTP methods (GET, POST, PUT)
- ⚠️ **Issue**: Token not automatically set after login

**authService.js**:
- ❌ **Critical Bug**: Calls `/api/auth/login` and `/api/auth/signup` but backend uses `/api/users/login` and `/api/users/register`
- ❌ **Critical Bug**: Token not stored in localStorage after login
- ⚠️ **Issue**: Passes `userType` to backend but backend doesn't use it in login

#### 2. **Authentication Context** (`context/AuthContext.jsx`)
- ✅ Context API implementation
- ✅ Login/signup/logout functions
- ❌ **Critical Bug**: Token not saved to localStorage
- ❌ **Critical Bug**: User state not persisted (lost on refresh)
- ⚠️ **Issue**: Doesn't restore user from localStorage on mount

#### 3. **Protected Routes** (`components/auth/ProtectedRoute.jsx`)
- ✅ Role-based access control
- ✅ Proper redirects
- ✅ Uses useAuth hook

#### 4. **Routing** (`App.jsx`)
- ✅ Well-organized route structure
- ✅ Role-based route protection
- ✅ Public/private route separation

---

## 🐛 Critical Issues Found

### 1. **API Endpoint Mismatch**
- **Frontend** (`authService.js`) calls: `/api/auth/login`, `/api/auth/signup`
- **Backend** (`routes/users.js`) provides: `/api/users/login`, `/api/users/register`
- **Impact**: Authentication will fail completely
- **Fix**: Update frontend to match backend or create backend routes

### 2. **Token Not Stored After Login**
- Login response includes token but it's never saved to `localStorage`
- `apiClient.js` expects token in localStorage but it's never set
- **Impact**: All authenticated requests will fail
- **Fix**: Store token in localStorage after successful login/signup

### 3. **User State Not Persisted**
- `AuthContext` uses `useState` only, doesn't check localStorage on mount
- **Impact**: User must login on every page refresh
- **Fix**: Initialize user state from localStorage on mount

### 4. **Database Schema Mismatch**
- `routes/requests.js` uses `quantity_needed` column
- `schema.sql` doesn't define this column
- **Impact**: Request creation will fail with SQL error
- **Fix**: Add `quantity_needed INT DEFAULT 1` to requests table

### 5. **Duplicate Route in server.js**
- Two `GET "/"` routes defined (lines 18 and 22)
- **Impact**: Second route never executes
- **Fix**: Remove duplicate

### 6. **Registration Field Mismatch**
- Frontend sends `userType`/`role`
- Backend expects `user_type`
- Validator uses `role` but database column is `user_type`
- **Impact**: User type may not be saved correctly
- **Fix**: Align field names across frontend/backend

---

## ⚠️ Minor Issues & Improvements

### Security
- ✅ Passwords are hashed
- ✅ JWT tokens used
- ⚠️ No token refresh mechanism
- ⚠️ No rate limiting
- ⚠️ No input sanitization (SQL injection protection via parameterized queries is good, but XSS protection missing)
- ⚠️ CORS configured but may need to restrict origins in production

### Code Quality
- ✅ Good separation of concerns
- ✅ Middleware pattern used correctly
- ✅ Validation schemas defined
- ⚠️ Mixed async patterns (callbacks vs promises)
- ⚠️ No error logging service
- ⚠️ Some hardcoded values (JWT expiration, bcrypt rounds)

### Database
- ✅ Foreign keys defined
- ✅ CASCADE deletes configured
- ⚠️ No indexes on frequently queried columns (email, user_id, category_id)
- ⚠️ No timestamps for updates (only created_at)

### Frontend
- ✅ Modern React patterns (hooks, context)
- ✅ Component modularity
- ⚠️ No error boundaries
- ⚠️ No loading states visible in some components
- ⚠️ API error handling could be more user-friendly

---

## 📊 Database Schema Analysis

### Tables
1. **users**: Individual, NGO, and admin accounts
2. **categories**: Item categories (Clothing, Books, etc.)
3. **items**: Donated items with category and owner
4. **requests**: Item requests with status tracking

### Missing Features
- ❌ `quantity_needed` column in requests table
- ❌ `phone` column not in schema but used in routes
- ❌ No indexes on foreign keys or frequently queried columns
- ❌ No `updated_at` timestamps

---

## 🔄 Data Flow

### Authentication Flow (Current - Broken)
1. User submits login form
2. Frontend calls `/api/auth/login` ❌ (should be `/api/users/login`)
3. Backend validates and returns token
4. Frontend receives token but doesn't store it ❌
5. Subsequent requests fail authentication ❌

### Expected Authentication Flow
1. User submits login form
2. Frontend calls `/api/users/login`
3. Backend validates and returns `{ token, user }`
4. Frontend stores token in localStorage ✅
5. Frontend stores user in context ✅
6. Subsequent requests include token in Authorization header ✅

---

## ✅ Strengths

1. **Good Architecture**: Clear separation between frontend and backend
2. **Security**: Password hashing, JWT tokens, parameterized queries
3. **Validation**: Joi schemas for input validation
4. **Role-Based Access**: Proper middleware for role checks
5. **Modern Stack**: Latest versions of React and Express
6. **Documentation**: API docs and README present

---

## 🚀 Recommendations

### Immediate Fixes (Critical)
1. Fix API endpoint mismatch between frontend and backend
2. Store JWT token in localStorage after login/signup
3. Add `quantity_needed` column to requests table
4. Persist user state from localStorage on app mount
5. Remove duplicate route in server.js

### Short-term Improvements
1. Add database indexes for performance
2. Implement token refresh mechanism
3. Add error boundaries in React
4. Improve error messages for users
5. Add loading states to UI
6. Standardize async/await pattern in backend

### Long-term Enhancements
1. Add rate limiting
2. Implement email verification
3. Add file upload for item images
4. Add pagination for listings
5. Implement search functionality
6. Add unit and integration tests
7. Set up CI/CD pipeline
8. Add monitoring and logging

---

## 📝 Summary

The codebase shows a solid foundation with good architectural decisions, but has several critical bugs that prevent it from functioning:
- **API endpoint mismatches** break authentication
- **Token storage issues** prevent authenticated requests
- **Database schema mismatch** will cause runtime errors
- **State persistence** issues degrade user experience

Once these critical issues are fixed, the application should function correctly. The code structure is clean and maintainable, making it easy to add features and improvements.

---

## 🧪 Testing Recommendations

1. **Unit Tests**: Test validators, middleware functions
2. **Integration Tests**: Test API endpoints with test database
3. **E2E Tests**: Test complete user flows (login, donate, request)
4. **Security Tests**: Test authentication, authorization, input validation

---

Generated: $(date)

