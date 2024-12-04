import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
// import RegisterForm from './components/Auth/RegisterForm';
import PostList from './components/Posts/PostList';
// import PostDetail from './components/Posts/PostDetail';
// import CreatePost from './components/Posts/CreatePost';
import Navbar from './components/Layout/Navbar';
import './index.css';



// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto py-8">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/login" element={<LoginForm />} />
              {/* <Route path="/register" element={<RegisterForm />} /> */}
              <Route path="/posts" element={<PostList />} />
              {/* <Route path="/posts/:id" element={<PostDetail />} /> */}
              <Route 
                path="/posts/create" 
                element={
                  <ProtectedRoute>
                    {/* <CreatePost /> */}
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;