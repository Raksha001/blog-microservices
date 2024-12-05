import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post, Comment } from "../../types/index";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  let navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post?.title || "",
    content: post?.content || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const [postResponse, commentsResponse] = await Promise.all([
            api.posts.getOne(id),
            api.comments.getForPost(id),
          ]);

          setPost(postResponse.data);
          setComments(commentsResponse.data.comments);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async (postId: string) => {
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      await api.posts.delete(postId, token);
      navigate("/posts");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleUpdate = async (postId: string, updatedPost: Post) => {
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await api.posts.update(
        postId,
        updatedPost.title,
        updatedPost.content,
        token
      );
      setPost(response.data);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleSave = () => {
    if (post) {
      const updatedPost: Post = {
        _id: post._id,
        authorId: post.authorId,
        createdAt: post.createdAt,
        title: editedPost.title,
        content: editedPost.content,
      };
      handleUpdate(post._id, updatedPost);
    }
    setIsEditing(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id || !newComment.trim()) return;

    try {
      const response = await api.comments.create(id, newComment, token);
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {isEditing ? (
        <div className="mb-8">
          <input
            type="text"
            value={editedPost.title}
            onChange={(e) =>
              setEditedPost({ ...editedPost, title: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded"
            placeholder="Edit title"
          />
          <textarea
            value={editedPost.content}
            onChange={(e) =>
              setEditedPost({ ...editedPost, content: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Edit content"
          />
          <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded flex items-center"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="mb-8">{post.content}</p>
        </>
      )}

      {token && !isEditing && (
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(post._id)}
            className="px-4 py-2 bg-red-500 text-white rounded flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete
          </button>
        </div>
      )}

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
