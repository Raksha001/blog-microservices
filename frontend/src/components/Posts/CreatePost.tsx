import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Replace 'path/to/useAuth' with the actual path to the useAuth hook
import { useNavigate } from "react-router"; // Replace 'path/to/useNavigate' with the actual path to the useNavigate hook
import api from '../../services/api'; // Replace 'path/to/api' with the actual path to the api module

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token) return;
  
      try {
        const response = await api.posts.create(title, content, token);
        navigate(`/posts/${response.data._id}`);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post content"
          className="w-full p-2 border rounded h-32"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>
    );
  };