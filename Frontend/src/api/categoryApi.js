import axios from "axios";

const API_URL = "http://localhost:5000/api/category"; // Backend URL

export const getCategories = async (params = {}) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getCategoryBySlug = async (slug) => {
  const res = await axios.get(`${API_URL}/${slug}`);
  return res.data;
};

export const createCategory = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
