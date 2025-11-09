# Repurpose Platform - Complete Project Overview

## 📋 Project Description

**Repurpose** is a web application that connects individual users, NGOs (Non-Governmental Organizations), and administrators for managing donations and community support activities. The platform enables users to donate items, NGOs to request items and launch campaigns, and admins to manage the entire ecosystem.

---

## 🎭 User Roles & Access

### 1. **Individual Users (Donators)**
- Can donate items
- Can view requests for their donated items
- Can chat with NGOs who requested their items
- Can see their donation history

### 2. **NGOs (Requesters)**
- Must be verified by admin before accessing platform
- Can browse and request items from donors
- Can set location to see nearby items first
- Can create and launch campaigns/events
- Can report users for misconduct
- Can chat with item donors
- Can manage their requests

### 3. **Admin**
- Manages all users and NGOs
- Verifies NGO registrations
- Reviews and approves/rejects NGO campaigns
- Manages categories
- Views platform statistics with charts
- Reviews user reports from NGOs
- Can view all donations and requests

---

## 🗄️ Database Schema

### Tables:

1. **users**
   - `id`, `name`, `email`, `password`, `phone`, `location`
   - `user_type` (ENUM: 'individual', 'ngo', 'admin')
   - `documents` (TEXT) - For NGO verification documents
   - `verification_status` (ENUM: 'Pending', 'Approved', 'Rejected')
   - `remarks` (TEXT) - Admin remarks
   - `created_at`

2. **categories**
   - `id`, `name`, `description`, `created_at`

3. **items**
   - `id`, `title`, `description`, `category_id`, `user_id`
   - `location`, `image_url`, `created_at`

4. **requests**
   - `id`, `item_id`, `requester_id`, `status` (ENUM: 'pending', 'approved', 'rejected', 'completed')
   - `created_at`

5. **messages**
   - `id`, `item_id`, `sender_id`, `receiver_id`, `message`, `created_at`

6. **ngo_campaigns**
   - `id`, `ngo_id`, `title`, `description`, `category`
   - `image_url`, `start_date`, `end_date`, `contact_link`
   - `approval_status` (ENUM: 'Pending', 'Approved', 'Rejected')
   - `created_at`, `updated_at`

7. **user_reports**
   - `id`, `reported_user_id`, `reporter_id`, `reason`, `description`
   - `status` (ENUM: 'pending', 'reviewed', 'resolved', 'dismissed')
   - `admin_remarks`, `created_at`, `updated_at`

---

## 🔄 Complete User Flows

### **Flow 1: Individual User (Donator) Journey**

1. **Sign Up / Login**
   - User signs up as "User" (individual)
   - Logs in → Redirected to User Dashboard

2. **Donate Item**
   - Navigate to "Donate Item"
   - Fill form: Title, Description, Category, Location
   - Submit → Item listed on platform

3. **View Requests**
   - Navigate to "My Requests" (or see in dashboard)
   - View all NGOs who requested their items
   - See request status (pending, approved, etc.)

4. **Chat with NGOs**
   - Click "Chat" button next to a request
   - Opens chat interface with the NGO
   - Can send/receive messages in real-time (polling)

5. **View Conversations**
   - Click "Chat" in navbar
   - See list of all active conversations
   - Click to open specific chat

---

### **Flow 2: NGO Journey**

1. **Sign Up**
   - NGO signs up as "NGO Member"
   - **Must provide verification documents** (URLs or file paths)
   - Receives message: "Your registration request has been submitted. Please wait for admin verification."
   - **Cannot log in until approved**

2. **Admin Verification**
   - Admin reviews NGO in "Verify NGOs" section
   - Views submitted documents
   - Approves or Rejects with optional remarks
   - Email notification sent (structure ready)

3. **After Approval - Login**
   - NGO can now log in
   - Redirected to NGO Dashboard

4. **Set Location**
   - In dashboard, set location (City, State)
   - This helps see nearby items first

5. **Browse Items**
   - Navigate to "Browse Items"
   - **Enhanced Features:**
     - Sidebar with filters (collapsible)
     - Search bar for keyword search
     - Filter by category
     - Sort by: Newest, Oldest, Category
     - Items sorted: Nearby Locations first, then Other Locations

6. **Request Item**
   - Click on an item → View details
   - Click "Request This Item"
   - Request created with status "pending"

