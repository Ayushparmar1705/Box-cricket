// ============================================================================
// File: categoryService.ts
// Description: Sport Category API Service for Box Cricket Application
// ============================================================================

import baseUrl from '../../api/Api';

export interface CategoryItem {
  id: string | number;
  category_name?: string;
  name?: string;
  created_at?: string;
}

export interface CategoryPayload {
  category_name: string;
  name?: string;
}

const getCategoryAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const create = async (formData: CategoryPayload | { category_name?: string; name?: string }) => {
  const categoryName = (formData.category_name || formData.name || '').trim();
  const url = `${baseUrl.category}/api/category`;
  const response = await fetch(url, {
    method: "POST",
    headers: getCategoryAuthHeaders(),
    body: JSON.stringify({ category_name: categoryName }),
  });

  const contentType = response.headers.get("content-type");
  let result: any = null;
  if (contentType && contentType.includes("application/json")) {
    result = await response.json().catch(() => null);
  } else {
    result = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const errorMsg =
      (result && typeof result === 'object' && (result.message || result.error || result.category_name)) ||
      (typeof result === 'string' && result) ||
      `Failed to create category (Status ${response.status})`;
    throw new Error(errorMsg);
  }

  return result;
};

export const view = async (): Promise<CategoryItem[]> => {
  try {
    const url = `${baseUrl.category}/api/category`;
    const response = await fetch(url, {
      method: "GET",
      headers: getCategoryAuthHeaders(),
    });

    if (!response.ok) {
      console.warn(`Category view API returned status ${response.status}`);
      return [];
    }

    const result = await response.json();
    return Array.isArray(result) ? result : (result.data || []);
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};