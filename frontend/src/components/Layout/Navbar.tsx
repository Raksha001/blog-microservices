import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Replace 'path/to/useAuth' with the actual path to the useAuth file

const Navbar: React.FC = () => {
    const { token, logout } = useAuth();
  
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/posts" className="hover:text-gray-300">Posts</Link>
            {token && (
              <Link to="/posts/create" className="hover:text-gray-300">Create Post</Link>
            )}
          </div>
          <div className="flex space-x-4">
            {!token ? (
              <>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
              </>
            ) : (
              <button onClick={logout} className="hover:text-gray-300">Logout</button>
            )}
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;