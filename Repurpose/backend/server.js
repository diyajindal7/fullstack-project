// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(cors());

// ======================
// Routes
// ======================
app.get('/', (req, res) => {
  res.json({ message: 'RePurpose API is running 🚀' });
});


// Import and use all route files
const usersRoute = require('./routes/users');
const categoriesRoute = require('./routes/categories');
const itemsRoute = require('./routes/items');
const requestsRoute = require('./routes/requests');
const adminRoute = require('./routes/admin');
const messagesRoute = require('./routes/messages');
const reportsRoute = require('./routes/reports');
const ngoVerificationRoute = require('./routes/ngoVerification');
const campaignsRoute = require('./routes/campaigns');
const pointsRoute = require('./routes/points');
const impactRoute = require('./routes/impact');
// Use them with /api prefix
app.use('/api/users', usersRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/items', itemsRoute);
app.use('/api/requests', requestsRoute);
app.use('/api/admins', adminRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/reports', reportsRoute);
app.use('/api/ngo-verification', ngoVerificationRoute);
app.use('/api/campaigns', campaignsRoute);
app.use('/api/points', pointsRoute);
app.use('/api/impact', impactRoute);

// ======================
// Error Handler (must be last)
// ======================
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
