import axios from "axios";

const API_URL = "http://localhost:5000/api/products"; // Backend URL

export const getProducts = async (params = {}) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getProductBySlug = async (slug) => {
  const res = await axios.get(`${API_URL}/${slug}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};