const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// ======================
// GET messages for a conversation (between two users about an item)
// ======================
router.get('/conversation/:itemId/:otherUserId', auth(), async (req, res, next) => {
  try {
    const { itemId, otherUserId } = req.params;
    const currentUserId = req.user.id;
    const otherUserIdInt = parseInt(otherUserId);
    const itemIdInt = parseInt(itemId);

    console.log('🔍 Conversation request:', {
      itemId: itemIdInt,
      otherUserId: otherUserIdInt,
      currentUserId: currentUserId
    });

    // Verify that current user is either the item owner or the requester
    const [itemCheck] = await db.query('SELECT user_id FROM items WHERE id = ?', [itemIdInt]);
    if (itemCheck.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const itemOwnerId = itemCheck[0].user_id;
    const isItemOwner = currentUserId === itemOwnerId;
    
    console.log('🔍 Item info:', {
      itemOwnerId: itemOwnerId,
      isItemOwner: isItemOwner,
      currentUserId: currentUserId,
      otherUserId: otherUserIdInt
    });
    
    // Authorization: 
    // - If current user is item owner, they can chat with anyone (otherUserId)
    // - If current user is NOT item owner, they can only chat with the item owner
    if (!isItemOwner && otherUserIdInt !== itemOwnerId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this conversation. You can only chat with the item owner.' 
      });
    }

    // Get messages between current user and other user about this item
    // This should get all messages where:
    // - Current user sent to other user, OR
    // - Other user sent to current user
    // Using CAST to ensure type matching
    const query = `
      SELECT m.*, u.name AS sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE CAST(m.item_id AS UNSIGNED) = ? 
        AND (
          (CAST(m.sender_id AS UNSIGNED) = ? AND CAST(m.receiver_id AS UNSIGNED) = ?) 
          OR 
          (CAST(m.sender_id AS UNSIGNED) = ? AND CAST(m.receiver_id AS UNSIGNED) = ?)
        )
      ORDER BY m.created_at ASC
    `;

    console.log('🔍 Query params:', {
      itemId: itemIdInt,
      currentUserId: currentUserId,
      otherUserId: otherUserIdInt
    });

    const [messages] = await db.query(query, [
      itemIdInt,
      currentUserId,
      otherUserIdInt,
      otherUserIdInt,
      currentUserId
    ]);

    console.log('🔍 Found messages:', messages.length);
    if (messages.length > 0) {
      console.log('🔍 First message:', {
        id: messages[0].id,
        sender_id: messages[0].sender_id,
        receiver_id: messages[0].receiver_id,
        item_id: messages[0].item_id,
        sender_name: messages[0].sender_name
      });
    } else {
      // Debug: Check if there are any messages for this item at all
      const [allItemMessages] = await db.query(
        'SELECT * FROM messages WHERE item_id = ?',
        [itemIdInt]
      );
      console.log('🔍 All messages for this item:', allItemMessages.length);
      if (allItemMessages.length > 0) {
        console.log('🔍 Sample message from item:', {
          id: allItemMessages[0].id,
          sender_id: allItemMessages[0].sender_id,
          receiver_id: allItemMessages[0].receiver_id,
          item_id: allItemMessages[0].item_id
        });
      }
    }

    res.json({ success: true, messages });
  } catch (err) {
    console.error('❌ Error in conversation route:', err);
    next(err);
  }
});

// ======================
// GET all conversations for current user (list of people they've chatted with)
// ======================
router.get('/conversations', auth(), async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    // Get all messages for current user
    const [allMessages] = await db.query(`
      SELECT m.*, 
        CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END AS other_user_id,
        CASE WHEN m.sender_id = ? THEN u2.name ELSE u1.name END AS other_user_name,
        i.title AS item_title
      FROM messages m
      LEFT JOIN users u1 ON m.sender_id = u1.id
      LEFT JOIN users u2 ON m.receiver_id = u2.id
      JOIN items i ON m.item_id = i.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at DESC
    `, [currentUserId, currentUserId, currentUserId, currentUserId]);

    // Group by item_id and other_user_id to get unique conversations
    const conversationsMap = new Map();
    allMessages.forEach(msg => {
      const key = `${msg.item_id}_${msg.other_user_id}`;
      const existing = conversationsMap.get(key);
      
      // If this conversation doesn't exist, or this message is newer, update it
      if (!existing || new Date(msg.created_at) > new Date(existing.last_message_time)) {
        conversationsMap.set(key, {
          item_id: msg.item_id,
          item_title: msg.item_title,
          other_user_id: msg.other_user_id,
          other_user_name: msg.other_user_name,
          last_message: msg.message,
          last_message_time: msg.created_at
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    conversations.sort((a, b) => {
      const timeA = new Date(a.last_message_time || 0);
      const timeB = new Date(b.last_message_time || 0);
      return timeB - timeA;
    });

    console.log('🔍 Conversations list:', conversations.length, 'conversations found');
    res.json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
});

// ======================
// POST send a message
// ======================
router.post('/send', auth(), async (req, res, next) => {
  try {
    const { item_id, receiver_id, message } = req.body;
    const sender_id = req.user.id;

    if (!item_id || !receiver_id || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'item_id, receiver_id, and message are required' 
      });
    }

    // Verify item exists and user has permission to message about it
    const [itemCheck] = await db.query('SELECT user_id FROM items WHERE id = ?', [item_id]);
    if (itemCheck.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const itemOwnerId = itemCheck[0].user_id;
    const isItemOwner = sender_id === itemOwnerId;
    const isRequester = sender_id === receiver_id || receiver_id === itemOwnerId;

    // Verify sender is either item owner or requester, and receiver is the other party
    if (!isItemOwner && sender_id !== receiver_id) {
      // Check if there's a request from sender for this item (if sender is requester)
      const [requestCheck] = await db.query(
        'SELECT id FROM requests WHERE item_id = ? AND requester_id = ?',
        [item_id, sender_id]
      );
      // Allow if: sender is item owner messaging requester, OR sender is requester messaging owner
      const isSenderRequester = requestCheck.length > 0;
      const isReceiverOwner = receiver_id === itemOwnerId;
      
      if (!isSenderRequester && !isReceiverOwner) {
        return res.status(403).json({ 
          success: false, 
          message: 'You can only message the item owner or someone who requested this item' 
        });
      }
    }

    // Insert message
    const insertQuery = `
      INSERT INTO messages (item_id, sender_id, receiver_id, message)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [item_id, sender_id, receiver_id, message]);

    // Get the created message with sender name
    const [newMessage] = await db.query(`
      SELECT m.*, u.name AS sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage[0]
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

