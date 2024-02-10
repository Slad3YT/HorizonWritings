// blogService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createBlog = async (blogData) => {
  try {
    const response = await axios.post(`${API_URL}/blogs`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const readBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogs`);
    return response.data;
  } catch (error) {
    console.error('Error reading blogs:', error);
    throw error;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const response = await axios.put(`${API_URL}/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error reading blog:', error);
    throw error;
  }
};

export const createComment = async (blogId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/${blogId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getCommentsByBlogId = async (blogId) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${blogId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error getting comments by blog ID:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};