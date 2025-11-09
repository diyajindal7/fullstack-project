// Script to add location columns to items and users tables
const db = require('../config/db');
require('dotenv').config();

async function addLocationColumns() {
  try {
    console.log('Checking and adding location columns...');
    
    // Check if location column exists in items table
    const [itemsColumns] = await db.query("SHOW COLUMNS FROM items LIKE 'location'");
    if (itemsColumns.length === 0) {
      console.log('Adding location column to items table...');
      await db.query('ALTER TABLE items ADD COLUMN location VARCHAR(255)');
      console.log('✓ Location column added to items table');
    } else {
      console.log('✓ Location column already exists in items table');
    }
    
    // Check if location column exists in users table
    const [usersColumns] = await db.query("SHOW COLUMNS FROM users LIKE 'location'");
    if (usersColumns.length === 0) {
      console.log('Adding location column to users table...');
      await db.query('ALTER TABLE users ADD COLUMN location VARCHAR(255)');
      console.log('✓ Location column added to users table');
    } else {
      console.log('✓ Location column already exists in users table');
    }
    
    console.log('✅ All location columns are ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding location columns:', error);
    process.exit(1);
  }
}

addLocationColumns();

