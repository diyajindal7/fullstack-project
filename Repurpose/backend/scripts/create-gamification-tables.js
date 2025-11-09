// Script to create gamification and impact tracking tables
const db = require('../config/db');
require('dotenv').config();

async function createGamificationTables() {
  try {
    console.log('Creating gamification and impact tracking tables...');
    
    // Create donor_points table
    const pointsQuery = `
      CREATE TABLE IF NOT EXISTS donor_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        points INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_points (points DESC)
      )
    `;
    
    await db.query(pointsQuery);
    console.log('✓ donor_points table created');
    
    // Create impact_updates table
    const impactQuery = `
      CREATE TABLE IF NOT EXISTS impact_updates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT NOT NULL,
        ngo_id INT NOT NULL,
        message TEXT NOT NULL,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
        FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_ngo (ngo_id),
        INDEX idx_item (item_id),
        INDEX idx_created (created_at DESC)
      )
    `;
    
    await db.query(impactQuery);
    console.log('✓ impact_updates table created');
    
    console.log('✅ All gamification tables created successfully!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('✓ Tables already exist');
      process.exit(0);
    } else {
      console.error('❌ Error creating tables:', error);
      process.exit(1);
    }
  }
}

createGamificationTables();

