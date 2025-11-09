// Script to add verification fields to users table
const db = require('../config/db');
require('dotenv').config();

async function addVerificationFields() {
  try {
    console.log('Checking and adding verification fields...');
    
    // Check and add documents column
    const [docColumns] = await db.query("SHOW COLUMNS FROM users LIKE 'documents'");
    if (docColumns.length === 0) {
      console.log('Adding documents column to users table...');
      await db.query('ALTER TABLE users ADD COLUMN documents TEXT');
      console.log('✓ Documents column added');
    } else {
      console.log('✓ Documents column already exists');
    }
    
    // Check and add verification_status column
    const [statusColumns] = await db.query("SHOW COLUMNS FROM users LIKE 'verification_status'");
    if (statusColumns.length === 0) {
      console.log('Adding verification_status column to users table...');
      await db.query("ALTER TABLE users ADD COLUMN verification_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'");
      console.log('✓ Verification_status column added');
    } else {
      console.log('✓ Verification_status column already exists');
    }
    
    // Check and add remarks column
    const [remarksColumns] = await db.query("SHOW COLUMNS FROM users LIKE 'remarks'");
    if (remarksColumns.length === 0) {
      console.log('Adding remarks column to users table...');
      await db.query('ALTER TABLE users ADD COLUMN remarks TEXT');
      console.log('✓ Remarks column added');
    } else {
      console.log('✓ Remarks column already exists');
    }
    
    // Set default verification_status for existing NGOs
    await db.query("UPDATE users SET verification_status = 'Approved' WHERE user_type = 'ngo' AND verification_status IS NULL");
    console.log('✓ Updated existing NGOs to Approved status');
    
    console.log('✅ All verification fields are ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding verification fields:', error);
    process.exit(1);
  }
}

addVerificationFields();

