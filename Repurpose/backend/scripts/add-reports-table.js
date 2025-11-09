// Script to create user_reports table for NGO reporting system
const db = require('../config/db');
require('dotenv').config();

async function addReportsTable() {
  try {
    console.log('Creating user_reports table...');
    
    const query = `
      CREATE TABLE IF NOT EXISTS user_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reported_user_id INT NOT NULL,
        reporter_id INT NOT NULL,
        reason VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
        admin_remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_reported_user (reported_user_id),
        INDEX idx_reporter (reporter_id),
        INDEX idx_status (status)
      )
    `;
    
    await db.query(query);
    console.log('✅ user_reports table created successfully!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('✓ user_reports table already exists');
      process.exit(0);
    } else {
      console.error('❌ Error creating user_reports table:', error);
      process.exit(1);
    }
  }
}

addReportsTable();

