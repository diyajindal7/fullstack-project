import API_BASE_URL from './apiClient';

// ==============================
// Get all public items
// ==============================
export const getItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch items");
    return data.items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// ==============================
// Get item by ID (public)
// ==============================
export const getItemById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Item not found");
    return data.item;
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
};

// ==============================
// Create a new item (user upload)
// ==============================
export const createItem = async (itemData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/items/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // ⚠️ No 'Content-Type' header here — because itemData should be FormData (for image uploads)
      },
      body: itemData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create item");
    return data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

// ==============================
// Update an item (owner only)
// ==============================
export const updateItem = async (itemId, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update item");
    return data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// ==============================
// Delete an item (owner only)
// ==============================
export const deleteItem = async (itemId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete item");
    return data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// ==============================
// Get all items for admin (includes owner info)
// ==============================
export const getAllItems = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/items/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch all items");
    return data.items;
  } catch (error) {
    console.error("Error fetching all items (admin):", error);
    throw error;
  }
};



// ==============================
// Get items uploaded by a specific user
// ==============================
export const getItemsByUserId = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/items/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch user items");
    return data.items;
  } catch (error) {
    console.error("Error fetching items by user ID:", error);
    throw error;
  }
};
