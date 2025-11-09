// Script to create ngo_campaigns table
const db = require('../config/db');
require('dotenv').config();

async function createCampaignsTable() {
  try {
    console.log('Creating ngo_campaigns table...');
    
    const query = `
      CREATE TABLE IF NOT EXISTS ngo_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ngo_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(500),
        start_date DATE,
        end_date DATE,
        contact_link VARCHAR(500),
        approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_ngo (ngo_id),
        INDEX idx_status (approval_status),
        INDEX idx_dates (start_date, end_date)
      )
    `;
    
    await db.query(query);
    console.log('✅ ngo_campaigns table created successfully!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('✓ ngo_campaigns table already exists');
      process.exit(0);
    } else {
      console.error('❌ Error creating ngo_campaigns table:', error);
      process.exit(1);
    }
  }
}

createCampaignsTable();

