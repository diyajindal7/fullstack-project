// src/api/categoriesService.js
import API_BASE_URL from './apiClient';

// ✅ Get all categories (Public)
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch categories");
    return data.categories; // ✅ matches backend response { success, categories }
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ✅ Add new category (Admin only)
export const addCategory = async (categoryName, description = "") => {
  try {
    const token = localStorage.getItem('token'); // assuming you store JWT here
    const response = await fetch(`${API_BASE_URL}/api/categories/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ✅ required for admin routes
      },
      body: JSON.stringify({ name: categoryName, description }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add category");
    return data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// ✅ Delete category (Admin only)
export const deleteCategory = async (categoryId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete category");
    return data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
