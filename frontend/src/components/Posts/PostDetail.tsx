import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post, Comment } from '../../types/index';
import { useAuth } from '../../context/AuthContext'; // Replace 'path/to/useAuth' with the actual path to the useAuth hook
import api from '../../services/api'

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const [postResponse, commentsResponse] = await Promise.all([
            api.posts.getOne(id),
            api.comments.getForPost(id)
          ]);

          setPost(postResponse.data);
          setComments(commentsResponse.data.comments);

          // Record view
          await api.analytics.recordView(id);
        } catch (error) {
          console.error('Error fetching post data:', error);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id || !newComment.trim()) return;

    try {
      const response = await api.comments.create(id, newComment, token);
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="mb-8">{post.content}</p>

      {token && (
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Comment
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="p-4 border rounded">
            <p>{comment.content}</p>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;