7. **Chat with Donator**
   - On item details page, click "Chat with Donator"
   - Opens chat interface
   - Can send/receive messages

8. **Manage Requests**
   - Navigate to "Manage Donors - My Requests"
   - View all their requests
   - See status of each request
   - Can cancel requests
   - Can view item details

9. **Create Campaign**
   - Navigate to "Launch Event / Create Campaign"
   - Fill form:
     - Title, Description, Category
     - Image URL (optional)
     - Start Date, End Date (optional)
     - Contact/Donation Link (optional)
   - Submit → Campaign status: "Pending"
   - Admin must approve before it goes live

10. **Report User**
    - Navigate to "Report User"
    - Select user from dropdown
    - Enter reason and description
    - Submit report → Admin reviews it

---

### **Flow 3: Admin Journey**

1. **Login**
   - Admin logs in → Redirected to Admin Dashboard

2. **Dashboard Options:**
   - Manage Categories
   - Manage Users (Donators)
   - Manage NGOs (Requesters)
   - Verify NGOs
   - User Reports
   - View Platform Stats

3. **Verify NGOs**
   - View all pending NGO registrations
   - See NGO details and uploaded documents
   - Approve or Reject with remarks
   - Email notification sent (structure ready)

4. **Manage Users**
   - View all individual users
   - See their donated items
   - Can view item details
   - **Cannot delete items** (restricted)

5. **Manage NGOs**
   - View all NGOs
   - See their requests
   - Can view item details
   - Can delete requests

6. **User Reports**
   - View all reports submitted by NGOs
   - See reported user, reporter, reason, description
   - Update report status: pending, reviewed, resolved, dismissed
   - Add admin remarks

7. **Platform Statistics**
   - View interactive charts:
     - Pie chart: User distribution by role
     - Bar chart: Request status distribution
     - Bar chart: Platform overview (Users, Items, Requests)
   - Colorful, interactive visualizations

8. **Manage Categories**
   - Add new categories
   - Delete categories
   - View all categories

---

## 🌐 Public Features (No Login Required)

1. **Homepage**
   - Hero section with call-to-action
   - **Active Campaigns Section:**
     - Search campaigns by keyword
     - Filter by category
     - View all approved campaigns in card format
     - Click "View Details" to see full campaign
   - Impact statistics
   - Gallery section

2. **Browse Items**
   - View all available items
   - Click to see item details
   - Can request item (if logged in as NGO)

3. **Campaign Details**
   - Public page showing full campaign information
   - NGO name and location
   - Description, dates, category
   - Contact/Donation link

---

## 🔌 API Endpoints

