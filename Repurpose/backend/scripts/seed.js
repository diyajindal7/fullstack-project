const db = require('../config/db');
require('dotenv').config();

async function run() {
  try {
    console.log('Seeding database...');

    // Ensure DB name from env exists (schema should be created already via schema.sql)
    // Insert categories
    const categories = [
      ['Clothing', 'Wearable items for donation'],
      ['Books', 'Educational and reading material'],
      ['Furniture', 'Household furniture'],
      ['Electronics', 'Gadgets and devices'],
    ];

    for (const [name, description] of categories) {
      await db.query(
        'INSERT IGNORE INTO categories (name, description) VALUES (?, ?)',
        [name, description]
      );
    }

    // Insert users (admin, ngos, individuals)
    const users = [
      ['Admin User', 'admin@app.com', 'admin123', 'admin'],
      ['Green Earth Foundation', 'green@ngo.org', 'password', 'ngo'],
      ['City Hope NGO', 'hope@ngo.org', 'password', 'ngo'],
      ['John Doe', 'john@example.com', 'password', 'individual'],
      ['Jane Smith', 'jane@example.com', 'password', 'individual'],
    ];

    for (const [name, email, password, user_type] of users) {
      await db.query(
        'INSERT IGNORE INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)',
        [name, email, password, user_type]
      );
    }

    // Get ids for relationships
    const [[admin]] = await db.query('SELECT id FROM users WHERE email = ?', ['admin@app.com']);
    const [[john]] = await db.query('SELECT id FROM users WHERE email = ?', ['john@example.com']);
    const [[jane]] = await db.query('SELECT id FROM users WHERE email = ?', ['jane@example.com']);
    const [[categoryBooks]] = await db.query('SELECT id FROM categories WHERE name = ?', ['Books']);
    const [[categoryClothing]] = await db.query('SELECT id FROM categories WHERE name = ?', ['Clothing']);

    // Insert items owned by users
    const items = [
      ['Gently used novels', 'Box of assorted novels', categoryBooks.id, john.id],
      ['Winter jackets', 'Men and women jackets', categoryClothing.id, jane.id],
    ];

    for (const [title, description, category_id, user_id] of items) {
      await db.query(
        'INSERT INTO items (title, description, category_id, user_id) VALUES (?, ?, ?, ?)',
        [title, description, category_id, user_id]
      );
    }

    // Insert a request
    const [[oneItem]] = await db.query('SELECT id FROM items ORDER BY id DESC LIMIT 1');
    await db.query(
      "INSERT INTO requests (item_id, requester_id, status) VALUES (?, ?, 'pending')",
      [oneItem.id, admin.id]
    );

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();


