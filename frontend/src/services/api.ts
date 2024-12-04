import axios from 'axios';

const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:5001';
const POSTS_URL = process.env.REACT_APP_POSTS_URL || 'http://localhost:3003';
const COMMENTS_URL = process.env.REACT_APP_COMMENTS_URL || 'http://localhost:3002';
const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_URL || 'http://localhost:3004';

const api = {
  auth: {
    login: (email: string, password: string) =>
      axios.post(`${AUTH_URL}/login`, { email, password }),
    register: (email: string, password: string) =>
      axios.post(`${AUTH_URL}/register`, { email, password }),
  },
  posts: {
    getAll: (page = 1) => 
      axios.get(`${POSTS_URL}/posts?page=${page}`),
    getOne: (id: string) =>
      axios.get(`${POSTS_URL}/posts/${id}`),
    create: (title: string, content: string, token: string) =>
      axios.post(`${POSTS_URL}/posts`, 
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    update: (id: string, title: string, content: string, token: string) =>
      axios.put(`${POSTS_URL}/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    delete: (id: string, token: string) =>
      axios.delete(`${POSTS_URL}/posts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
  },
  comments: {
    getForPost: (postId: string, page = 1) =>
      axios.get(`${COMMENTS_URL}/posts/${postId}/comments?page=${page}`),
    create: (postId: string, content: string, token: string) =>
      axios.post(`${COMMENTS_URL}/posts/${postId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    update: (commentId: string, content: string, token: string) =>
      axios.put(`${COMMENTS_URL}/comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    delete: (commentId: string, token: string) =>
      axios.delete(`${COMMENTS_URL}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
  },
  analytics: {
    recordView: (postId: string) =>
      axios.post(`${ANALYTICS_URL}/posts/${postId}/view`),
    getViews: (postId: string) =>
      axios.get(`${ANALYTICS_URL}/posts/${postId}/views`),
  },
};

export default api;