### **Users (`/api/users`)**
- `POST /` - Create user (signup)
- `POST /login` - Login (blocks unapproved NGOs)
- `GET /` - Get all users
- `GET /role/:role` - Get users by role (admin only)
- `GET /for-reporting` - Get individual users for NGO reporting (NGO only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user (location, etc.)

### **Items (`/api/items`)**
- `GET /` - Get all items (public)
- `GET /category/:id` - Get items by category
- `GET /:id` - Get item by ID
- `POST /add` - Create item (authenticated)
- `PUT /:id` - Update item
- `DELETE /:id` - Delete item (owner or admin)
- `GET /user/:userId` - Get items by user
- `GET /admin/all` - Get all items with owner info (admin)

### **Categories (`/api/categories`)**
- `GET /` - Get all categories
- `POST /add` - Add category (admin)
- `DELETE /:id` - Delete category (admin)

### **Requests (`/api/requests`)**
- `GET /` - Get all requests (admin)
- `GET /pending` - Get pending requests (admin)
- `GET /my-requests` - Get current user's requests
- `POST /add` - Create request
- `PUT /:id/status` - Update request status
- `PUT /:id/approve` - Approve request (shortcut)
- `PUT /:id/reject` - Reject request (shortcut)
- `PUT /:id/complete` - Mark complete (shortcut)
- `DELETE /:id` - Delete request (requester or admin)

### **Messages (`/api/messages`)**
- `GET /conversation/:itemId/:otherUserId` - Get conversation messages
- `GET /conversations` - Get all conversations for current user
- `POST /send` - Send a message

### **Campaigns (`/api/campaigns`)**
- `GET /` - Get all active campaigns (public, with search & category filter)
- `GET /:id` - Get campaign by ID (public)
- `POST /` - Create campaign (NGO only)
- `GET /ngo/my-campaigns` - Get NGO's campaigns
- `GET /admin/pending` - Get pending campaigns (admin)
- `PUT /:id/approve` - Approve/reject campaign (admin)

### **NGO Verification (`/api/ngo-verification`)**
- `GET /pending` - Get pending NGOs (admin)
- `GET /` - Get all NGOs (admin)
- `PUT /:id/verify` - Approve/reject NGO (admin)

### **Reports (`/api/reports`)**
- `POST /` - Create report (NGO only)
- `GET /` - Get all reports (admin)
- `PUT /:id/status` - Update report status (admin)

### **Admin (`/api/admins`)**
- `GET /stats` - Get platform statistics (admin)

---

## 📱 Frontend Pages

### **Public Pages:**
1. **HomePage** - Landing page with campaigns
2. **ItemsListPage** - Browse all items
3. **ItemDetailsPage** - View item details
4. **CampaignDetailsPage** - View campaign details
5. **LoginPage** - User login
6. **SignUpPage** - User registration (with NGO document upload)
7. **AboutPage** - About information
8. **ContactPage** - Contact information

### **Individual User Pages:**
1. **UserDashboard** - User's main dashboard
2. **CreateItemPage** - Donate an item
3. **EditItemPage** - Edit donated item
4. **MyRequestsPage** - View requests for user's items
5. **ChatPage** - Individual chat conversation
6. **ConversationsListPage** - List of all conversations

### **NGO Pages:**
1. **NgoDashboard** - NGO's main dashboard
2. **ItemsListPage** - Browse items (with enhanced filters)
3. **NgoRequestsPage** - Manage NGO's requests
4. **CreateCampaignPage** - Create campaign/event
5. **NgoReportUserPage** - Report a user
6. **ChatPage** - Chat with donors
7. **ConversationsListPage** - List of conversations

### **Admin Pages:**
1. **AdminDashboard** - Admin main dashboard
2. **AdminUsersPage** - Manage users and their donations
3. **AdminNgosPage** - Manage NGOs and their requests
4. **AdminNgoVerificationPage** - Verify NGO registrations
5. **AdminUserReportsPage** - Review user reports
6. **AdminCategoriesPage** - Manage categories
7. **AdminStatsPage** - Platform statistics with charts
8. **AdminRequestsPage** - Manage donation requests (removed from dashboard)

---

## ✨ Key Features Implemented

### **1. Authentication & Authorization**
- ✅ JWT-based authentication
- ✅ Role-based access control (individual, ngo, admin)
- ✅ NGO verification system (blocks login until approved)
- ✅ Protected routes with role checking

### **2. NGO Verification System**
- ✅ Document upload during signup
- ✅ Admin review and approval workflow
- ✅ Status tracking (Pending, Approved, Rejected)
- ✅ Admin remarks
- ✅ Email notification structure (ready for integration)

### **3. Item Management**
- ✅ Donate items with location
- ✅ Browse items (public)
- ✅ Enhanced filtering for NGOs:
  - Search by keyword
  - Filter by category
  - Sort by date/category
  - Location-based sorting (Nearby/Other)
- ✅ Edit/Delete items (owner or admin)
- ✅ View item details

### **4. Request Management**
- ✅ NGOs can request items
- ✅ Status tracking (pending, approved, rejected, completed)
- ✅ Admin can approve/reject/complete
- ✅ Users can view requests for their items
- ✅ NGOs can manage their requests
- ✅ Delete/cancel requests

### **5. Chat System**
- ✅ Real-time messaging (polling every 3 seconds)
- ✅ Conversation list page
- ✅ Individual chat pages
- ✅ Message history
- ✅ Authorization checks (only item owner and requester can chat)

### **6. NGO Campaigns**
- ✅ Create campaigns with full details
- ✅ Admin approval workflow
- ✅ Public display on homepage
- ✅ Search and filter campaigns
- ✅ Campaign details page
- ✅ Category-based organization

### **7. User Reporting System**
- ✅ NGOs can report users
- ✅ Admin review and management
- ✅ Status tracking (pending, reviewed, resolved, dismissed)
- ✅ Admin remarks

### **8. Admin Panel**
- ✅ User management (view only, no deletion of items)
- ✅ NGO management (view and manage requests)
- ✅ NGO verification
- ✅ Campaign approval
- ✅ User reports review
- ✅ Category management
- ✅ Platform statistics with charts:
  - Pie charts for user distribution
  - Bar charts for request status
  - Overview statistics

### **9. Location Features**
- ✅ Users can add location when donating
- ✅ NGOs can set/update location
- ✅ Location-based item sorting (Nearby/Other)
- ✅ Location display on items

### **10. Enhanced UI/UX**
- ✅ Responsive design
- ✅ Interactive charts (Recharts library)
- ✅ Collapsible filter panels
- ✅ Dynamic filtering and sorting
- ✅ Error handling and user feedback
- ✅ Loading states
- ✅ Empty state messages

---

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Role-Based Access Control** - Routes protected by user role
3. **NGO Verification** - Only approved NGOs can access platform
4. **Authorization Checks** - Users can only modify their own data
5. **Admin-Only Routes** - Sensitive operations restricted to admins
6. **Input Validation** - Joi schema validation on backend
7. **SQL Injection Protection** - Parameterized queries

---

## 📊 Platform Statistics

The admin can view:
- Total users, items, requests
- User distribution by role (pie chart)
- Request status distribution (bar chart)
- Platform overview (bar chart)

---

## 🚀 Technology Stack

### **Backend:**
- Node.js + Express
- MySQL (mysql2/promise)
- JWT for authentication
- Joi for validation
- CORS enabled

### **Frontend:**
- React (Vite)
- React Router DOM
- Recharts for visualizations
- Context API for state management

### **Development:**
- Vite proxy for API calls
- Environment variables (.env)
- Database migrations via scripts

---

## 📝 Important Notes

1. **Email Notifications**: Structure is ready but requires email service integration (e.g., nodemailer)

2. **File Uploads**: Currently uses URL-based document storage. For production, implement actual file upload (e.g., Multer + cloud storage)

3. **Password Security**: Currently stores plain text. For production, implement bcrypt hashing

4. **Real-time Chat**: Currently uses polling (3-second intervals). For production, consider WebSockets

5. **Campaign Approval**: Admin can approve campaigns via API, but UI for this can be added to admin panel

---

## 🎯 Complete Feature Checklist

### ✅ Implemented:
- [x] User authentication (login/signup)
- [x] Role-based access control
- [x] NGO verification system
- [x] Item donation and management
- [x] Request system
- [x] Chat/messaging system
- [x] Location-based features
- [x] NGO campaigns
- [x] User reporting system
- [x] Admin panel with all management features
- [x] Platform statistics with charts
- [x] Enhanced Browse Items with filters
- [x] Category management
- [x] Public campaign display
- [x] Search and filter functionality

### 🔄 Ready for Enhancement:
- [ ] Email notification integration
- [ ] File upload for documents
- [ ] Password hashing
- [ ] WebSocket for real-time chat
- [ ] Campaign approval UI in admin panel
- [ ] Image upload for items/campaigns

---

## 📂 Project Structure

```
fullstack-project/
├── Repurpose/
│   ├── backend/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── config/          # Database connection
│   │   ├── validators/      # Joi schemas
│   │   ├── scripts/         # Database migrations
│   │   └── server.js        # Main server file
│   └── schema.sql           # Database schema
│
└── Minorproject/
    └── frontend/
        ├── src/
        │   ├── api/         # API service functions
        │   ├── components/  # Reusable components
        │   ├── pages/       # Page components
        │   ├── hooks/       # Custom hooks
        │   ├── context/     # React context
        │   └── App.jsx      # Main app with routes
        └── vite.config.js   # Vite configuration
```

---

## 🎉 Summary

The Repurpose platform is a **fully functional donation management system** with:

- **3 user roles** with distinct permissions
- **Complete NGO verification workflow**
- **Item donation and request system**
- **Real-time chat functionality**
- **Campaign/event management**
- **User reporting system**
- **Comprehensive admin panel**
- **Interactive data visualizations**
- **Enhanced filtering and search**
- **Location-based features**

All core features are implemented and working. The platform is ready for use with potential enhancements for production deployment (email, file uploads, password hashing, WebSockets).

