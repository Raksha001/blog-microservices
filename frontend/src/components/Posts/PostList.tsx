import React, { useEffect, useState } from "react";
import api from "../../services/api";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.posts.getAll(page);
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, [page]);



  return (
    <div className="space-y-4">
      {posts.map((post) => (
        
        <div key={post._id} className="p-4 border rounded m-4">
          <a href={`/posts/${post._id}`}>
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.content}</p>
          </a>
        </div>
      ))}
      <div className="flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;
