import axios from "axios";

const API_URL = "http://localhost:4000/api/posts"; // Backend URL

export const getPosts = async (params = {}) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getPostBySlug = async (slug) => {
  const res = await axios.get(`${API_URL}/${slug}`);
  return res.data;
};

export const createPost = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updatePost = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
